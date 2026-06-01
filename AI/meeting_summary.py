import os, re
from openai import OpenAI
from dotenv import load_dotenv
import pandas as pd
import json
from gpt_api import *

def summary_meeting(meeting_text):
    # OpenAI API key
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

    # 프롬프트 정의
    GPT_MODEL = "gpt-3.5-turbo"
    ms = '''
        회의 제목: 
        주요 이슈 및 진행상황: 
        새로운 상황 및 공지사항: 
        추가 안건:
        
    '''
    messages = [
        {"role": "system", "content": "You are the best summarizer for meetings. Summarize the entire content of the meeting efficiently. All responses should be in Korean."},
        {"role": "user", "content": f"{meeting_text}. 앞의 텍스트는 회의 전체 내용이야. 회의 제목, 주요 이슈 및 진행상황, 새로운 상황 및 공지사항, 추가 안건 등이 무조건 포함된 회의록 작성해줘 . 답변은 다음과 같은 형식으로 해줘. {ms}"}
    ]

    # Make API request using the content from the text file
    response = client.chat.completions.create(
        model=GPT_MODEL,
        messages=messages,
        temperature=0
    )
    
    # Extract and return the generated response
    response_message = response.choices[0].message.content

    return response_message
 

def mts(meeting_text): 
    load_dotenv()
    if meeting_text is None:
        return {
            "회의 제목": "",
            "주요 이슈 및 진행상황": "",
            "새로운 상황 및 공지사항": "",
            "추가 안건":"" 
        }
    text = token_check(meeting_text)
    
    # Call the function and print the result
    result = summary_meeting(text) + '\n'
    print('회의록', result)
    
    # pattern_ms = r'(?<=: ).*?(?=\n)'
    # matches_ms = re.findall(pattern_ms, result)
    
    # print({"회의 제목": matches_ms[0],
    #     "주요 이슈 및 진행상황": matches_ms[1],
    #     "새로운 상황 및 공지사항": matches_ms[2],
    #     "추가 안건": matches_ms[3]})

