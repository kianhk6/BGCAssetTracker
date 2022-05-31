import React from "react"; 
import es6 from "es6-promise";
import "isomorphic-fetch";
import { Navigate } from 'react-router-dom';
import Basic from "../Basic/SearchEquipBasic";
import Pro from "../notBasic/SearchEquipPro";
import { getStatus } from "../util/getStatus";

es6.polyfill();

function SearchEquip() {
    var status = getStatus();
    return (
        ((status) == "a") ? (
            <Pro />
        ) : ((status) == "e") ? (<Pro />) :

            ((status == "b") ? (<Basic />)
                : (<Navigate to="/" replace={true} />)
            ));   
}

export default SearchEquip;