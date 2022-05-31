import React from "react";
import "../App.css";//
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
function AdminHome() {
    const [, setUser] = useState(null);

    React.useEffect(() => {
        //checking if user needs to stay logged in
        const currentTime = new Date().getMinutes();
        const accToken = sessionStorage.getItem("access-token");
        const loginTime = sessionStorage.getItem("session-start");
        checkForOverdueEquipment();
        const sessionLimit = 20;
        if (currentTime && loginTime) {
            if ((currentTime - loginTime) > sessionLimit || accToken == null) {
                sessionStorage.clear();
                window.location.reload();
            }
        }
    }, []);

    const handleLogout = async (e) => {
        try {
            e.preventDefault();
            window.sessionStorage.clear();
            window.location.reload();
        } catch (err) {
            window.alert("logout failure!")
        }
    };


    const checkForOverdueEquipment = checkForOverDue()

    return (
        <div className="body" >
            <div className="form1" >
                <Link to="/SearchEquip" class="btn btn-primary btn-lg col-12 mb-4">Search equipment</Link>
                <Link to="/SearchUser" class="btn btn-primary btn-lg col-12 mb-4">Search Users</Link>
                <Link to="/BarcodeScan" class="btn btn-success btn-lg col-12  mb-4" >Add equipment</Link>
                <Link to="/Signup" class="btn btn-success btn-lg col-12  mb-4">Add Users</Link>
                <Link to="/RequestEquip" class="btn btn-dark btn-lg col-12 mb-4">Request equipment</Link>
                <Link to="/manageRequests" class="btn btn-dark btn-lg col-12  mb-4" >Check Out</Link>
                <Link to="/CheckIn" class="btn btn-dark btn-lg col-12 mb-4">Check In</Link>
                <Link to="/YourEquip" class="btn btn-dark btn-lg col-12 mb-4">Your Equipments</Link>
                <form className="mb-2" onSubmit={handleLogout}>
                    <button type="submit" class="btn btn-danger btn-lg col-12 ">Logout</button>
                </form>
            </div>
        </div>

    );

    function checkForOverDue() {
        return async () => {
            const current_date = new Date();
            try {
                axios.post("/CheckForOverdueEquipment", { current_date });
            }
            catch (err) {
                console.log(err);
            }
        };
    }
}

export default AdminHome;