//schedule-components.jsx
import React from "react";
import PropTypes from "prop-types";

// core components
import HeaderBanner4 from "../../components/banner/banner4.jsx";
import Footer from "../../components/footer/footer.jsx";

// sections for this page
import PortfolioComponent from "./sections/portfoliocomponent.jsx";
import PageCalendar from "./sections/mycalendar.jsx";
// import TeamComponent from "./sections/teamcomponent.jsx";

const ScheduleComponents = () => {
    return (
        <div id="main-wrapper">
            <div className="page-wrapper">
                <div className="container-fluid">
                    <HeaderBanner4 />
                    <PageCalendar />
                    {/* <TeamComponent /> */}
                </div>
            </div>
            <Footer />
        </div>
    );
}

ScheduleComponents.propTypes = {
    classes: PropTypes.object
};

export default ScheduleComponents;
