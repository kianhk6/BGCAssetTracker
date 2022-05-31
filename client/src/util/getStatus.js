import jwt_decode from "jwt-decode";

export function getStatus() {
    return sessionStorage.getItem("access-token") == null ? null : jwt_decode(sessionStorage.getItem("access-token")).status;
}
