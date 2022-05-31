import React from "react"; //STORE DATA
import "../App.css";
import es6 from "es6-promise";
import "isomorphic-fetch";
import { Navigate } from 'react-router-dom';
import Basic from "../Basic/RequestEquipBasic";
import {getStatus} from '../util/getStatus'
es6.polyfill();


function RequestEquip() {
    var status = getStatus();
    return (
        (status != null) ? (<Basic />) : (<Navigate to="/" replace={true} />)
        
    );
}

export default RequestEquip;