from gpt_api import *
from openai import OpenAI
import re
from konlpy.tag import Okt
from krwordrank.word import KRWordRank

def keyword(text,keywords_list,stopwords):
    load_dotenv()
    text = token_check(text)
    result = extract_keywords_from_meeting(text,keywords_list)
    print(result) # GPT 결과 출력

    pattern_ek = r'\d+\.\s*([^:]+):' # : 앞에 단어 추출( 숫자제외)
    # pattern = r'([^0-9\s:\n]+):' # : 바로 앞에 단어 추출(공백문자 제외)
    # 예외처리
    matches_ek = re.findall(pattern_ek, result)
    print(matches_ek)
    if matches_ek[0] == 'keyword1' or matches_ek[0] == '키워드1':
        pattern_ek = r'(?<=: ).*?(?=\n|$)'
        matches_ek = re.findall(pattern_ek, result)
        keywords_list.extend(matches_ek[::2])
    else:
        keywords_list.extend(matches_ek)   
    
    
    keywords_list, stopwords =krwr(keywords_list, text, stopwords)
    stopwords.extend(keywords_list)
    print(keywords_list) 
    
    # 결과 출력
    print(keywords_list)
    return keywords_list

def extract_keywords_from_meeting(text,keywords_list):
    
    os.environ['JAVA_HOME'] = r'C:\Program Files\Java\jdk-21\bin\server'
    
    # Set up OpenAI client
    load_dotenv()
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

    GPT_MODEL = "gpt-3.5-turbo"
    ek = '''
        1. keyword1: 선택한 이유.
        2. keyword2: 선택한 이유.
        3. keyword3: 선택한 이유.
        4. keyword4: 선택한 이유.
        5. keyword5: 선택한 이유.
        6. keyword6: 선택한 이유.
        
    '''  

    messages = [
        {"role": "system", "content": "You are the best keyword extractor. You need to extract keywords from the meeting content. All responses should be in Korean."},
        {"role": "user", "content": f"{text}. 이건 회의 내용인데 핵심 명사 6개를 추출하고 선택한 이유에 대해 설명해줘(list = {keywords_list}내에 있는 명사는 제외하고!), 답변은 다음과 같은 형식으로 해줘. {ek}"}
    ]

    # Make API request using the content from the text file
    response = client.chat.completions.create(
        model=GPT_MODEL,
        messages=messages,
        temperature=0.3
    )

    # Extract and return the generated response
    response_message = response.choices[0].message.content
    return response_message



def split_noun_sentences(text):
    okt = Okt()
    sentences = re.sub(r'([^\n\s다요죠]+[^\n다요죠]*[다요죠])', r'\1\n', text).strip().split("\n")

    result = []
    for sentence in sentences:
        if len(sentence) == 0:
            continue
        sentence_pos = okt.pos(sentence, stem=True)
        nouns = [word for word, pos in sentence_pos if pos == 'Noun']
        if len(nouns) == 1:
            continue
        result.append(' '.join(nouns) + '.')

    return result

#kr-wordrank    
def krwr(word_list,text, stopwords):
    min_count = 1   # 단어의 최소 출현 빈도수
    max_length = 10 # 단어의 최대 길이
    wordrank_extractor = KRWordRank(min_count=min_count, max_length=max_length)
    beta = 0.85  
    max_iter = 20
    texts = split_noun_sentences(text)
    keywords, rank, graph = wordrank_extractor.extract(texts, beta, max_iter)
    keyword_dict = {}

    # 결과를 딕셔너리에 저장
    for word, r in sorted(keywords.items(), key=lambda x: x[1], reverse=True):
        keyword_dict[word] = r
        
    result_dict = {}

    for words in word_list:
        split_words = words.split()

         # 각 단어의 가중치를 더함
        total_weight = sum(keyword_dict.get(word, 0) for word in split_words)

        result_dict[words] = total_weight

    # 함수를 사용하여 딕셔너리에서 여러 키워드 제거
    for keyword in stopwords:
        result_dict.pop(keyword, None)
        
    sorted_keywords = sorted(result_dict.items(), key=lambda x: x[1], reverse=True)

    # 상위 두 개의 키 출력
    top_two_keywords = [item[0] for item in sorted_keywords[:2]]

    # 결과 출력
    print("상위 두 개의 키:", top_two_keywords)
    return top_two_keywords, stopwords
    
