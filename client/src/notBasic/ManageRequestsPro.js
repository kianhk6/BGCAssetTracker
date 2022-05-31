import React, { useState, useEffect } from "react"; //STORE DATA
import axios from "axios";
import es6 from "es6-promise";
import "isomorphic-fetch";
import Modal1 from "react-modal";
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';
//import from datatable folder//
import Datatable from "../components/datatable";
import Navbar from "../components/NavBarPro";
import jwt_decode from 'jwt-decode';

es6.polyfill();
var BarcodeID = "";
//import SearchEquip from "./SearchEquip";
var date = new Date();
Modal1.setAppElement("#root");
function RequestDetailModal(props) {
    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endDate, setEndDate] = useState("");
    const [endTime, setEndTime] = useState("");
    const [user, setUser] = useState("");
    const [equipmentGroup, setEquipmentGroup] = useState("");

    useEffect(() => {
        const currentTime = new Date().getMinutes();
        const loginTime = sessionStorage.getItem("session-start");
        const sessionLimit = 20;
        if (currentTime && loginTime) {
            if ((currentTime - loginTime) > sessionLimit) {
                sessionStorage.clear();
                window.location.reload();
            }
        }


        checkForOverdueEquipment();
    })

    function formatAMPM(date) {
        var hours = date[0];
        var minutes = date[1];
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? minutes : minutes;
        var strTime = hours + ':' + minutes + ':00'+ ' ' + ampm;
        return strTime;
    }
    function HandleCheckOut() {
        window.event.preventDefault();
        var barcode_id = localStorage.getItem("barcode");
        if (startTime === "" || startDate === "" || endTime === "" || endDate === "" || equipmentGroup === "") {
            window.alert("fill out the form!")
        }
        var present_date = new Date();
        if (present_date > startDate || startDate > endDate) {
            window.alert("Invalid Timing")
        }
        else {
            var startDateTemp = startDate.split('-');
            var startTimeTemp = formatAMPM(startTime.split(':'));

            var initial_date = startDateTemp[2] + "/" + startDateTemp[1] + "/" + startDateTemp[0] + ", " + startTimeTemp;

            var endDateTemp = endDate.split('-');
            var endTimeTemp = formatAMPM(endTime.split(':'));
            var end_date = endDateTemp[2] + "/" + endDateTemp[1] + "/" + endDateTemp[0] + ", " + endTimeTemp;

            var end_date_compare = endDate + ',' + endTime;



            axios.post(`/AcceptRequestEquip`, { barcode_id, initial_date, end_date, equipmentGroup, end_date_compare })
                .then((response) => {
                    window.location.reload();
                    return;
                });

        }

    }
    const checkForOverdueEquipment = async (e) => {
        const current_date = new Date();
        try {
            axios.post("/CheckForOverdueEquipment", { current_date });
        }
        catch (err) {
            console.log(err);
        }

    }

    return (
        (localStorage.getItem('barcode') == "") ? (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <p class="h3">Fill out the Barcode!</p>
                </Modal.Header>
            </Modal>) :

            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <p class="h3"> Borrowing detail for item {localStorage.getItem('barcode')}</p>
                </Modal.Header>
                <Modal.Body>
                    <form class='form-control' onSubmit={HandleCheckOut}>
                        <Form.Label>Select start Date</Form.Label>
                        <input
                            class="form-control mb-4"
                            type="date"
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        <input
                            class="form-control mb-4"
                            onChange={(e) => setStartTime(e.target.value)}
                            type="time"
                        />
                        <Form.Label class="mt-3">Select return Date</Form.Label>
                        <input
                            class="form-control mb-4"
                            type="date"
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                        <input
                            class="form-control mb-4"
                            type="time"
                            onChange={(e) => setEndTime(e.target.value)}
                        />
                        <Form.Label class="mt-3">Project</Form.Label>
                        <input
                            class="form-control mb-4"
                            type="text"
                            onChange={(e) => setEquipmentGroup(e.target.value)}
                        />
                        <button type="submit" class="btn btn-success mb-3 btn-lg btn-block">Check out</button>
                    </form>


                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
    );
}

function ManageRequestsPro() {
    //default value [getter, setteer]

    const [data, setData] = useState([]);
    const [, setreqEquip] = useState([]);
    const [q, setQ] = useState(""); //query filter
    const [searchColumns, setSearchColumns] = useState(['equipment_barcode']);
    const [modalShow, setModalShow] = React.useState(false);
    const [modalIsOpen, setIsOpen] = useState(false);



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
        try {
            axios.post("/CheckForOverdueEquipment", { current_date });
        }
        catch (err) {
            console.log(err);
        }

    }


    function handleCancelRequest() {
        var email = jwt_decode(sessionStorage.getItem("access-token")).email;
        var barcode_id = q;
        console.log(email);
        console.log(q);
        if (q == '') {
            window.alert("fill in the barcode")
        }
        axios.post(`/CancelRequestEquipPro`, { email, barcode_id })
            .then(() => {
                window.location.reload();
                return;
            });
    }

    useEffect(() => {
        console.log(localStorage.getItem("barcode"))

        console.log(searchColumns)
        axios.get(`/RequestsQuery`)
            .then((response) => {

                return response.data.equips;
            })
            .then(function (myJson) {
                setData(myJson)
            });
        var email = jwt_decode(sessionStorage.getItem("access-token")).email;

        axios.post(`/RequestedEquipmentQuery`, { email })
            .then((response) => {
                return response.data.equips;
            })
            .then(function (myJson) {
                setreqEquip(myJson)
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

    function handleShow() {
        localStorage.setItem("barcode", q)
        setModalShow(true)
    }

    const columns = data[0] && Object.keys(data[0]);
    return (
        <container>
            <Navbar />
            <div>
                <div class="form-control">
                    <button class="mt-3 mb-3 ms-1 btn btn-primary btn-lg btn-block" onClick={() => {
                        setIsOpen(true)
                        console.log(modalIsOpen)
                    }}>Search Category</button>
                    <h3 class="mb-2">Requests</h3>
                    <input
                        id="inpData"
                        name="DATA"
                        type='text'
                        placeholder="Perform action with barcode"
                        class="form-control"
                        value={q}
                        onChange={(e) => {

                            localStorage.setItem("barcode", q);
                            setQ(e.target.value);
                        }}
                    />

                    <Datatable data={search(data)} />
                    <div class="mb-3 ms-4 mt-5" >
                        <button onClick={handleCancelRequest} style={{ transform: "scale(1.3)" }} type="submit" class="btn btn-danger btn-lg btn-block">Cancel Request</button>==
                        <button onClick={handleShow} style={{ transform: "scale(1.3)" }} type="submit" class="btn btn-success btn-lg btn-block ms-5">Accept Request</button>

                    </div>
                </div>
                <>
                    <RequestDetailModal
                        show={modalShow}
                        onHide={() => setModalShow(false)}
                    />
                </>
                <Modal1 aria-labelledby="contained-modal-title-vcenter" isOpen={modalIsOpen}>
                    <table>
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
                    <button class="mt-5 mb-3  ms-5 btn btn-success btn-lg btn-block" style={{ transform: "scale(2)" }} onClick={() => setIsOpen(false)}>Save</button>
                </Modal1>


            </div>
        </container> //

    );
}

export default ManageRequestsPro;