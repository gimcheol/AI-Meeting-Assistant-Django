// keyword.jsx
import React, { useState, useEffect } from 'react';
import { Container, Col, Row, Table } from "reactstrap";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faHashtag} from "@fortawesome/free-solid-svg-icons";

import '../css/keyword.css';

const KeywordComponent = ({ keywordData }) => {
    // 키워드 데이터 상태 설정
    const [keywordDataState, setKeywordDataState] = useState({});
    // const [keywordDataState, setKeywordDataState] = useState({
    //     '회의': [
    //       {
    //         'keyword': '회의',
    //         'title': ['정부, 국무회의서 쌍특검법 거부권 행사안 의결', '국무회의서 ‘쌍특검법’ 거부권 건의 의결', '정부, 임시국무회의 열어 ‘쌍특검법안’ 재의요구안 의결'],
    //         'link': ['https://n.news.naver.com/mnews/article/023/0003808964?sid=100', 'https://n.news.naver.com/mnews/article/020/0003541007?sid=100', 'https://n.news.naver.com/mnews/article/056/0011636295?sid=100'],
    //         'news_summary': '국립대학 쓰리라 연방총장들이 양곡정국 실천제 도입을 국회로 되돌려 보내자 김재준 내과 국립대학 소식검 문제와 대통령 재선 때문에 제철마저 흔들릴 게 오심 전은국  국립대학 소식검청이 일 한국라 쓰리라 소식동 쓰리라 이종욱경 제철마검속 것이라고 수검마정답란은 마멀 것만 같은 법이,말합니다.0304'
    //       }
    //     ],
    //     '키워드 추출': [
    //       {
    //         'keyword': '키워드 추출',
    //         'title': ['제약업계 키워 드는 AI…“비용·시간 절감” [투자360]', "K2, 내년 아웃도어 시장 키워드 'DRAGON'", "[일문일답] SKB &quot;OTT 경쟁 속 B tv 생존 키워드는 '고객'…넷플릭스 연계 상품..."],
    //         'link': ['https://n.news.naver.com/mnews/article/016/0002245616?sid=101', 'https://n.news.naver.com/mnews/article/119/0002783640?sid=101', 'https://n.news.naver.com/mnews/article/241/0003319901?sid=105'],
    //         'news_summary': '요약:\n식약처는 인공지능(AI) 기술을 활용한 제약 시장이 빠르게 성장하고 있으며, 2023년까지 약 1.3조원 규모로 전망되고 있다고 밝혔다. ... AI를 통해 희귀병이나 감염병 등 다양한 질환용 신약을 신속하게 개발할 수 있고, 맞춤형 신약 개발에도 용이해진다는 것이다.'
    //       }
    //     ],
    //     '떡볶이': [
    //         {
    //           'keyword': '회의',
    //           'title': ['정부, 국무회의서 쌍특검법 거부권 행사안 의결', '국무회의서 ‘쌍특검법’ 거부권 건의 의결', '정부, 임시국무회의 열어 ‘쌍특검법안’ 재의요구안 의결'],
    //           'link': ['https://n.news.naver.com/mnews/article/023/0003808964?sid=100', 'https://n.news.naver.com/mnews/article/020/0003541007?sid=100', 'https://n.news.naver.com/mnews/article/056/0011636295?sid=100'],
    //           'news_summary': '국립대학 쓰리라 연방총장들이 양곡정국 실천제 도입을 국회로 되돌려 보내자 김재준 내과 국립대학 소식검 문제와 대통령 재선 때문에 제철마저 흔들릴 게 오심 전은국  국립대학 소식검청이 일 한국라 쓰리라 소식동 쓰리라 이종욱경 제철마검속 것이라고 수검마정답란은 마멀 것만 같은 법이,말합니다.0304'
    //         }
    //       ],
    //       '닭강정': [
    //         {
    //           'keyword': '키워드 추출',
    //           'title': ['제약업계 키워 드는 AI…“비용·시간 절감” [투자360]', "K2, 내년 아웃도어 시장 키워드 'DRAGON'", "[일문일답] SKB &quot;OTT 경쟁 속 B tv 생존 키워드는 '고객'…넷플릭스 연계 상품..."],
    //           'link': ['https://n.news.naver.com/mnews/article/016/0002245616?sid=101', 'https://n.news.naver.com/mnews/article/119/0002783640?sid=101', 'https://n.news.naver.com/mnews/article/241/0003319901?sid=105'],
    //           'news_summary': '요약:\n식약처는 인공지능(AI) 기술을 활용한 제약 시장이 빠르게 성장하고 있으며, 2023년까지 약 1.3조원 규모로 전망되고 있다고 밝혔다. ... AI를 통해 희귀병이나 감염병 등 다양한 질환용 신약을 신속하게 개발할 수 있고, 맞춤형 신약 개발에도 용이해진다는 것이다.'
    //         }
    //       ],  
    //   });
    const [selectedKeyword, setSelectedKeyword] = useState(null);

    // keywordData가 변경될 때마다 키워드 데이터 업데이트
    useEffect(() => {
        // 이전의 키워드 데이터를 기존 상태에 병합
        setKeywordDataState((prevData) => ({
            ...prevData,
            ...keywordData
        }));
    }, [keywordData]);
    
    return (
        <div id="keywordPage">
            <Container style={{ maxHeight: 'auto', overflowY: 'auto', height: '700px' }}>
                <Row style={{marginTop: '30px'}}>
                    <Col>
                        {/* 왼쪽에 키워드 목록 표시 */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', marginTop:'25px' }}>
                            {Object.keys(keywordDataState).map(keyword => (
                                <div
                                    key={keyword}
                                    onClick={() => setSelectedKeyword(keyword)}
                                    style={{
                                        cursor: 'pointer',
                                        fontWeight: selectedKeyword === keyword ? 'bold' : 'normal',
                                        marginRight: '20px', // 각 키워드 사이의 간격을 조절
                                        marginBottom: '10px', // 행 간의 간격을 조절
                                        fontSize: '25px', // 글씨 크기를 조절
                                        color: selectedKeyword === keyword ? '#00A086' : 'black',
                                    }}
                                >
                                <FontAwesomeIcon icon={faHashtag} /> {keyword}
                                </div>
                            ))}
                        </div>
                    </Col>

                    <Col style={{ fontSize: '24px', color: 'black' }}>
                        {/* 오른쪽에 선택한 키워드의 세부 정보를 표시 */}
                        {selectedKeyword && (
                            <div className='note'>
                                <Row style={{marginBottom: '30px'}}>
                                    <Col>
                                        <div style={{ fontSize: '30px', fontWeight: 'bold' }}>
                                            {selectedKeyword}
                                        </div>
                                    </Col>
                                </Row>

                                {/* 선택한 키워드 뉴스 요약 */}
                                <Row style={{marginBottom: '30px'}}>
                                    <Col>
                                        {/* <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>
                                            요약
                                        </div> */}
                                        <div style={{ fontSize: '20px' }}>
                                            {keywordDataState[selectedKeyword][0].news_summary}
                                        </div>
                                    </Col>
                                </Row>

                                <div class="divider div-transparent div-stopper"></div>

                                {/* 선택한 키워드의 타이틀과 링크 */}
                                <Row style={{ marginBottom: '20px' }}>
                                    <Col className="text-left">
                                        {keywordDataState[selectedKeyword][0].title.map((title, index) => (
                                            <div key={index} style={{ fontSize: '18px', color: '#6a6b6d', marginBottom: '10px', transition: 'color 0.3s' }}>
                                                <a
                                                    href={keywordDataState[selectedKeyword][0].link[index]}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ color: 'inherit', textDecoration: 'none' }}
                                                    onMouseEnter={(e) => e.target.style.color = 'blue'}
                                                    onMouseLeave={(e) => e.target.style.color = '#6a6b6d'}

                                                >
                                                    {title}
                                                </a>
                                            </div>
                                        ))}
                                    </Col>
                                </Row>
                            </div>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default KeywordComponent;