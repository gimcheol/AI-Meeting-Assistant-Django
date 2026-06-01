from google_stt_mic import *
from extract_keywords import *
from crawling_main import *
from meeting_summary import *
def stt():
        
    print('stt 실행됨')

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
        end_time = time.time()
        for response in responses:
            
            return_text = listen_print_loop(response)
            
            if len(return_text) >= len(stt_text):
                        stt_text = return_text
                        
            if time.time() - start_time >= 60:
                meeting_text += stt_text + ' '
                meeting_text = meeting_text                
                print('meeting_text', meeting_text)
                
                keywords_list = keyword(meeting_text, keywords_list, stopwords)
                print(keywords_list)
                for word in keywords_list[-2:]:
                    print(word)
                    result = crawl(word)
                    print(result)
                
                stt_text = ''
                start_time = time.time()
                
            if time.time() - end_time >=200:
                break
        return meeting_text  
if __name__ == "__main__":
    final_stt=stt()
    mts(final_stt)