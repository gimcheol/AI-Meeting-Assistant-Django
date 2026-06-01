import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import styled, { keyframes } from "styled-components";
import { useHistory } from "react-router-dom";

const fadeInAnimation = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const HeaderBanner = () => {
    const [titleVisible, setTitleVisible] = useState(false);

    useEffect(() => {
        // 페이지가 로드될 때 애니메이션을 시작하도록
        setTitleVisible(true);
    }, []);

    return (
        <StyledHeaderBanner
            className={`static-slider-head ${titleVisible ? "visible" : ""}`}
        >
            <Container>
                <Row className="justify-content-left">
                    <Col lg="6" md="6" className="align-self-center text-left">
                        <AnimatedTitle
                            className={`title ${titleVisible ? "fade-in" : ""}`}
                            style={{ marginTop: "10px" }}
                        >
                            <GreenN>NEW</GreenN>
                        </AnimatedTitle>
                        <AnimatedTitle
                            className={`title ${titleVisible ? "fade-in" : ""}`}
                        >
                            <GreenN>K</GreenN>eyword
                        </AnimatedTitle>
                        <AnimatedTitle
                            className={`title ${titleVisible ? "fade-in" : ""}`}
                        >
                            <GreenN>T</GreenN>ool
                        </AnimatedTitle>
                    </Col>
                    <Col lg="4" md="6" className="align-self-center text-left">
                        <Animatedsubtitle>
                            <h4
                                className="subtitle font-light"
                                style={{ marginTop: "100px" }}
                            >
                                핵심 키워드 추출, 키워드 설명, 회의요약을
                                <br />
                                통한
                                <b> 효율적인 회의 </b>
                                <br /> 지금 바로 시작하세요!
                            </h4>

                            {/* <Link
                                to="/signin"
                                className="btn btn-md m-t-40 btn-info-gradiant font-18"
                            >
                                Meeting
                            </Link> */}
                            <div class="buttons">
                                <Link to="/signin">
                                    <button class="btn-hover color-9">
                                        Meeting
                                    </button>
                                </Link>
                            </div>
                        </Animatedsubtitle>
                    </Col>
                </Row>
            </Container>
        </StyledHeaderBanner>
    );
};

const StyledHeaderBanner = styled.div`
    /* Add your styles here */
    &.visible {
        /* Add styles for the visible state */
    }
`;

const AnimatedTitle = styled.h1`
    font-size: 54px;
    font-style: normal;
    font-weight: 500;
    line-height: 27px;
    margin-top: 0px;
    opacity: 0;
    animation: ${fadeInAnimation} 4s ease;
    animation-fill-mode: forwards;
`;
const Animatedsubtitle = styled.h3`
    font-size: 54px;
    font-style: normal;
    font-weight: 500;
    line-height: 27px;
    margin-top: 0px;
    opacity: 0;
    animation: ${fadeInAnimation} 4s ease;
    animation-fill-mode: forwards;
    animation-delay: 0.5s; /* 2초의 딜레이 추가 */
`;
const GreenN = styled.span`
    // color: rgba(51, 174, 169, 0.9);
    color: rgba(180, 250, 250, 1);
`;

export default HeaderBanner;
