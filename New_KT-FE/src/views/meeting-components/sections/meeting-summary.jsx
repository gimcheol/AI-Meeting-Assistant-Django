// meeting-summary.jsx
import React, { useState, useEffect } from "react";
import { Container, Row } from "reactstrap";

import Loading from "./loading.jsx";
import '../css/meeting-summary.css';

const MeetingSummary = () => {
    const [loading, setLoading] = useState(true);

    const [summary, setSummary] = useState({
        "회의 제목": "",
        "주요 이슈 및 진행상황": [],
        "새로운 상황 및 공지사항": [],
        "추가 안건": [],
        'keywords': [],
    });
    
    // const [summary, setSummary] = useState({
    //     "회의 제목": "AI 기술 스택 업그레이드에 대한 논의",
    //     "주요 이슈 및 진행상황": [
    //         "자연어 처리 모듈의 임베딩 방법에 대한 논의",
    //         "Transformer 기반의 BERT 모델 검토",
    //         "BERT 모델의 커스터마이징 필요성 논의",
    //         "BERT 훈련 데이터셋 구축 과정에 대한 설명",
    //         "데이터셋 품질 보증 단계에 대한 논의",
    //         "모델의 인퍼런스 시간과 메모리 사용량 벤치마킹 결과 공유 예정",
    //     ],
    //     "새로운 상황 및 공지사항": [
    //         "인퍼런스 시간과 메모리 사용량 벤치마킹 결과는 다음 회의에서 제시 예정",
    //     ],
    //     "추가 안건": [
    //         "다음 회의에서 구체적인 수정 사항과 개선 계획에 대해 논의 예정",
    //         "회의록 작성해주세요",
    //     ],
    // });

    useEffect(() => {
        fetch("http://127.0.0.1:8000/meeting/meetsum", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${window.localStorage.getItem('token')}`,
            },
        })
        .then((res) => {
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then((data) => {
            setSummary(data);
            setLoading(false);
            console.log("data:", data);
        })
        .catch((err) => {
            console.error(err);
        });
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <div id="page">
            <Container style={{ marginTop: '40px', marginBottom: '20px', color: 'black'}}>
                <Row>
                    <h1 className="meeting-title" style={{ fontWeight: 'bold', marginBottom: '60px' }}>{summary["회의 제목"]}</h1>
                    
                    <p className="fs-3 fw-semibold" style={{ marginTop: '5px' }}>주요 이슈 및 진행상황:</p>
                    <blockquote class="block1">
                        <ul>
                            {summary["주요 이슈 및 진행상황"].map((issue, index) => (
                                <li key={index}>{issue}</li>
                            ))}
                        </ul>
                    </blockquote>
                    
                    <p className="fs-3 fw-semibold" style={{ marginTop: '30px' }}>새로운 상황 및 공지사항:</p>
                    <blockquote class="block1">
                        <ul>
                            {summary["새로운 상황 및 공지사항"].map((notice, index) => (
                                <li key={index}>{notice}</li>
                            ))}
                        </ul>
                    </blockquote>
                    
                    <p className="fs-3 fw-semibold" style={{ marginTop: '30px' }}>추가 안건:</p>
                    <blockquote class="block1">
                        <ul>
                            {summary["추가 안건"].map((agenda, index) => (
                                <li key={index}>{agenda}</li>
                            ))}
                        </ul>
                    </blockquote>
                </Row>
                <hr />
                <Row>
                    <h2 class="block2-author">Today's Keyword</h2>
                    <blockquote class="block2">
                        {summary.keywords.join(' ')}
                    </blockquote>
                </Row>
            </Container>
        </div>
    );
};

export default MeetingSummary;
