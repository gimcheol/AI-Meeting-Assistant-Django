//join.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    Container,
    Row,
    Col,
    Form,
    FormGroup,
    Label,
    Input,
    Button,
} from "reactstrap";

import HeaderBanner3 from "../../../components/banner/banner3.jsx";
import Footer from "../../../components/footer/footer.jsx";
import TermsModal from "./join_modal.jsx";
import { set } from "immutable";

const validatePwd = (password) => {
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^*+=-]/.test(password);
    const hasAlphabet = /[a-zA-Z]/.test(password);

    const numOfConditions = [hasNumber, hasSpecial, hasAlphabet].filter(
        Boolean
    ).length;

    if (numOfConditions === 2) {
        return /.{10,16}$/.test(password);
    } else if (numOfConditions === 3) {
        return /.{8,16}$/.test(password);
    } else {
        return false;
    }
};


const SignupForm = () => {
    // const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [EmailErrorMsg, setEmailErrorMsg] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 약관 동의 상태를 저장하는 state 추가
    const [isAgreed, setIsAgreed] = useState(false);

    const handleEmailChange = (e) => {
        const emailValue = e.target.value;
        setEmail(emailValue);

        // // "@" 기호 이전의 부분을 username으로 설정
        // const usernameFromEmail = emailValue.split('@')[0];
        // setUserName(usernameFromEmail);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    // 모달을 열기 위한 핸들러
    const handleTermsClick = () => {
        // Open the modal only if the user has agreed
        if (!isAgreed) {
            setIsModalOpen(true);
        }
        // You can add an else statement here if you want to handle the case when the user hasn't agreed.
    };

    // 약관 동의 체크박스의 onChange 핸들러
    const handleAgreeCheckboxChange = () => {
        setIsAgreed(!isAgreed);
    };

    // 모달에서 확인 버튼을 눌렀을 때의 동작을 정의
    const handleModalConfirm = () => {
        // 예를 들어, 모달을 닫거나 다른 작업을 수행할 수 있습니다.
        setIsAgreed(true); // 모달에서 확인했을 때 약관 동의로 처리하는 예시
        setIsModalOpen(false); // 모달 닫기
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // 약관 동의 여부 확인
        if (!isAgreed) {
            setErrorMsg("약관에 동의해주세요.");
            return;
        }

        if (!validatePwd(password)) {
            setErrorMsg(
                "영문, 숫자, 특수문자(() < > \" ' ; 제외)중 2종류를 조합하여 10~16자리 (3종류는 8~16자리)로 구성할 수 있습니다."
            );
            return;
        }

        if (password !== confirmPassword) {
            setErrorMsg("Password does not match the confirmation password.");
            return;
        }
        
        setErrorMsg(""); // 비밀번호가 유효하면 오류 메시지를 지움
        
        fetch("http://127.0.0.1:8000/users/register/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                "email": email,
                "password": password,
                "password2": confirmPassword,
            }),
        })
        .then(res => {
            if (res.status === 400) {
                return res.json();
            } else if (res.status !== 201) {
                throw Error(res);
            }
            return res.json();
        })
        .then(res => {
            if (res.email && res.email[0] === "This email is already registered.") {
                setEmailErrorMsg("이미 등록된 이메일입니다.");
            } else if (res.email && res.email[0] === "Enter a valid email address.") {
                setEmailErrorMsg("올바르지 않은 이메일 형식입니다.");
            } else if (res.non_field_errors && res.non_field_errors[0].includes("aivle e-mail")) {
                setEmailErrorMsg("'aivle.kt.co.kr' 형식이 아닙니다.");
            } else {
                alert("회원 가입이 완료되었습니다.");
                window.location.href = "/signin";
            }
        })
        .catch((err) => {
            console.error(err);
        })
    };

    return (
        <div>
            <HeaderBanner3 />
            <div className="spacer" id="forms-component">
                <Container>
                    <Row className="justify-content-center">
                        <Col md="7" className="text-center">
                            <h1 className="title font-bold">Create account</h1>
                            <h6 className="subtitle">
                                회의 중 키워드 추출과 뉴스 실시간 요약, 회의 종료 후 간략한 내용 정리를 통해 당신의 호기심을 충족하세요. 지금 바로 다양한 회의 경험을 시작해보세요!
                            </h6>
                        </Col>
                    </Row>
                </Container>
            </div>
            <Container style={{ paddingBottom: "69px" }}>
                <Row className="justify-content-center">
                    <Col md="6">
                        <Form>
                            {/* <FormGroup>
                                <Label htmlFor="name">User Name</Label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    placeholder="Enter Username"
                                    value={userName}
                                    onChange={handleUserNameChange}
                                />
                            </FormGroup> */}

                            <FormGroup>
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    placeholder="Ex) a000000@aivle.kt.co.kr"
                                    value={email}
                                    onChange={handleEmailChange}
                                />
                                {EmailErrorMsg && (
                                    <div style={{ color: "red" }}>
                                        {EmailErrorMsg}
                                    </div>
                                )}
                            </FormGroup>

                            <FormGroup>
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                />
                                {errorMsg && (
                                    <div style={{ color: "red" }}>
                                        {errorMsg}
                                    </div>
                                )}
                            </FormGroup>

                            <FormGroup>
                                <Label htmlFor="confirmpwd">
                                    Confirm Password
                                </Label>
                                <Input
                                    type="password"
                                    className="form-control"
                                    id="confirmpwd"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                />
                                {confirmPassword !== password && (
                                    <div style={{ color: "red" }}>
                                        Password does not match
                                    </div>
                                )}
                            </FormGroup>

                            <div className="text-center">
                                <FormGroup>
                                    <span
                                        style={{ cursor: "pointer", color: isAgreed ? "gray" : "blue" }}
                                        onClick={!isAgreed ? handleTermsClick : undefined}
                                    >
                                        <input
                                            id="checkbox1"
                                            type="checkbox"
                                            checked={isAgreed}
                                            onChange={handleAgreeCheckboxChange}
                                            disabled={isAgreed}
                                        />
                                        {" "}약관 동의
                                    </span>
                                </FormGroup>

                                <TermsModal
                                    isOpen={isModalOpen}
                                    toggleModal={() => setIsModalOpen(!isModalOpen)}
                                    onConfirm={handleModalConfirm}
                                    isAgreed={isAgreed}
                                    onAgreementChange={setIsAgreed}
                                />

                                <Button
                                    type="submit"
                                    onClick={handleSubmit}
                                    className={`btn btn-success waves-effect waves-light m-r-10 ${!isAgreed ? 'disabled' : ''}`}
                                    disabled={!isAgreed}
                                >
                                    Submit
                                </Button>
                                <Link to="/">
                                    <Button
                                        type="cancel"
                                        className="btn btn-inverse waves-effect waves-light"
                                    >
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </div>
    );
};

export default SignupForm;
