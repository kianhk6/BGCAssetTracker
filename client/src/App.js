import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginHome from "./LoginHome";
import Signup from "./Admin/Signup";
import BarcodeScan from "./routers/SignUpEquip.js";
import SearchEquip from "./routers/SearchEquip";
import SearchUser from "./routers/SearchUser.js";
import RequestEquip from "./routers/RequestEquip.js";
import ManageRequests from "./routers/ManageRequests.js";
import CheckIn from "./routers/CheckIn";
import YourEquip from "./routers/YourEquip";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LoginHome />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/BarcodeScan" element={<BarcodeScan />} />
          <Route path="/SearchEquip" element={<SearchEquip />} />
          <Route path="/SearchUser" element={<SearchUser />} />
          <Route path="/RequestEquip" element={<RequestEquip />} />
          <Route path="/manageRequests" element={<ManageRequests />} />
          <Route path="/CheckIn" element={<CheckIn />} />
          <Route path="/YourEquip" element={<YourEquip />} />
        </Routes>
      </Router>
    </>
  );

}

export default App;