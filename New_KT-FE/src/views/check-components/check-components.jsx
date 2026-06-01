import React from "react";
// import PropTypes from "prop-types";

// core components
import HeaderBanner3 from "../../components/banner/banner3.jsx";
import Footer from "../../components/footer/footer.jsx";

// sections for this page
import PageLogin from "./sections/login.jsx";

const Login = () => {
    return (
        <div id="main-wrapper">
            {/* <Header /> */}
            <div className="page-wrapper">
                <div className="container-fluid">
                    
                    {/* <HeaderBanner /> */}
                    <HeaderBanner3 />
                    {/* <HeaderComponent /> */}
                    
                    {/* 로그인 폼 구현 */}
                    <PageLogin />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Login;
