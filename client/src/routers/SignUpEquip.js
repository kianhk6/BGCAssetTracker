import React from "react";
import { Navigate } from 'react-router-dom';
import Pro from "../notBasic/SignUpEquipPro";
import { getStatus } from "../util/getStatus";

function SignUpEquip() {
    var status = getStatus();
    return (
        (status == "a") ? (
            <Pro />
        ) : ((status== "e") ? (<Pro />) :
            (<Navigate to="/" replace={true} />))
    );
}

export default SignUpEquip;