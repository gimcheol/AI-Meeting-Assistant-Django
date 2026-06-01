// AddEventModal.jsx
import React, { useState } from "react";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    Col,
} from "reactstrap";

const AddEventModal = ({ isOpen, onClose, onSave }) => {
    const [eventTitle, setEventTitle] = useState("");
    const [startEventDate, setStartEventDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endEventDate, setEndEventDate] = useState("");
    const [endTime, setEndTime] = useState("");
    const [meeting, setMeetingDay] = useState(false);
    const [eventMemo, setEventMemo] = useState("");
    const [selectedFiles, setSelectedFiles] = useState(null);

    const handleFileChange = (e) => {
        setSelectedFiles(e.target.files);
    };

    const handleSaveEvent = () => {
        console.log("Event Title:", eventTitle);
        console.log("Start Event Date:", startEventDate);
        console.log("Start Time:", startTime);
        console.log("End Event Date:", endEventDate);
        console.log("End Time:", endTime);
        console.log("Meeting:", meeting);
        console.log("Event Memo:", eventMemo);
        console.log("Selected Files:", selectedFiles);

        // 파일 업로드
        const formData = new FormData();
    
        if (selectedFiles) {
            for (let i = 0; i < selectedFiles.length; i++) {
                formData.append(`file${i + 1}`, selectedFiles[i]);
            }
        }
    
        formData.append("title", eventTitle);
        formData.append("start", meeting ? `${startEventDate}T${startTime}:00` : `${startEventDate}T09:00:00`);
        formData.append("end", meeting ? `${startEventDate}T${endTime}:00` : `${endEventDate}T18:00:00`);
        formData.append("memo", eventMemo);
        formData.append("meeting", meeting);
    
        const headers = {
            "Authorization": `Token ${window.localStorage.getItem('token')}`,
            // "Content-Type": "multipart/form-data",
        };
    
        fetch("http://127.0.0.1:8000/schedule/create/", {
            method: "POST",
            headers: headers,
            body: formData,
        })
        .then(res => {
            if (res.status !== 201) {
                throw Error(res);
            }
            return res.json();
        })
        .then(newEvent => {
            console.log("newEvent:", newEvent);
            onSave(newEvent);
    
            // Reset the form and close the modal
            setEventTitle("");
            setStartEventDate("");
            setStartTime("");
            setEndEventDate("");
            setEndTime("");
            setMeetingDay(false);
            setEventMemo("");
            setSelectedFiles(null);
            onClose();
    
            // 페이지를 새로고침
            window.location.reload();
        })
        .catch((err) => {
            console.error(err);
        });
    };
    

    return (
        <Modal isOpen={isOpen} toggle={onClose}>
            <ModalHeader toggle={onClose}>
                <div className="fs-4 fw-semibold">일정 등록</div>
            </ModalHeader>

            <ModalBody>
                <Form>
                    <FormGroup>
                        <Label for="eventTitle">Title</Label>
                        <Input
                            type="text"
                            id="eventTitle"
                            value={eventTitle}
                            onChange={(e) => setEventTitle(e.target.value)}
                        />
                    </FormGroup>

                    <FormGroup row>
                        <Col md={6}>
                            <Label for="startEventDate">Start Date</Label>
                            <Input
                                type="date"
                                id="startEventDate"
                                value={startEventDate}
                                onChange={(e) => setStartEventDate(e.target.value)}
                            />
                        </Col>

                        {!meeting && (
                            <Col md={6}>
                                <Label for="endEventDate">End Date</Label>
                                <Input
                                    type="date"
                                    id="endEventDate"
                                    value={endEventDate}
                                    onChange={(e) => setEndEventDate(e.target.value)}
                                />
                            </Col>
                        )}
                        
                    </FormGroup>

                    <FormGroup row>
                        {!!meeting && (
                            <Col md={6}>
                                <Input
                                    type="time"
                                    id="startTime"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                />
                            </Col>
                        )}

                        {!!meeting && (
                            <Col md={6}>
                                <Input
                                    type="time"
                                    id="endTime"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                />
                            </Col>
                        )}
                    </FormGroup>
                    
                    <FormGroup check>
                        <Label check>
                            <Input
                                type="checkbox"
                                id="meeting"
                                checked={meeting}
                                onChange={() => setMeetingDay(!meeting)}
                            />
                            Meeting
                        </Label>
                    </FormGroup>

                    <div style={{ marginBottom: "15px" }} />

                    <FormGroup>
                        <Label for="eventMemo">Memo</Label>
                        <Input
                            type="textarea"
                            id="eventMemo"
                            value={eventMemo}
                            onChange={(e) => setEventMemo(e.target.value)}
                        />
                    </FormGroup>

                    <FormGroup className="mb-0">
                        <Label for="fileInput">File Upload</Label>
                        <Input
                            type="file"
                            id="fileInput"
                            multiple
                            onChange={handleFileChange}
                        />
                    </FormGroup>


                </Form>
            </ModalBody>

            <ModalFooter>
                <Button color="primary" onClick={handleSaveEvent}>
                    Save
                </Button>
                <Button color="secondary" onClick={onClose}>
                    Cancel
                </Button>
            </ModalFooter>

        </Modal>
    );
};

export default AddEventModal;