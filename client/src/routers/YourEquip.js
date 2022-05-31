import React from "react"; 
import es6 from "es6-promise";
import "isomorphic-fetch";
import { Navigate } from 'react-router-dom';
import Basic from "../Basic/YourEquipBasic";

es6.polyfill();
function YourEquip() {
    return (
        (sessionStorage.getItem("access-token") != "") ? (
            <Basic />
        ) : (<Navigate to="/" replace={true} />)
    );
}

export default YourEquip;