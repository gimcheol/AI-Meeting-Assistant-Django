import React from "react";
import { Link } from "react-router-dom";

const LogoutButton = () => {
    const onLogout = () => {

        fetch(
            "http://127.0.0.1:8000/users/logout/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${window.localStorage.getItem('token')}`,
                },
                // body: JSON.stringify({
                //     "access_token": window.localStorage.getItem("token"),
                // }),
            }
        )
            // .then((res) => res.json())
        .then((res) => {
            if (!res.ok) {
                throw new Error(`${res.status} ${res.statusText}`);
            }
            return res.json();
        })
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
        <div className="act-buttons">
            <Link
                // to={"/"}
                className="btn btn-success-gradiant font-14"
                onClick={onLogout}
            >
                Logout
            </Link>
        </div>
    );
};

export default LogoutButton;
