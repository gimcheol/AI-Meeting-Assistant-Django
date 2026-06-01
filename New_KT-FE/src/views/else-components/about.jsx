import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// core components
import BeginBanner from "../../components/banner/begin-banner.jsx";
import AfterBanner from "../../components/banner/after-banner.jsx";
import Footer from "../../components/footer/footer.jsx";
import TeamComponent from "./sections/teamcomponent.jsx";

const AboutComponents = () => {
    const [isLoggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        // Check if the user is logged in based on the presence of the authentication token
        const authToken = window.localStorage.getItem('token');
        setLoggedIn(!!authToken); // Set isLoggedIn to true if authToken is present
    }, []); // Run this effect only once when the component mounts

    return (
        <div id="main-wrapper">
            <div className="page-wrapper">
                <div className="container-fluid">
                    {/* Conditionally render BeginBanner or AfterBanner based on login status */}
                    {isLoggedIn ? <AfterBanner /> : <BeginBanner />}
                    <TeamComponent />
                </div>
            </div>
            <Footer />
        </div>
    );
}

AboutComponents.propTypes = {
    classes: PropTypes.object
};

export default AboutComponents;
