import json, asyncio, time, sys, re, pyaudio, queue
from threading import Thread
from google.cloud import speech
from google.api_core.exceptions import OutOfRange

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

from schedule.models import Event
from .ai.google_stt_mic import *
from .ai.extract_keywords import *
from .ai.crawling_main import *
from .models import Keyword, News
from datetime import datetime, timedelta

class AudioConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.stt_running = True
        self.total_data = None
        
    async def connect(self):

        try:
            # WebSocket에서 Token 가져오기
            token = self.scope.get('query_string').decode('utf-8').split('=')[1]

            # Token 모델을 사용하여 User 가져오기
            user = await self.get_user_from_token(token)

            if user:
                self.user = user
                await self.accept()
            else:
                await self.close()

        except Exception as e:
            print(f"Error connecting: {e}")

    async def disconnect(self, close_code):
        print('disconnect 실행됨')
        pass

    async def stt(self):
        
        print('stt 실행됨')
        total = []
   
        RATE = 16000
        CHUNK = int(RATE / 10)
        
        language_code = 'ko-KR'
        client = speech.SpeechClient()
        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=RATE,
            language_code=language_code)
        streaming_config = speech.StreamingRecognitionConfig(
            config=config,
            interim_results=True)

        start_datetime = datetime.strptime(str(datetime.now()), '%Y-%m-%d %H:%M:%S.%f')
        start_datetime = start_datetime.replace(microsecond=0) + timedelta(hours=9)
        end_meeting= start_datetime + timedelta(minutes=20) 
        start_meeting = start_datetime - timedelta(minutes=20)  
            
        # 주어진 시간 범위에 미팅이 있는지 확인(Meeting인 경우에만 가져옴)
        meetings_in_range = await database_sync_to_async(
            lambda: Event.objects.filter(
                user=self.user, meeting=True, start__range=[start_meeting, end_meeting]
            ).exists()
        )()

        if meetings_in_range:
            meeting = await database_sync_to_async(
                lambda: Event.objects.filter(
                    user=self.user, meeting=True, start__range=[start_meeting, end_meeting]
                ).first()
            )()
            meeting.start = start_datetime
            await database_sync_to_async(meeting.save)()
        else: # 기존 없으면 새로운 미팅 생성
            meeting = await database_sync_to_async(
                Event.objects.create)(
                    title='회의',
                    start=start_datetime,
                    end=start_datetime + timedelta(minutes=40),
                    memo='',
                    meeting=True,
                    user=self.user,
            )
        
        stt_text = ''
        meeting_text = ''
        keywords_list=[]
        stopwords = ["아이디어", "프로젝트","기획 회의","진행","아이디어",'아이디어 기획회의'] # 키워드에서 제외할 단어

        with MicrophoneStream(RATE, CHUNK) as stream:
            audio_generator = stream.generator()
            requests = (speech.StreamingRecognizeRequest(audio_content=content)
                        for content in audio_generator)

            responses = client.streaming_recognize(streaming_config, requests)

            start_time = time.time()
            try:
                for response in responses:
                    
                    return_text = listen_print_loop(response)
                    if not self.stt_running:
                            print('stt 종료됨')
                            break
                        
                    if len(return_text) >= len(stt_text):
                        stt_text = return_text
                        
                    if time.time() - start_time >= 60:
                        meeting_text += stt_text + ' '
                        meeting.meeting_text = meeting_text                
                        print('meeting_text', meeting_text)
                        
                        keywords_list = keyword(meeting_text, keywords_list, stopwords)

                        for word in keywords_list[-2:]:
                            print(word)
                            result = await crawl(word)
                            # 키워드와 최종 뉴스 요약을 Keyword 모델에 저장
                            keyword_instance = await database_sync_to_async(Keyword.objects.create)(
                                meeting=meeting, keyword=word, news_summary=result[0]['news_summary']
                            )
                            # 뉴스 제목과 링크를 News 모델에 저장
                            for i in range(3):
                                try:
                                    await database_sync_to_async(News.objects.create)(
                                        meeting=meeting, keyword=keyword_instance, title=result[0]['title'][i], link=result[0]['link'][i]
                                    )
                                except IndexError:
                                    # 인덱스 오류가 발생하면 로그를 남기고 계속 진행
                                    print(f"IndexError: list index out of range for i={i}")
                            total.append(result)
                        
                        await database_sync_to_async(meeting.save)()  
                        
                        print('self.stt_running_send함수전', self.stt_running)
        
                        self.total_data = total 
                        stt_text = ''
                        start_time = time.time()
            except OutOfRange as e:
                print(f"Error: {e}")
            except Exception as e:
                print(f"Unexpected error: {e}")
    def start_stt_thread(self):
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(self.stt())
        
    async def receive(self, text_data):
        data = json.loads(text_data)
        
        if data['type'] == 'start_meeting':
            # "회의 시작" 메시지를 받으면 WebSocket 시작, stt_thread 시작
            stt_thread = Thread(target=self.start_stt_thread)
            stt_thread.start()
            
        elif data['type'] == 'request_meeting_data':
            # 15초마다 total_data를 요청하는 메시지를 받으면 data 전송(WebSocket)
            print('self.stt_running', self.stt_running)

            if self.stt_running:
                await self.send(text_data=json.dumps({
                    'meeting': 'total',
                    'meeting_data': self.total_data,
                }))

        elif data['type'] == 'finish_meeting':
            # "회의 종료" 메시지를 받으면 WebSocket을 종료
            self.stt_running = False
            print('self.stt_running False로 바뀜', self.stt_running)
            await self.close()

    @database_sync_to_async
    def get_user_from_token(self, token):
        try:
            token_obj = Token.objects.get(key=token)
            return token_obj.user
        except Token.DoesNotExist:
            return None


