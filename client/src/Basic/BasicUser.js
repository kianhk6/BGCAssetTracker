import React from "react";
import "../App.css";
import { Link } from 'react-router-dom';
import axios from 'axios';



function BasicUser() {
    React.useEffect(() => {
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

    const checkForOverdueEquipment = async (e) => {
        const current_date = new Date();
        axios.post("/CheckForOverdueEquipment", { current_date });
    } 

    const handleLogout = async (e) => {
        e.preventDefault();
        sessionStorage.clear();
        window.location.reload();
    };


    return (
        <div>
            <div className="form1" >
                <Link to="/SearchEquip" class="btn btn-primary btn-lg col-12 mb-4">Search equipment</Link>
                <Link to="/RequestEquip" class="btn btn-warning btn-lg col-12 mb-4">Request equipment</Link>
                <Link to="/YourEquip" class="btn btn-dark btn-lg col-12 mb-4">Your Equipments</Link>
                <form className="mb-2" onSubmit={handleLogout}>
                    <button type="submit" class="btn btn-danger btn-lg col-12 ">Logout</button>
                </form>
            </div>
        </div>
    );
}

export default BasicUser;