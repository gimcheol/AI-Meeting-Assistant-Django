// import './App.css';

// function App() {
//   return (
//       <div>
//           <h1>ReactJS 시작</h1>
//       </div>
//   );
// }

// export default App;

import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Switch } from "react-router-dom";
import React from "react";

import Components from "./views/components/components.jsx";
import HomeComponents from "./views/components/home-components.jsx";
import ScheduleComponents from "./views/schedule-components/schedule-components.jsx";
import MeetingComponents from "./views/meeting-components/meeting-components.jsx";
import SummaryComponents from "./views/meeting-components/summary-components.jsx";

import Login from "./views/check-components/check-components.jsx";
import SignupForm from "./views/check-components/sections/join.jsx"
import About from "./views/else-components/about.jsx";

window.Buffer = window.Buffer || require('buffer').Buffer;

function App() {
  return (
    <Routes>
      <Route path="/meeting" element={<MeetingComponents />} />
      <Route path="/summary" element={<SummaryComponents />} />
      <Route path="/schedule" element={<ScheduleComponents />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/signin" element={<Login />} />
      <Route path="/about" element={<About />} />
      <Route path="/home" element={<HomeComponents />} />
      <Route path="/" element={<Components />} />
    </Routes>
  );
}

export default App;