import React from "react"; 
import "../App.css";
import es6 from "es6-promise";
import "isomorphic-fetch";
import { Navigate } from 'react-router-dom';
import Pro from "../Admin/SearchUserPro";
import { getStatus } from "../util/getStatus";
es6.polyfill();


function SearchUser() {
    var status = getStatus();
    return (
        (status == "a") ? ((<Pro />)
        ) : (<Navigate to="/" replace={true} />)
    );
}

export default SearchUser;


