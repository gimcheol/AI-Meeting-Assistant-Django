/* eslint-disable */
import React from "react";
import { Row, Col, Container } from "reactstrap";

const TeamComponent = () => {
    return (
        <div>
            <div className="spacer bg-light">
                <Container style={{ width: "80%" }}>
                    <Row
                        className="justify-content-center"
                        style={{ marginBottom: "40px" }}
                    >
                        <Col
                            md="7"
                            className="text-center"
                            style={{ marginLeft: "auto", marginRight: "auto" }}
                        >
                            <h1
                                className="title font-bold mx-auto"
                                style={{ marginTop: "30px" }}
                            >
                                서비스 소개
                            </h1>
                            <h6 className="subtitle">
                                Note: Your Personal Assistant for meeting,
                                Efficient Work with Keywords"
                            </h6>
                        </Col>
                    </Row>

                    <div class="row">
                        <div class="col-md-4">
                            <div class="service_item">
                                <i class="icofont icofont-light-bulb"></i>
                                <h4
                                    class="m-center-30"
                                    style={{
                                        color: "navy",
                                    }}
                                >
                                    <i class="fa fa-angle-double-right fa-2x"></i>{" "}
                                    키워드 추출
                                </h4>
                                <div class="separator_small"></div>
                                <p>
                                    실시간 STT를 통해,  회의 내용 중 키워드를
                                    <br></br>
                                    추출합니다. 회의 중 모르거나 궁금할 만한
                                    <br></br>
                                    키워드를 선택합니다{" "}
                                </p>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="service_item">
                                <h4
                                    class="m-center-30"
                                    style={{
                                        color: "navy",
                                    }}
                                >
                                    <i class="fa fa-angle-double-right fa-2x"></i>{" "}
                                    키워드 설명
                                </h4>

                                <div class="separator_small"></div>
                                <p>
                                    키워드에 대해 실시간 뉴스 내용을  반영하여
                                    <br></br>
                                    요약 및 설명합니다. 직접 검색해보지 않아도
                                    <br></br>
                                    트렌드&설명을  한 눈에 확인 가능합니다.{" "}
                                </p>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="service_item">
                                <i class="icofont icofont-video"></i>
                                <h4
                                    class="m-center-30"
                                    style={{
                                        color: "navy",
                                    }}
                                >
                                    <i class="fa fa-angle-double-right fa-2x"></i>{" "}
                                    회의 요약
                                </h4>
                                <div class="separator_small"></div>
                                <p>
                                    회의가 끝나면 전체 회의에 대한  회의록을
                                    <br></br>
                                    제공합니다. 회의 성격, 회사의 회의록 형식에
                                    <br></br>
                                    따라 커스텀 할 수 있습니다.{" "}
                                </p>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
            <div className="spacer team2">
                <Container style={{ width: "70%" }}>
                    <Row className="justify-content-center">
                        <Col md="7" className="text-center">
                            <h2
                                className="title"
                                style={{
                                    marginTop: "30px",
                                    fontSize: "35px",
                                    fontWeight: "bold",
                                }}
                            >
                                Aivle School Team15{" "}
                            </h2>
                            <h6
                                className="subtitle"
                                style={{
                                    marginTop: "10px",
                                    fontSize: "20px",
                                }}
                            >
                                Aivle School AI 15조 조원 소개
                            </h6>
                        </Col>
                    </Row>

                    <Row className="px-5">
                        <Col lg="4" md="6" className="m-b-10">
                            <Row className="no-gutters m-2">
                                <Col md="12" className="pro-pic t1">
                                    <div className="card-img-overlay">
                                        <ul className="list-inline">
                                            <li className="list-inline-item">
                                                <a href="#">
                                                    <i className="fa fa-github"></i>
                                                </a>
                                            </li>
                                            <li className="list-inline-item">
                                                <a href="#">
                                                    <i className="fa fa-envelope-o"></i>
                                                </a>
                                            </li>
                                            <li className="list-inline-item">
                                                <a href="#">
                                                    <i className="fa fa-instagram"></i>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </Col>
                                <Col md="12">
                                    <div className="p-t-10">
                                        <h5 className="title font-medium">
                                            김 현철
                                        </h5>
                                        <h6 className="subtitle">
                                            Property Specialist
                                        </h6>
                                        <p></p>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col lg="4" md="6" className="m-b-10">
                            <Row className="no-gutters m-2">
                                <Col md="12" className="col-md-12 pro-pic t2">
                                    <div className="card-img-overlay">
                                        <ul className="list-inline">
                                            <li className="list-inline-item">
                                                <a href="#">
                                                    <i className="fa fa-github"></i>
                                                </a>
                                            </li>
                                            <li className="list-inline-item">
                                                <a href="#">
                                                    <i className="fa fa-envelope-o"></i>
                                                </a>
                                            </li>
                                            <li className="list-inline-item">
                                                <a href="#">
                                                    <i className="fa fa-instagram"></i>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </Col>
                                <Col md="12">
                                    <div className="p-t-10">
                                        <h5 className="title font-medium">
                                            김 윤경
                                        </h5>
                                        <h6 className="subtitle">
                                            Property Specialist
                                        </h6>
                                        <p></p>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col lg="4" md="6" className="m-b-10">
                            <Row className="no-gutters m-2">
                                <Col md="12" className="col-md-12 pro-pic t3">
                                    <div className="card-img-overlay">
                                        <ul className="list-inline">
                                            <li className="list-inline-item">
                                                <a href="#">
                                                    <i className="fa fa-github"></i>
                                                </a>
                                            </li>
                                            <li className="list-inline-item">
                                                <a href="#">
                                                    <i className="fa fa-envelope-o"></i>
                                                </a>
                                            </li>
                                            <li className="list-inline-item">
                                                <a href="#">
                                                    <i className="fa fa-instagram"></i>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </Col>
                                <Col md="12">
                                    <div className="p-t-10">
                                        <h5 className="title font-medium">
                                            김 태경
                                        </h5>
                                        <h6 className="subtitle">
                                            Property Specialist
                                        </h6>
                                        <p></p>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className="px-5">
                        <Col lg="4" md="6" className="m-b-30">
                            <Row className="no-gutters m-2">
                                <Col md="12" className="col-md-12 pro-pic t4">
                                    <div className="card-img-overlay">
                                        <ul className="list-inline">
                                            <li className="list-inline-item">
                                                <a href="#">
                                                    <i className="fa fa-github"></i>
                                                </a>
                                            </li>
                                            <li className="list-inline-item">
                                                <a href="#">
                                                    <i className="fa fa-envelope-o"></i>
                                                </a>
                                            </li>
                                            <li className="list-inline-item">
                                                <a href="#">
                                                    <i className="fa fa-instagram"></i>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </Col>
                                <Col md="12">
                                    <div className="p-t-10">
                                        <h5 className="title font-medium">
                                            이 상훈
                                        </h5>
                                        <h6 className="subtitle">
                                            Property Specialist
                                        </h6>
                                        <p></p>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col lg="4" md="6" className="m-b-30">
                            <Row className="no-gutters m-2">
                                <Col md="12" className="col-md-12 pro-pic t5">
                                    <div className="card-img-overlay">
                                        <ul className="list-inline">
                                            <li className="list-inline-item">
                                                <a href="#">
                                                    <i className="fa fa-github"></i>
                                                </a>
                                            </li>
                                            <li className="list-inline-item">
                                                <a href="#">
                                                    <i className="fa fa-envelope-o"></i>
                                                </a>
                                            </li>
                                            <li className="list-inline-item">
                                                <a href="#">
                                                    <i className="fa fa-instagram"></i>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </Col>
                                <Col md="12">
                                    <div className="p-t-10">
                                        <h5 className="title font-medium">
                                            이 회영
                                        </h5>
                                        <h6 className="subtitle">
                                            Property Specialist
                                        </h6>
                                        <p></p>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col lg="4" md="6" className="m-b-30">
                            <Row className="no-gutters m-2">
                                <Col md="12" className="col-md-12 pro-pic t6">
                                    <div className="card-img-overlay">
                                        <ul className="list-inline">
                                            <li className="list-inline-item">
                                                <a href="#">
                                                    <i className="fa fa-github"></i>
                                                </a>
                                            </li>
                                            <li className="list-inline-item">
                                                <a href="#">
                                                    <i className="fa fa-envelope-o"></i>
                                                </a>
                                            </li>
                                            <li className="list-inline-item">
                                                <a href="#">
                                                    <i className="fa fa-instagram"></i>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </Col>
                                <Col md="12">
                                    <div className="p-t-10">
                                        <h5 className="title font-medium">
                                            차 하린
                                        </h5>
                                        <h6 className="subtitle">
                                            Property Specialist
                                        </h6>
                                        <p></p>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default TeamComponent;
