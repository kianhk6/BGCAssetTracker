import React, { useState, useEffect } from "react";
import "../App.css";
import axios from "axios";
import es6 from "es6-promise";
import "isomorphic-fetch";
import Datatable from "../components/datatable";
import Navbar from "../components/NavBarPro";
import Modal from "react-modal";
import Form from 'react-bootstrap/Form';
es6.polyfill();

Modal.setAppElement("#root");
//import SearchEquip from "./SearchEquip";
function SearchUserPro() {
    //default value [getter, setteer]
    var uidSesStg = sessionStorage.getItem("u-id");
    const [modalIsOpen, setIsOpen] = useState(false);
    const [modalIsOpenForSeach, setIsOpenSearch] = useState(false);
    const [data, setData] = useState([]);
    const [q, setQ] = useState("");
    const [searchColumns, setSearchColumns] = useState(["user_name", "user_email"]);
    const [, setUser] = useState(null);
    const [status, setStatus] = useState("");
    const [user_id, setUID] = useState(uidSesStg);
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");


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

    useEffect(() => {
        axios.get(`/GeneralUsersQuery`)
            .then((response) => {
                return response.data.equips;
            })
            .then(function (myJson) {
                setData(myJson)
            });
    }, []);

    function search(rows) {
        return rows.filter((row) =>
            searchColumns.some(
                (column) =>
                    row[column]
                        .toString()
                        .toLowerCase()
                        .indexOf(q.toLowerCase()) > -1,
            ),
        );
    }

    function handleUpdate(e) {
        e.preventDefault();
        var email =  q;
        try {
            axios.post(`/updateUser`, { user_id, status, username, password, email })
                .then((response) => {
                    if (response.data === "error") {
                        window.alert("something went wrong try with a correct email")
                    }
                    else {
                        window.location.reload();
                    }
                });
        } catch (err) {
            window.alert("something went wrong try again")
            console.log(err);
        }
    }

    const columns = data[0] && Object.keys(data[0]);
    const checkForOverdueEquipment = async (e) => {
        const current_date = new Date();
        axios.post("/CheckForOverdueEquipment", { current_date });
    }

    return (
        <div class="align-items-center">
            <Navbar />
            <div>
                <div class="form-control">
                    <div class="form-control">

                        <button class="mt-3 mb-3 ms-1 btn btn-primary btn-lg btn-block" onClick={() => setIsOpenSearch(true)}>Search Category</button>
                        <input
                            id="inpData"
                            name="DATA"
                            type='text'
                            placeholder="Use email for change"
                            class="form-control"
                            value={q}
                            onChange={(e) => { setQ(e.target.value); setUID(e.target.value) }}
                        />
                        <Datatable data={search(data)} />
                        <button class="align-items-center mt-5 mb-4  btn btn-success btn-lg btn-block" onClick={() => setIsOpen(true)}>Edit User</button>
                    </div>
                </div>
            </div>

            <Modal isOpen={modalIsOpen} onRequestClose={() => setIsOpen(false)}>
                <div class="mb-1 pr-5">
                    <Form class="align-items-center" onSubmit={handleUpdate}>
                        <Form.Group class="form-control" >
                            <Form.Label>Update Username</Form.Label>
                            <input
                                type="text"
                                value={username}
                                onChange={(username) => setUsername(username.target.value)}
                                placeholder="Username"
                                class="form-control"
                                id="username" />
                            <Form.Label>Update Password</Form.Label>
                            <input
                                type="text"
                                placeholder="Password"
                                class="form-control"
                                onChange={(password) => setPassword(password.target.value)} />
                            <Form.Label>Update Status</Form.Label>
                            <select id="roles" multiple name="role" onChange={(status) => setStatus(status.target.value)} class="form-control">
                                <option value="a">Administrator</option>
                                <option value="b">Basic User</option>
                                <option value="e">Equipment Manager</option>
                            </select>
                            <div class="mb-1 mt-3">
                                <div class="d-flex justify-content-center align-items-center">
                                    <button type="submit" class="btn btn-success btn-lg btn-block">Update User</button>
                                </div>
                            </div>
                            <div class="mb-3 mt-3">
                                <div class="d-flex justify-content-center align-items-center">
                                </div>
                            </div>

                        </Form.Group>
                    </Form>
                </div>
                <button class="mt-5 mb-4 btn btn-danger btn-lg btn-block" onClick={() => setIsOpen(false)}>Close</button>
            </Modal>

            <Modal aria-labelledby="contained-modal-title-vcenter" isOpen={modalIsOpenForSeach}>
                <table class="">
                    {columns &&
                        columns.map((column) => (
                            <tr>
                                <label class="ms-5">
                                    <div class="mt-5 mb-4">
                                        <div class="form-check form-switch">
                                            <input class="form-check-input"
                                                type="checkbox"
                                                role="switch"
                                                style={{ transform: "scale(3)" }}
                                                id="flexSwitchCheckDefault"
                                                checked={searchColumns.includes(column)}
                                                onChange={(e) => {
                                                    const checked = searchColumns.includes(column);
                                                    setSearchColumns((prev) =>
                                                        checked
                                                            ? prev.filter((sc) => sc !== column)
                                                            : [...prev, column],
                                                    );
                                                }}
                                            />
                                            <div class="ms-5">
                                                <label class="h3" for="flexSwitchCheckDefault">{column}</label>
                                            </div>
                                        </div>
                                    </div>
                                </label>
                            </tr>
                        ))}
                </table>
                <button class="mt-5 mb-3  ms-5 btn btn-success btn-lg btn-block" style={{ transform: "scale(2)" }} onClick={() => setIsOpenSearch(false)}>Save</button>
            </Modal>
        </div>
    );

}
export default SearchUserPro;