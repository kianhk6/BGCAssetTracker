import React, { useState, useEffect } from "react";
import axios from "axios";
import es6 from "es6-promise";
import "isomorphic-fetch";
import Datatable from "../components/datatable";
import BarcodeScannerComponent from "react-webcam-barcode-scanner";
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from "react-modal";
import Form from 'react-bootstrap/Form';
import Navbar from "../components/NavBarPro";

es6.polyfill();
var BarcodeID = "";

function SearchEquipPro() {
    const [data, setData] = useState([]);
    const [q, setQ] = useState(""); //query filter
    const [searchColumns, setSearchColumns] = useState(["barcode_id", "equipment_status"]);
    const [barcode_id, setBarcodeItem] = useState("");
    const [modalIsOpen, setIsOpen] = useState(false);
    const [modalIsOpenForChange, setIsOpenForChange] = useState(false);
    const [equipment_type, setEquipmentType] = useState("");
    const [category, setCategory] = useState("");
    const [project, setProject] = useState("");
    const [equipment_status, setEquipmentStatus] = useState("");
    const [equipment_group, setEquipmentGroup] = useState("");
    const [location, setLocation] = useState("");

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

    useEffect(() => {
        axios.get(`/GeneralEquipmentQuery`)
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

    function handleDelete() {
        axios.post(`/DeleteEquip`, { BarcodeID })
            .then((response) => {
                window.location.reload();
                return response.data.equips;
            });
    }
    const ScanBarcode = async (e) => {
        e.preventDefault();
        try {
            const barcodeScan = localStorage.getItem("barcode");
            if (barcodeScan === "" || barcodeScan === null) {
                window.alert("Please display barcode clearly when scanning it in.")
            } else if (barcodeScan != null && barcodeScan != "") {
                setQ(barcodeScan.replaceAll('"', ''));
            }
        } catch (err) {
            console.log(err)
        }
    }

    function handleUpdate(e) {
        e.preventDefault();
        console.log(q)
        if (q == "" || q == null) {
            window.alert("fill out the barcode in the search bar")
        }
        else {

            try {
                axios.post(`/updateEquip`, { q, equipment_type, category, project, equipment_status, equipment_group, location })
                    .then((response) => {
                        if (response.data === "error") {
                            window.alert("something went wrong try with a correct id")
                        }
                        else {
                            window.location.reload();
                        }
                    });
            }
            catch (err) {
                window.alert("something went wrong please try again")
            }
        }
    }
    const columns = data[0] && Object.keys(data[0]);

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
        <container>
            <Navbar />
            <Form class="row" onSubmit={ScanBarcode}>
                <div class="mb-1 pr-5">
                    <><BarcodeScannerComponent
                        width={300}
                        height={300}
                        onUpdate={(err, result) => {
                            if (result) {
                                const barcodeData = result.text
                                setBarcodeItem(barcodeData);
                                localStorage.setItem("barcode", JSON.stringify(barcodeData));
                            }
                        }} />
                    </>
                </div>

                <div class="mb-4 d-flex justify-content-center align-items-center">
                    <button type="submit" style={{ transform: "scale(1.3)" }} class="btn btn-success btn-lg btn-block">Search using Barcode</button>
                </div>
                <p class="h3" >Detected barcode: {barcode_id}</p>
            </Form>
            <div class="form-control">
                <button class="mt-3 mb-3 ms-1 btn btn-primary btn-lg btn-block" onClick={() => setIsOpen(true)}>Search Category</button>
                <input
                    id="inpData"
                    name="DATA"
                    type='text'
                    placeholder=" Perform action with barcode"
                    class="form-control"
                    value={q}
                    onChange={(e) => { setQ(e.target.value); BarcodeID = e.target.value; }}
                />
                <Datatable data={search(data)} />
                <button class=" mb-2 mt-4 bbtn btn-warning btn-lg btn-block" onClick={() => setIsOpenForChange(true)}>Edit Equipment</button>
                <div class="ms-3 mb-5 mt-4 ">
                    <button onClick={handleDelete} style={{ transform: "scale(1.3)" }} type="submit" class="btn btn-danger btn-lg btn-block">Delete</button>
                </div>
            </div>
            <Modal isOpen={modalIsOpenForChange} onRequestClose={() => setIsOpenForChange(false)}>

                <Form class="align-items-center" onSubmit={handleUpdate}>
                    <Form.Group class="form-control" >
                        <div class="mb-1 pr-5">
                            <Form.Label class="mb-5"><strong>Update Equipment: {q}</strong></Form.Label>
                            <br></br>
                            <Form.Label>Update Equipment Type</Form.Label>
                            <input
                                type="text"
                                placeholder="equipment type"
                                class="form-control"
                                onChange={(equipment_type) => setEquipmentType(equipment_type.target.value)} />
                            <Form.Label>Update Category</Form.Label>
                            <input
                                type="text"
                                placeholder="category"
                                class="form-control"
                                onChange={(category) => setCategory(category.target.value)} />
                            <Form.Label>Update Project</Form.Label>
                            <input
                                type="text"
                                placeholder="project"
                                class="form-control"
                                onChange={(project) => setProject(project.target.value)} />
                            <Form.Label>Update Equipment Status</Form.Label>
                            <select id="roles" multiple name="role" onChange={(status) => setEquipmentStatus(status.target.value)} class="form-control">
                                <option value="available">Available</option>
                                <option value="Lost">Lost</option>
                                <option value="Retired">Retired</option>
                            </select>
                            <Form.Label>Update Equipment Group</Form.Label>
                            <input
                                type="text"
                                placeholder="equipment group"
                                onChange={(equipment_group) => setEquipmentGroup(equipment_group.target.value)}
                                class="form-control" />
                            <Form.Label>Update Location</Form.Label>
                            <select id="sel1" multiple name="role" class="form-control" onChange={(location) => setLocation(location.target.value)}>
                                <option value="Vancouver">Vancouver</option>
                                <option value="Kamloops">Kamloops</option>
                                <option value="Calgary">Calgary</option>
                                <option value="Edmonton">Edmonton</option>
                                <option value="Toronto">Toronto</option>
                                <option value="Ottawa">Ottawa</option>
                                <option value="Halifax">Halifax</option>
                                <option value="Victoria">Victoria</option>
                            </select>
                            <div class="mb-1 mt-3">
                                <div class="d-flex justify-content-center align-items-center">
                                    <button type="submit" class="btn btn-outline-success btn-lg btn-block">Update Equipment</button>
                                </div>
                            </div>
                        </div>
                    </Form.Group>
                </Form>
                <button class="mt-5 mb-4 btn btn-danger btn-lg btn-block" onClick={() => setIsOpenForChange(false)}>Close</button>
            </Modal>
            <Modal aria-labelledby="contained-modal-title-vcenter" isOpen={modalIsOpen}>
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
                <button class="mt-5 mb-3  ms-5 btn btn-success btn-lg btn-block" style={{ transform: "scale(2)" }} onClick={() => setIsOpen(false)}>Save</button>
            </Modal>
        </container>
    );
}

export default SearchEquipPro;