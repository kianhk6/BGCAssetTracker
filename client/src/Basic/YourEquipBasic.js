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

function YourEquipBasic() {
    const [data, setData] = useState([]);
    const [q, setQ] = useState(""); //query filter
    const [searchColumns, setSearchColumns] = useState(["end_date"]);
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

    useEffect(() => {
        var email = sessionStorage.getItem('user_email')
        axios.get(`/UserEquipQuery/${email}`)
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
            <div class="form-control">
                <button class="mt-3 mb-3 ms-1 btn btn-primary btn-lg btn-block" onClick={() => setIsOpen(true)}>Search Category</button>
                <input
                    id="inpData"
                    name="DATA"
                    type='text'
                    placeholder="Search"
                    class="form-control"
                    value={q}
                    onChange={(e) => { setQ(e.target.value); BarcodeID = e.target.value; }}
                />
                <Datatable data={search(data)} />
            </div>


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

export default YourEquipBasic;