import * as JWTdecode from "jwt-decode";


export function isTokenExpired(): Boolean {
    const token = sessionStorage.getItem("token");
    if (!token) {
        throw new Error("no token, aborting");
    };

    const decodedToken:JWTdecode.JwtPayload = JWTdecode.default(token);

    const expiry = decodedToken!.exp!;

    if(expiry < (new Date()).getTime()) {
        return true;
    } else {
        return false;
    };
};

export function getTokenUserID(): number {
    const token = sessionStorage.getItem("token");
    if (!token) {
        throw new Error("no token, aborting");
    };
    const decodedToken:JWTdecode.JwtPayload = JWTdecode.default(token);
    const userID = decodedToken!.sub;

    return Number(userID);
};
