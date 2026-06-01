import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    Container,
    NavbarBrand,
    Navbar,
    Nav,
    NavItem,
    NavbarToggler,
    Collapse,
} from "reactstrap";

import logo from "../../assets/images/logos/New_KT_header.png";
import LogoutButton from "./Logout.jsx";

const AfterBanner = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    return (
        <div className="header1 po-relative bg-dark">
            <Container>
                <Navbar className="navbar-expand-lg h2-nav">
                    <NavbarBrand tag={Link} to="/home">
                        <img
                            src={logo}
                            alt="wrapkit"
                            style={{ maxWidth: "150px", height: "auto" }}
                        />
                    </NavbarBrand>
                    <NavbarToggler onClick={toggle}>
                        <span className="ti-menu text-white"></span>
                    </NavbarToggler>
                    <Collapse isOpen={isOpen} navbar id="header1">
                        <Nav navbar className="ms-auto mt-2 mt-lg-0">
                            {/* Existing NavItems */}
                            <NavItem className="active">
                                <Link to="/home" className="nav-link">
                                    HOME
                                </Link>
                            </NavItem>
                            <NavItem className="active">
                                <Link to="/schedule" className="nav-link">
                                    Schedule
                                </Link>
                            </NavItem>
                            <NavItem className="active">
                                <Link to="/meeting" className="nav-link">
                                    Meeting
                                </Link>
                            </NavItem>
                            <NavItem className="active">
                                <Link to="/about" className="nav-link">
                                    About
                                </Link>
                            </NavItem>
                            <LogoutButton />
                        </Nav>
                    </Collapse>
                </Navbar>
            </Container>
        </div>
    );
};

export default AfterBanner;
