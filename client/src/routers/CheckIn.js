import React, {} from "react"; //STORE DATA
import "../App.css";
import es6 from "es6-promise";
import "isomorphic-fetch";
import { Navigate } from 'react-router-dom';
import Pro from "../notBasic/CheckInPro";
import {getStatus} from '../util/getStatus'
es6.polyfill();

function CheckIn() {
    var status = getStatus();
    return (
        (status == "a" || status == "e") ? ( <Pro />
        ) : (<Navigate to="/" replace={true} />)
           
    );
}

export default CheckIn;