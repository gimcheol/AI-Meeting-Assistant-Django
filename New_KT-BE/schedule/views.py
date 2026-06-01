from rest_framework.response import Response
from django.http import JsonResponse, HttpResponse
from rest_framework import generics, status
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate, login
from rest_framework.views import APIView
from rest_framework.decorators import (
    authentication_classes,
    permission_classes,
)
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework.authtoken.models import Token
from .models import Event
from meeting.models import Keyword, News, MeetingSummary
import json
from datetime import datetime, timedelta
from django.utils import timezone
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import traceback
import pytz
from django.http import JsonResponse, FileResponse
from django.views.decorators.http import require_POST, require_GET
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.base import ContentFile
from .serializers import UploadDataSerializer
from .models import FileModel
import os
from django.conf import settings
from rest_framework import serializers
from .serializers import EventSerializer

# File 다운로드
class EventDownload(APIView):
    def get(self, request, event_id, file_id=None):
        try:
            # 이벤트 객체 가져오기
            event = get_object_or_404(Event, id=event_id)

            # 파일이 없으면 404 응답
            if not event.files.exists():
                return HttpResponse(status=404)

            if file_id:
                # 특정 파일 다운로드
                file_model = get_object_or_404(FileModel, id=file_id, event=event)
                file_path = file_model.file.path
                response = FileResponse(open(file_path, 'rb'))
                response['Content-Disposition'] = f'attachment; filename="{os.path.basename(file_path)}"'
                return response
            else:
                file_model = event.files.first()
                file_path = file_model.file.path
                response = FileResponse(open(file_path, 'rb'))
                response['Content-Disposition'] = f'attachment; filename="{os.path.basename(file_path)}"'
                return response

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return HttpResponse(status=500)

@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
#이벤트(일정) 조회
class GetUserEventsView(APIView):

    def get(self, request, *args, **kwargs):
        user_events = Event.objects.filter(user=request.user)
        event_list = []

        for event in user_events:
            event_data = {
                'id': event.id,
                'title': event.title,
                'memo': event.memo,
                'start': event.start.strftime('%Y-%m-%dT%H:%M:%S'),
                'end': event.end.strftime('%Y-%m-%dT%H:%M:%S'),
                'meeting': event.meeting,
            }
            # 만약 이벤트에 파일이 첨부되어 있다면 파일 URL을 추가 , 'file_url' : "서버주소" + file.file.url
            files_data = [{'file_url': "http://127.0.0.1:8000"+file.file.url} for file in event.files.all()]
            event_data['files'] = files_data
            
            event_list.append(event_data)

        print("일정 목록:", event_list)
        return JsonResponse({'events': event_list})

@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
#사용자가 새 이벤트를 생성하는 뷰 클래스
class CreateEventView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        try:
            # 전체 데이터에 접근
            data = request.data

            title = data.get('title', '')
            start_str = data.get('start', '')
            end_str = data.get('end', '')
            memo = data.get('memo', '')
            meeting = data.get('meeting', 'true').lower() == 'true' # 문자열 "true" 또는 "false"를 True 또는 False로 변환
            files1 = request.FILES.getlist('file1')
            files2 = request.FILES.getlist('file2')
            if not title or not start_str:
                return Response({'error': '제목과 시작 시간은 필수 입력 사항입니다.'}, status=status.HTTP_400_BAD_REQUEST)

            # ISO 형식 문자열을 datetime으로 변환
            start = datetime.fromisoformat(start_str.rstrip('Z'))
            end = datetime.fromisoformat(end_str.rstrip('Z'))
            print('start:', start)
            print('end:', end)
            # 한국 시간으로 변환
            start_korea = start+ timedelta(hours=9)
            end_korea = end+ timedelta(hours=9)

            print('start_korea:', start_korea)
            print('end_korea:', end_korea)
            # Event 객체 생성
            event = Event.objects.create(
                title=title,
                memo=memo,
                start=start_korea,
                end=end_korea,
                meeting=meeting,
                user=request.user
            )

            # 업로드된 파일 처리
            for file in files1:
                event.files.create(file=file)

            for file in files2:
                event.files.create(file=file)
                      
            event_data = {
                'title': event.title,
                'memo': event.memo,
                'start': event.start.strftime('%Y-%m-%dT%H:%M:%SZ'),
                'end': event.end.strftime('%Y-%m-%dT%H:%M:%SZ'),
                'meeting': event.meeting,
            }

            return JsonResponse({'event': event_data}, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(f"오류 발생: {str(e)}")
            print(traceback.format_exc())
            return Response({'error': '서버 오류가 발생했습니다.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)        

@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
# 특정 이벤트(일정)의 상세 정보를 조회하는 뷰 클래스.
class EventClick(APIView):
    def get(self, request, event_id):
        # event_id에 해당하는 이벤트 가져오기
        event = get_object_or_404(Event, id=event_id)
        meeting_summary = MeetingSummary.objects.filter(meeting=event).first()
        # 해당 이벤트(일정)의 모든 키워드 가져오기
        keywords = Keyword.objects.filter(meeting=event)
        
        # 키워드 별로 뉴스 리스트를 담을 리스트 초기화
        response_list = []
        
        # 키워드에 해당하는 뉴스 리스트 가져와 response 리스트에 추가
        for keyword in keywords:
            news_list = News.objects.filter(keyword=keyword)
            keyword_data = {
                'keyword': keyword.keyword,
                'article_links': [news.link for news in news_list],
                'article_titles': [news.title for news in news_list],
            }
            response_list.append(keyword_data)
        
        # 이벤트의 세부 정보를 JSON 형식으로 응답
        response_data = {
            'id': event.id,
            'title': event.title,
            'memo': event.memo,
            'start': event.start.strftime('%Y-%m-%dT%H:%M:%S'),
            'end': event.end.strftime('%Y-%m-%dT%H:%M:%S'),
            'meeting': event.meeting,
        }

        # meeting이 True일 때 추가 정보 포함
        if event.meeting:
            if meeting_summary is None:
                meeting_summary_data = {
                    '회의 제목': '',
                    '주요 이슈 및 진행상황': '',
                    '새로운 상황 및 공지사항': '',
                    '추가 안건': '',
                }
            else:
                meeting_summary_data = {
                    '회의 제목': meeting_summary.conference_title,
                    '주요 이슈 및 진행상황': [value.strip() for value in meeting_summary.issues_progress.split(',')],
                    '새로운 상황 및 공지사항': [value.strip() for value in meeting_summary.situation_announcement.split(',')],
                    '추가 안건': [value.strip() for value in meeting_summary.agenda.split(',')],
                }
                
            response_data.update({
                'keywords': response_list,
                'summary': meeting_summary_data,

            })

        # 파일 정보 추가 , 'file_url' : "서버주소" + file.file.url
        files_data = [{'file_url':" http://127.0.0.1:8000"+file.file.url, 'file_name': os.path.basename(file.file.name)} for file in event.files.all()]
        response_data['files'] = files_data
        
        print(response_data)
        return JsonResponse(response_data)

@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
#특정 이벤트를 삭제하는 뷰 클래스.
class EventDelete(APIView):
    def delete(self, request, event_id):
        try:
            event = get_object_or_404(Event, id=event_id)
            print(f"Event to be deleted: {event}")

            # 삭제 권한 확인
            if not request.user.is_authenticated or request.user != event.user:
                return JsonResponse({'error': '권한이 없습니다.'}, status=403)

            # 일정 삭제
            event.delete()

            return JsonResponse({'message': '일정이 성공적으로 삭제되었습니다.'})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            print(traceback.format_exc())
            return JsonResponse({'error': '서버 오류가 발생했습니다.'}, status=500)

@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
class LoginHomeBannerView(APIView):

    def get(self, request):
        now = timezone.now()
        
        closest_event = Event.objects.filter(user=request.user, end__gte=now).order_by('start').first()

        if closest_event:
            closest_event.start = closest_event.start.strftime('%Y-%m-%dT%H:%M:%S')
            closest_event.end = closest_event.end.strftime('%Y-%m-%dT%H:%M:%S')

            serializer = EventSerializer(closest_event)
            print(f"가장 가까운 이벤트: {serializer.data}")
            return Response(serializer.data)
        
        else:
            print("일정이 없습니다.")
            return Response({'message': '다가오는 이벤트가 없습니다.'}, status=status.HTTP_204_NO_CONTENT)