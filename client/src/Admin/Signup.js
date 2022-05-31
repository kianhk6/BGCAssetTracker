import React from "react";
import "../App.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { Navigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { useState} from 'react';
import Navbar from "../components/NavBarPro";
import { getStatus } from "../util/getStatus";

function Signup() {
    const [, setUser] = useState(null);
    const [status, setStatus] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    
    React.useEffect(() => {
        //checking if user needs to stay logged in
        const currentTime = new Date().getMinutes();
        const accToken = sessionStorage.getItem("access-token");
        const loginTime = sessionStorage.getItem("session-start");
        const sessionLimit = 20;
        if (currentTime && loginTime) {
            if ((currentTime - loginTime) > sessionLimit || accToken == null) {
                sessionStorage.clear();
                window.location.reload();
            }
        }
    }, []);

    const handleSignUP = async (e) => {
        e.preventDefault();
        try {
            if (name === "" || email === "" || password === "" || status === "") {
                window.alert("fill out all fields before signing up.")
            } else {
                const res = await axios.post("/signup", { name, email, password, status });
                setUser(res.data);
                window.alert("user added!");
            }
        } catch (err) {
            window.alert("user is already there")
        }
    }

    var currentUserStatus = getStatus();
    
    return (
        (currentUserStatus== "a") ? (
            <div className="container" >
                <Navbar />
                <Form class="align-items-center" onSubmit={handleSignUP}>
                    <Form.Group class="form-control" >
                        <Form.Label>Name</Form.Label>
                        <input
                            type="text"
                            placeholder="name"
                            onChange={(e) => setName(e.target.value)}
                            class="form-control"
                        />
                        <Form.Label>Email</Form.Label>
                        <input
                            type="text"
                            class="form-control"
                            placeholder="email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Form.Label>Password</Form.Label>
                        <input
                            class="form-control"
                            type="password"
                            placeholder="password"
                            onChange={(e) => setPassword(e.target.value)} />
                        <Form.Label>Location</Form.Label>
                        <select id="sel1" multiple name="role" class="form-control" onChange={(e) => setStatus(e.target.value)}>
                            <option value="a">Admin</option>
                            <option value="b">Basic</option>
                            <option value="e">Equipment manager</option>
                        </select>
                        <div class="mb-1 mt-3">
                            <div class="d-flex justify-content-center align-items-center">
                                <button type="submit" class="btn btn-outline-success btn-lg btn-block">Add User</button>
                            </div>
                        </div>
                        <div class="mb-3 mt-3">
                            <div class="d-flex justify-content-center align-items-center">
                                <div class="row">
                                    <Link to="/" class="btn btn-outline-danger btn-lg btn-block"> Go back </Link>
                                </div>
                            </div>
                        </div>

                    </Form.Group>
                </Form>
            </div>
        ) : (<Navigate to="/" replace={true} />)
    );
}

export default Signup;