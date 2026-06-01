import React, { useState } from "react";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from "reactstrap";
import { Link } from "react-router-dom";

import './css/login.css'

const PageLogin = () => {
    // const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // const handleUserNameChange = (e) => {
    //     setUserName(e.target.value);
    // };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        fetch("http://127.0.0.1:8000/users/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                // "username": userName,
                "email": email,
                "password": password,
            }),
        })
        .then(res => {
            if (res.status !== 200) {
                throw Error(res);
            }
            return res.json();
        })
        .then(res => {
            localStorage.setItem('token', res.access_token);
            
            alert(`${res.username}님 환영합니다.`);
            window.location.replace('/Home')

        })
        .catch((err) => {
            console.error(err);
            alert("올바르지 않은 이메일 또는 비밀번호입니다.");
        })
    }

    return (
        <div id='login-container'>
            <div className="spacer" id="forms-component">
                <Container>
                    <Row className="justify-content-center">
                        <Col md="7" className="text-center">
                            <h1 className="title font-bold">Sign in</h1>
                            <h6 className="subtitle" >
                                빠르고 간편한 로그인으로 새로운 경험을 시작하세요.
                            </h6>
                        </Col>
                    </Row>
                </Container>
            </div>
            <Container>
                <Row className="justify-content-center">
                    <Col md="6" style={{ paddingBottom: "180px" }}>
                        <Form>
                            <FormGroup>
                                <Label htmlFor="name">Email</Label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    placeholder="a000000@aivle.kt.co.kr"
                                    value={email}
                                    onChange={handleEmailChange}
                                />
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
                            </FormGroup>

                            {/* <FormGroup check className="ml-3 mb-3">
                                <Input
                                    id="checkbox1"
                                    type="checkbox"
                                    className="form-check-input"
                                />
                                <Label
                                    htmlFor="checkbox1"
                                    className="form-check-label"
                                >
                                    {" "}
                                    Remember me{" "}
                                </Label>
                            </FormGroup> */}
                            
                            <div className="text-center" style={{ marginTop: "30px" }}>
                                <Button
                                    type="submit"
                                    onClick={handleSubmit}
                                    className="btn btn-success waves-effect waves-light m-r-10"
                                >
                                    Submit
                                </Button>
                                <Link to="/signup">
                                    <Button className="btn btn-inverse waves-effect waves-light">
                                        Sign up
                                    </Button>
                                </Link>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default PageLogin;
