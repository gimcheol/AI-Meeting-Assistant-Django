// loading.jsx
import React from "react";
import { RevolvingDot } from "react-loader-spinner";

const Loading = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <RevolvingDot color="#000000" />
        </div>
    );
};

export default Loading;
