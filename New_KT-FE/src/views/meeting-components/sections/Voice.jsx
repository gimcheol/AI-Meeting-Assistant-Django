// Voice.js

import React, { useState, useEffect } from "react";
import { Button, Container } from "reactstrap";

import KeywordComponent from "./keyword.jsx";

const Voice = () => {
    const [socket, setSocket] = useState(null);
    const [audioStream, setAudioStream] = useState(null);
    const [newKeys, setNewKeys] = useState(new Set());

    const [isStarted, setIsStarted] = useState(false);

    const [NewKeywordData, setNewKeywordData] = useState({});
    // const [NewKeywordData, setNewKeywordData] = useState({
    //     '닭갈비': [
    //         {
    //           'keyword': '닭갈비',
    //           'title': ['정부, 국무회의서 쌍특검법 거부권 행사안 의결', '국무회의서 ‘쌍특검법’ 거부권 건의 의결', '정부, 임시국무회의 열어 ‘쌍특검법안’ 재의요구안 의결'],
    //           'link': ['https://n.news.naver.com/mnews/article/023/0003808964?sid=100', 'https://n.news.naver.com/mnews/article/020/0003541007?sid=100', 'https://n.news.naver.com/mnews/article/056/0011636295?sid=100'],
    //           'news_summary': '국립대학 쓰리라 연방총장들이 양곡정국 실천제 도입을 국회로 되돌려 보내자 김재준 내과 국립대학 소식검 문제와 대통령 재선 때문에 제철마저 흔들릴 게 오심 전은국  국립대학 소식검청이 일 한국라 쓰리라 소식동 쓰리라 이종욱경 제철마검속 것이라고 수검마정답란은 마멀 것만 같은 법이,말합니다.0304'
    //         }
    //     ],
    //     '솜사탕': [
    //         {
    //           'keyword': '솜사탕',
    //           'title': ['제약업계 키워 드는 AI…“비용·시간 절감” [투자360]', "K2, 내년 아웃도어 시장 키워드 'DRAGON'", "[일문일답] SKB &quot;OTT 경쟁 속 B tv 생존 키워드는 '고객'…넷플릭스 연계 상품..."],
    //           'link': ['https://n.news.naver.com/mnews/article/016/0002245616?sid=101', 'https://n.news.naver.com/mnews/article/119/0002783640?sid=101', 'https://n.news.naver.com/mnews/article/241/0003319901?sid=105'],
    //           'news_summary': '요약:\n식약처는 인공지능(AI) 기술을 활용한 제약 시장이 빠르게 성장하고 있으며, 2023년까지 약 1.3조원 규모로 전망되고 있다고 밝혔다. ... AI를 통해 희귀병이나 감염병 등 다양한 질환용 신약을 신속하게 개발할 수 있고, 맞춤형 신약 개발에도 용이해진다는 것이다.'
    //         }
    //     ],
    // });
    
    const toggleWebSocket = async () => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.close();
            setSocket(null);
            console.log('WebSocket connection closed');

            if (audioStream) {
                audioStream.getTracks().forEach(track => track.stop());
                setAudioStream(null);
            }

            // 현재 연결이 열려 있을 경우 Finish 버튼만 보이도록 설정
            setIsStarted(false);
            setNewKeywordData({}); // 기존 데이터를 빈 객체로 초기화
            setNewKeys(new Set()); // newKeys 초기화

        }  else {
            try {
                const token = window.localStorage.getItem("token");
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

                const newSocket = new WebSocket(`ws://localhost:8000/ws/audio/?token=${token}`);

                newSocket.onopen = () => {
                    setSocket(newSocket);
                    setAudioStream(stream);
                    console.log('WebSocket connection opened');
                    
                    newSocket.send(JSON.stringify({ type: "start_meeting" }));

                    // 녹음이 시작되었음을 나타내는 상태를 설정
                    setIsStarted(true);
                };
            } catch (error) {
                console.error('Error accessing microphone:', error);
            }
        }
    };


    const finishWebSocket = () => {
        console.log('WebSocket 상태:', socket ? socket.readyState : 'Closed');
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: "finish_meeting" }));
            socket.close();
            setSocket(null);
            console.log('WebSocket connection closed');

            if (audioStream) {
                audioStream.getTracks().forEach(track => track.stop());
                setAudioStream(null);
            }

            // 녹음이 종료되면서 상태 초기화
            setIsStarted(false);
            setNewKeywordData({});
            setNewKeys(new Set()); // newKeys 초기화
            window.location.replace("/summary");
        }
    };

    useEffect(() => {
        return () => {
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.close();
                console.log('WebSocket connection closed');
            }
            if (audioStream) {
                audioStream.getTracks().forEach(track => track.stop());
                setAudioStream(null);
            }
        };
    }, [socket, audioStream]);

    useEffect(() => {
        console.log("NewKeywordData가 변경되었습니다:", NewKeywordData);
    }, [NewKeywordData]);

    useEffect(() => {
        if (socket) {
            socket.onmessage = (event) => {
                console.log('Socket event received!');
                const data = JSON.parse(event.data);
                console.log('Received data:', data);
                if (data.meeting === "total" && data.meeting_data) {
                    // 'total' 타입의 메시지를 받았을 때의 처리
                    console.log('Received meeting_data data:', data.meeting_data);
                    
                    const newKeywordObject = {};

                    // 키워드를 기준으로 데이터를 분류
                    data.meeting_data.forEach((innerArray) => {
                        const key = innerArray[0].keyword;
                    
                        // 기존 데이터에 키가 존재하지 않으면 업데이트
                        if (!newKeys.has(key)) {
                            setNewKeys((prevKeys) => new Set([...prevKeys, key]));
                            newKeywordObject[key] = innerArray;
                        }
                    });

                    // setKeywordDataState로 상태 업데이트
                    console.log("keywordDataObject:", NewKeywordData);
                    setNewKeywordData(newKeywordObject);
                }   
            };
            const intervalId = setInterval(() => {
                if (socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify({ type: "request_meeting_data" }));
                }
            }, 15000);

            return () => clearInterval(intervalId);
        }
    }, [socket]);

    return (
        <Container style={{ textAlign: 'center', marginBottom: '50px' }}>
            <KeywordComponent keywordData={NewKeywordData} />

            <div style={{ marginTop: '20px' }}>
                {isStarted ? (
                    <Button color="danger" onClick={finishWebSocket} style={{ marginBottom: '20px' }}>
                        Finish
                    </Button>
                ) : (
                    <Button color="primary" onClick={toggleWebSocket}>
                        Start
                    </Button>
                )}
            </div>
        </Container> 
    );
};

export default Voice;
