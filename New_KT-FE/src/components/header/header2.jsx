/* eslint-disable */
import React, { useState } from "react";
// import { HashLink as Link } from 'react-router-hash-link';
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
import LogoutButton from "./Logout2.jsx";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    /*--------------------------------------------------------------------------------*/
    /*To open NAVBAR in MOBILE VIEW                                                   */
    /*--------------------------------------------------------------------------------*/

    return (
        <div className="topbar" id="top">
            <div className="header6">
                <Container className="po-relative">
                    <Navbar className="navbar-expand-lg h6-nav-bar">
                        <NavbarBrand href="/home">
                            <img
                                src={logo}
                                alt="wrapkit"
                                style={{ maxWidth: "150px", height: "auto" }}
                            />
                        </NavbarBrand>
                        <NavbarToggler onClick={toggle}>
                            <span className="ti-menu"></span>
                        </NavbarToggler>
                        <Collapse
                            isOpen={isOpen}
                            navbar
                            className="hover-dropdown font-14 justify-content-end"
                            id="h6-info"
                        >
                            <Nav navbar className="ms-auto">
                                <NavItem>
                                    <Link className="nav-link" to={"/home"}>
                                        HOME
                                    </Link>
                                </NavItem>
                                <NavItem>
                                    <Link className="nav-link" to={"/schedule"}>
                                        Schedule
                                    </Link>
                                </NavItem>
                                <NavItem>
                                    <Link className="nav-link" to={"/about"}>
                                        About
                                    </Link>
                                </NavItem>
                            </Nav>
                            <LogoutButton />
                            {/* <div className="act-buttons">
                                <Link
                                    to={"/"}
                                    className="btn btn-success-gradiant font-14"
                                >
                                    Logout
                                </Link>
                            </div> */}
                        </Collapse>
                    </Navbar>
                </Container>
            </div>
        </div>
    );
};
export default Header;
