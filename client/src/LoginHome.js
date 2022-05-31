import React from 'react';
import "./App.css";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Admin from "./Admin/AdminHome";
import BasicUser from "./Basic/BasicUser";
import EquipmentManager from "./EquipmentManager/EquipmentManager";
import photo from "./BGCLogo-_Hex_004B91.svg";
import { useState} from 'react';


function LoginHome() {
    const [, setUser] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    React.useEffect(() => {
        //checking if user needs to stay logged in
        const currentTime = new Date().getMinutes();
        const accToken = sessionStorage.getItem("access-token");
        const loginTime = sessionStorage.getItem("session-start");
        checkForOverdueEquipment();
        const sessionLimit = 20;
        if (currentTime && loginTime) {
            if ((currentTime - loginTime) > sessionLimit || accToken == null) {
                const res = axios.post("/logout")
                setUser(res.data);
                sessionStorage.clear();
                window.location.reload();
            }
        }
    }, []);

    const checkForOverdueEquipment = async (e) => {
        const current_date = new Date();
        try {
            axios.post("/CheckForOverdueEquipment", { current_date });
        }
        catch (err) {
            console.log(err);
        }
    }

    axios.create() 

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let loginDate = new Date().getMinutes();
            const res = await axios.post("/login", { email, password });
            sessionStorage.setItem("access-token", JSON.stringify(res.data.accessToken)); 
            sessionStorage.setItem("session-start", JSON.stringify(loginDate));
            setUser(res.data);
        } catch (err) {
            window.alert("wrong email or password");
        }
    };

    var status = sessionStorage.getItem("access-token") == null ? null : jwt_decode(sessionStorage.getItem("access-token")).status;
    return (
        <div className="container">
            {status ? (                  
                (status === "a" ? (<Admin />) : (status === "b" ? (<BasicUser />) : <EquipmentManager />))
            ) : (
                <div class="align-items-center">
                    <div class="mt-5 form-control">
                        <form onSubmit={handleSubmit}>
                            <>{<div> <img src={photo} height="85" width="85" alt="LOGO" /> </div>}</>
                            <input
                                type="text"
                                placeholder="email"
                                class="form-control mb-4"
                                onChange={(e) => setEmail(e.target.value)} />
                            <input
                                type="password"
                                placeholder="password"
                                class="form-control mb-4"
                                onChange={(e) => setPassword(e.target.value)} />
                            <button type="submit" class="btn btn-success btn-lg col-12  mb-4">
                                Login
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>

    );
}

export default LoginHome;