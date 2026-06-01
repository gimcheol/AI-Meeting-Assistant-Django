import React from "react";
import PropTypes from "prop-types";

// core components
import Header2 from "../../components/header/header2.jsx";
import HeaderBanner2 from "../../components/banner/banner2.jsx";
import Footer from "../../components/footer/footer.jsx";

const Components = () => {
    return (
        <div id="main-wrapper">
            <Header2 />
            <div className="page-wrapper">
                <div className="container-fluid">
                    <HeaderBanner2 />
                    {/* <Buttons /> */}
                </div>
            </div>
            <Footer />
        </div>
    );
}

Components.propTypes = {
    classes: PropTypes.object
};

export default Components;
