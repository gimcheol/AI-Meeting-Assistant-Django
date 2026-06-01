// LogoutButton.js

import React from "react";
import {
    NavItem,
} from "reactstrap";

const LogoutButton = () => {
    const onLogout = () => {
        const token = window.localStorage.getItem("token");
        fetch("http://127.0.0.1:8000/users/logout/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "access_token": token,
            }),
        })
        .then((res) => res.json())
        .then((res) => {
            localStorage.clear();
            window.location.replace("/");
            console.log("로그아웃 했습니다.");
        })
        .catch((error) => {
            console.error("로그아웃 중 에러 발생:", error);
        });
    };

    return (
        <NavItem>
            {/* <a className="btn btn-outline-info" href="/"> */}
            <a href="/" className="btn btn-outline-info" onClick={onLogout}>
                Logout
            </a>
        </NavItem>
    );
};

export default LogoutButton;
