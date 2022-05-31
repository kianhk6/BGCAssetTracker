import React from "react";
import "../App.css";
import { Navigate } from 'react-router-dom';
import Pro from "../notBasic/ManageRequestsPro";
import {getStatus} from '../util/getStatus'

function ManageRequests() {
    var status = getStatus();
    return (
        (status == "a") ? (
            <Pro />
        ) : ((status == "e") ? (<Pro />) :
            (<Navigate to="/" replace={true} />))

    );
}





export default ManageRequests;