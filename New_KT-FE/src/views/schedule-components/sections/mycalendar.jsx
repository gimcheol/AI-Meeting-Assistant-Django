//mycalendar.jsx
import React, { useState, useEffect } from "react";

import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";

import AddEventModal from "./AddEventModal.jsx";
import EventModal from "./EventModal.jsx";

import "../css/mycalendar.css";
import { info } from "sass";

const MyCalendar = () => {
    const [isAddEventModalOpen, setAddEventModalOpen] = useState(false);
    const [isEventModalOpen, setEventModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const [events, setEvents] = useState([]);
    // const [events, setEvents] = useState([
    //     {
    //         id: 23,
    //         title: "회의",
    //         memo: "회의 준비",
    //         start: "2024-01-07T09:00:38",
    //         end: "2024-01-07T09:40:38",
    //         meeting: true,
    //         keywords: [
    //             {
    //                 keyword: "통신",
    //                 article_links: [
    //                     "https://n.news.naver.com/mnews/article/006/0000121642?sid=102",
    //                     "https://n.news.naver.com/mnews/article/003/0012302733?sid=101",
    //                     "https://n.news.naver.com/mnews/article/001/0014424528?sid=104"
    //                 ],
    //                 article_titles: [
    //                     "민주당, 류희림 방송통신심의위원장 검찰 고발",
    //                     "KT·SK 이어 LGU+도 '스타링크' 와 손잡을 듯…저궤도 위성통신 서비스 '초읽...",
    //                     "스페이스X, 첫 '휴대전화 연결' 위성 발사…8개국 통신사와 제휴"
    //                 ]
    //             },
    //             {
    //                 keyword: " 블루스",
    //                 article_links: [
    //                     "https://n.news.naver.com/mnews/article/018/0005649603?sid=103",
    //                     "https://n.news.naver.com/mnews/article/047/0002417742?sid=106",
    //                     "https://n.news.naver.com/mnews/article/296/0000072937?sid=103"
    //                 ],
    //                 article_titles: [
    //                     "원로 연극인 위한 축제 '제8회 늘푸른연극제' 6일 개막",
    //                     "녹슬지 않고 금맥을 캐는 아티스트 닐 영의 음반 '주마' [B메이저 - AZ 록 여...",
    //                     "&quot;열심히 살았는데&quot;...연말에 몰려오는 우울감, 왜?"
    //                 ]
    //             }
    //         ],
    //         summary: {
    //             "회의 제목": "AI 기술 스택 업그레이드에 대한 논의",
    //             "주요 이슈 및 진행상황": [
    //                 "자연어 처리 모듈의 임베딩 방법에 대한 논의",
    //                 "Transformer 기반의 BERT 모델 검토",
    //                 "BERT 모델의 커스터마이징 필요성 논의",
    //                 "BERT 훈련 데이터셋 구축 과정에 대한 설명",
    //                 "데이터셋 품질 보증 단계에 대한 논의",
    //                 "모델의 인퍼런스 시간과 메모리 사용량 벤치마킹 결과 공유 예정",
    //             ],
    //             "새로운 상황 및 공지사항": [
    //                 "인퍼런스 시간과 메모리 사용량 벤치마킹 결과는 다음 회의에서 제시 예정",
    //             ],
    //             "추가 안건": [
    //                 "다음 회의에서 구체적인 수정 사항과 개선 계획에 대해 논의 예정",
    //                 "회의록 작성해주세요",
    //             ],
    //         }
        
    //     },
    //     {
    //         id: 24,
    //         title: "회의",
    //         memo: "회의 준비",
    //         start: "2024-01-07",
    //         end: "2024-01-11",
    //         meeting: false,
    //     }
    // ]);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/schedule/", {
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
            .then((now_event) => {
                // 서버에서 받은 데이터가 배열인지 확인
                if (Array.isArray(now_event.events)) {
                    // 데이터를 FullCalendar의 형식에 맞게 가공
                    const formattedEvents = now_event.events.map(
                        (event) => ({
                            id: event.id,
                            title: event.title,
                            start: event.start,
                            end: event.end,
                            meeting: event.meeting,
                        })
                    );

                    // 가공한 데이터를 FullCalendar에 설정
                    setEvents(formattedEvents);
                    console.log("formattedEvents:", formattedEvents);
                } else {
                    console.error(
                        "Received data does not contain an array of events:",
                        now_event
                    );
                }
            })
            .catch((err) => {
                console.error(err);
            });
        
    }, []);

    const handleAddButton = () => {
        setAddEventModalOpen(true);
    };

    // // 클릭한 이벤트의 정보를 모달에 표시
    // const handleEventClick = (clickInfo) => {
    //     // 클릭한 이벤트의 정보를 가져와서 모달을 엽니다.
    //     const { event } = clickInfo;
    //     const eventId = parseInt(event._def.publicId);

    //     // 선택한 event를 찾아서 setSelectedEvent에 저장
    //     setSelectedEvent(events.find((event) => event.id === eventId));
    //     setEventModalOpen(true);
    // };

    const handleEventClick = (clickInfo) => {
        const { event } = clickInfo;
        const eventId = parseInt(event._def.publicId);

        fetch(`http://127.0.0.1:8000/schedule/eventclick/${eventId}`, {
            method: "GET",
            headers: {
                // "Content-Type": "application/json",
                "Content-Type": "multipart/form-data",
                "Authorization": `Token ${window.localStorage.getItem("token")}`,
            },
        })
        .then((res) => {
            if (!res.ok) {
                throw Error(res);
            }
            return res.json();
        })
        .then((eventDetails) => {
            console.log("Received file:", eventDetails.files);

            // 클릭한 이벤트 객체에 서버에서 가져온 추가 정보를 추가
            setSelectedEvent({
                ...eventDetails,

                keywords: eventDetails.keywords,
                summary: eventDetails.summary,
                memo: eventDetails.memo,

                files: eventDetails.files.map((file) => ({
                    file_link: file.file_url,
                    file_name: file.file_name,
                    blob: null,  // 블롭 객체는 초기에는 null로 설정
                })),
            });

            // 파일이 존재하는 경우 블롭 객체를 가져와서 files 배열에 추가
            if (eventDetails.files && eventDetails.files.length > 0) {
                const filePromises = eventDetails.files.map((file) => {
                    return fetch(`${file.file_url}`)
                        .then((res) => res.blob())
                        .then((blob) => {
                            console.log("Blob:", blob);
                            return {
                                file_link: file.file_url,
                                file_name: file.file_name,
                                blob: blob,
                            };
                        });
                });

                // 모든 파일의 블롭 객체가 준비될 때까지 기다린 후 모달 상태를 업데이트
                Promise.all(filePromises)
                .then((updatedFiles) => {
                    // 모든 파일의 블롭 객체가 준비되면 모달 상태를 업데이트
                    setSelectedEvent((prevEvent) => ({
                        ...prevEvent,
                        files: updatedFiles,
                    }));
                    console.log("All files processed.");
                })
                .catch((error) => {
                    console.error("Error processing files:", error);
                });
            }
            setEventModalOpen(true);
        })
        .catch((err) => {
            console.error(err);
        });
    };


    const handleDeleteEvent = (eventId) => {
        const token = window.localStorage.getItem("token");

        // 서버에 삭제 요청 보내기
        fetch(`http://127.0.0.1:8000/schedule/eventdelete/${eventId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
        })
        .then((res) => {
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            // 서버에서 삭제가 성공적으로 이루어졌을 때 클라이언트에서도 해당 이벤트를 제거
            setEvents((prevEvents) =>
                prevEvents.filter((event) => event.id !== eventId)
            );
            setEventModalOpen(false); // 모달을 닫을 수도 있습니다.

            // 페이지를 새로고침
            window.location.reload();
        })
        .catch((err) => {
            console.error(err);
        });
    };

    return (
        <div className="calendar">
            <FullCalendar
                locale="kr"
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay addEventButton",
                }}
                customButtons={{
                    addEventButton: {
                        text: "Add",
                        click: handleAddButton,
                    },
                }}
                height={780}
                events={events}
                eventClick={handleEventClick}
            />

            <AddEventModal
                isOpen={isAddEventModalOpen}
                onClose={() => setAddEventModalOpen(false)}
                onSave={(newEvent) => {
                    setEvents([...events, newEvent]);
                }}
            />

            <EventModal
                isOpen={isEventModalOpen}
                onClose={() => setEventModalOpen(false)}
                eventTitle={selectedEvent?.title}
                eventStartDate={selectedEvent?.start}
                eventEndDate={selectedEvent?.end}
                meeting={selectedEvent?.meeting}
                eventMemo={selectedEvent?.memo}
                eventMeetingSummary={selectedEvent?.summary}
                eventKeywords={selectedEvent?.keywords}
                files={selectedEvent?.files}
                onDelete={() => handleDeleteEvent(selectedEvent?.id)}
            />
        </div>
    );
};

export default MyCalendar;
