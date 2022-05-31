import React from "react";
import axios from "axios";
import Navbar from "../components/NavBarPro";
import BarcodeScannerComponent from "react-webcam-barcode-scanner";
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import { useState} from 'react';

//
//import Signup from "./Signup";

function SignUpEquipPro() {
    const [, setUser] = useState(null);
    const [barcode_id, setBarcodeItem] = useState("");
    const [, setTheArray] = useState([]);
    const [serial_number, setSerialNumber] = useState("");
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


    const ScanBarcode = async (e) => {
        e.preventDefault();

        try {
            const barcodeScan = localStorage.getItem("barcode");
            if (barcodeScan === "" || barcodeScan === null) {
                window.alert("Please display barcode clearly when scanning it in.")
            } else if (barcodeScan != null && barcodeScan != "") {
                setTheArray(theArray => [...theArray, barcodeScan]);
            }
        } catch (err) {
            console.log(err)
        }
    }
    const signUpEquipment = async (e) => {
        e.preventDefault();
        if (barcode_id, serial_number, equipment_type, category, project, equipment_status, equipment_group, location) {
            const res = await axios.post("/addEquipment", { barcode_id, serial_number, equipment_type, category, project, equipment_status, equipment_group, location }
            );
            console.log(res);
            setUser(res.data);
            window.alert("sent equipment to database!");
        } else {
            window.alert("Some missing field or equipment already exists!")
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
        <container>
            <Navbar />
            <div class="align-items-center">
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
                    <p class="h1" >Detected barcode: {barcode_id}</p>
                </Form>
            </div>
            <Form class="align-items-center" onSubmit={signUpEquipment}>
                <Form.Group class="form-control" >
                    <Form.Label>Barcode</Form.Label>
                    <input
                        type="text"
                        value={barcode_id}
                        onChange={(barcode_id) => setBarcodeItem(barcode_id.target.value)}
                        placeholder="Barcode id"
                        class="form-control"
                        id="barcode" />
                    <Form.Label className="mt-3">Serial number</Form.Label>
                    <input
                        type="text"
                        placeholder="serial number"
                        class="form-control"
                        value={serial_number}
                        onChange={(e) => setSerialNumber(e.target.value)} />
                    <Form.Label className="mt-3">Equipment Type</Form.Label>
                    <input
                        type="text"
                        placeholder="equipment type"
                        class="form-control"
                        onChange={(e) => setEquipmentType(e.target.value)} />
                    <Form.Label className="mt-3">Category</Form.Label>
                    <input
                        type="text"
                        placeholder="category"
                        class="form-control"
                        onChange={(e) => setCategory(e.target.value)} />
                    <Form.Label className="mt-3">Project</Form.Label>
                    <input
                        type="text"
                        placeholder="project"
                        class="form-control"
                        onChange={(e) => setProject(e.target.value)} />
                    <Form.Label className="mt-3">Status</Form.Label>
                    <select id="roles" multiple name="role" onChange={(e) => setEquipmentStatus(e.target.value)} class="form-control">
                        <option value="available">Available</option>
                        <option value="Lost">Lost</option>
                        <option value="Retired">Retired</option>
                    </select>
                    <Form.Label className="mt-3">Equipment Group</Form.Label>
                    <input
                        type="text"
                        placeholder="equipment group"
                        onChange={(e) => setEquipmentGroup(e.target.value)}
                        class="form-control" />
                    <Form.Label className="mt-3">Location</Form.Label>
                    <select id="sel1" multiple name="role" class="form-control" onChange={(e) => setLocation(e.target.value)}>
                        <option value="Vancouver">Vancouver</option>
                        <option value="Kamloops">Kamloops</option>
                        <option value="Calgary">Calgary</option>
                        <option value="Edmonton">Edmonton</option>
                        <option value="Toronto">Toronto</option>
                        <option value="Ottawa">Ottawa</option>
                        <option value="Halifax">Halifax</option>
                        <option value="Victoria">Victoria</option>
                    </select>
                    <div class="mb-4 mt-3">
                        <div class="d-flex justify-content-center align-items-center">
                            <button type="submit" class="btn btn-success btn-lg btn-block">Add Equipment</button>
                        </div>
                    </div>
                </Form.Group>
            </Form>
        </container>
    );
}





export default SignUpEquipPro;