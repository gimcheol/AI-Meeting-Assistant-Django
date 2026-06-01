import React, { useState } from "react";
import { Button } from "reactstrap";

const Voice = () => {
    const [buttonText, setButtonText] = useState("Start");

    const handleSubmit = () => {
        fetch(`http://127.0.0.1:8000/users/voice/${buttonText.toLowerCase()}/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${window.localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                text: buttonText,
            }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw Error(res.statusText);
                }
                return res.json();
            })
            .then((res) => {
                console.log(res);
                
                if (buttonText === "Finish") {
                    window.location.href = "/home";
                }
            })
            .catch((err) => {
                console.error(err);
            });

        // 버튼 텍스트를 변경합니다.
        setButtonText(buttonText === "Start" ? "Finish" : "Start");
    };

    return (
        <div
            className="board-list-container"
            style={{ margin: "0 auto", maxWidth: "1000px" }}
        >
            <Button color="primary" size="lg" block onClick={handleSubmit}>
                {buttonText}
            </Button>
        </div>
    );
};

export default Voice;
