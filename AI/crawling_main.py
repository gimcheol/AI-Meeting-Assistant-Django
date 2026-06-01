from gpt_api import *
import re, requests, json, urllib.request, datetime, os
from dotenv import load_dotenv
from bs4 import BeautifulSoup

def crawl(top):
    node = 'news'  # 크롤링 할 대상
    srcText = top
    sort = 'sim'   # 관련도순
    cnt = 0
    jsonResult = []
    article_texts = ''

    jsonResponse = getNaverSearch(node, srcText, 1, 10, sort)
    total = jsonResponse['total']

    for post in jsonResponse['items']:
        cnt += 1
        getPostData(post, jsonResult, cnt)

    print('전체 검색 : %d 건' % total)
    print("가져온 데이터 : %d 건" % (cnt))

    naver_news_count = 0  # 네이버 뉴스 가져온 개수를 세는 카운터 추가

    for item in jsonResult:
        url = item['link']
            
        # 네이버 뉴스를 가져올 경우에만 크롤링
        if url.startswith('https://n.news.naver.com/mnews/'):
            article_text = get_article_text(url)
            if article_text:
                article_text = preprocess_text(article_text)
                article_texts = article_texts + ' ' + article_text   
                print(f"\n{article_text}")
                    
                # 네이버 뉴스를 3개 가져왔으면 루프 종료
                naver_news_count += 1
                if naver_news_count >= 3:
                    break
    result= summarize_news(article_texts)

    naver_news_items = [item for item in jsonResult if item['link'].startswith('https://n.news.naver.com/mnews/')][:3]

    jsonlist = {}
    for news in naver_news_items:
        keyword = srcText
        titles, links = mkjs(news)
    
        if keyword in jsonlist:
            jsonlist[keyword]['title'].extend(titles)
            jsonlist[keyword]['link'].extend(links)
        else:
            # 해당 키워드가 없는 경우 새로운 아이템 추가
            jsonlist[keyword] = {'keyword': keyword, 'title': titles, 'link': links}

    # 각 아이템에 news_summary 키를 추가
    for keyword, values in jsonlist.items():
        titles = values['title']
        links = values['link']
         
        values['news_summary'] = result
        
    result_list = list(jsonlist.values())   
        
    return result_list


def mkjs(post):
    # 뉴스의 제목과 링크를 저장할 리스트
    titles = []
    links = []

    # 뉴스의 제목과 링크를 추출하여 리스트에 저장
    title = post['title']
    title = re.sub("<.*?>", "", title)
    titles.append(title)

    org_link = post['link']
    links.append(org_link)

        
    return titles, links

# 요청형식 만들기
def getRequestUrl(url):
    load_dotenv()

    req = urllib.request.Request(url)
    req.add_header("X-Naver-Client-Id", os.environ.get("client_id"))
    req.add_header("X-Naver-Client-Secret", os.environ.get("client_secret"))

    try:
        response = urllib.request.urlopen(req)
        if response.getcode() == 200:
            print("[%s] Url Request Success" % datetime.datetime.now())
            return response.read().decode('utf-8')
    except Exception as e:
        print(e)
        print("[%s] Error for URL : %s" % (datetime.datetime.now(), url))
        return None

# 네이버 검색 API를 통해 뉴스 검색
def getNaverSearch(node, srcText, start, display, sort):
    base = "https://openapi.naver.com/v1/search"
    node = "/%s.json" % node
    parameters = "?query=%s&start=%s&display=%s&sort=%s" % (urllib.parse.quote(srcText), start, display, sort)

    url = base + node + parameters
    responseDecode = getRequestUrl(url)

    if responseDecode == None:
        print(f"Error: No response received for URL: {url}")
        return None
    else:
        # print(f"Response received: {responseDecode}")
        return json.loads(responseDecode)

# 뉴스 기사에서 텍스트 추출
def get_article_text(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        html = response.text

        soup = BeautifulSoup(html, 'html.parser')
        article_text = soup.find('article').get_text(separator='\n', strip=True)
        return article_text

    except Exception as e:
        print(f"Error while fetching article from {url}: {e}")
        return None

# 결과 저장
def getPostData(post, jsonResult, cnt):
    title = post['title']
    title = re.sub("<.*?>", "", title)

    description = post['description']
    description = re.sub("<.*?>", "", description)

    org_link = post['link']
    
    pDate = datetime.datetime.strptime(post['pubDate'], '%a, %d %b %Y %H:%M:%S +0900') 
    pDate = pDate.strftime('%Y-%m-%d %H:%M:%S')

    jsonResult.append({'cnt': cnt, 'title': title, 'description': description, 
                       'link': org_link, 'pDate': pDate})
    return None

def preprocess_text(text):
    # HTML 태그 제거
    text = re.sub(r'<.*?>', '', text)
    # 특수문자 및 숫자 제거
    text = re.sub(r'[^a-zA-Z가-힣\s]', '', text)
    # 여러 공백을 단일 공백으로 변환
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def summarize_news(text):
    query = token_check(text)
    response = openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": f"뉴스에 대한 결과야. 요약설명해 {query}"}]
    )
    return response.choices[0].message.content.strip()