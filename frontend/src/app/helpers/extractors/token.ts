import * as JWTdecode from "jwt-decode";


export function getTokenExpiry(): Date {
    const token = sessionStorage.getItem("token");
    if (!token) {
        throw new Error("no token, aborting");
    };

    const decodedToken:JWTdecode.JwtPayload = JWTdecode.default(token);
    const expiry = decodedToken!.exp ?? 0;

    return new Date(expiry);
};

export function getTokenUserID(): Number {
    const token = sessionStorage.getItem("token");
    if (!token) {
        throw new Error("no token, aborting");
    };
    const decodedToken:JWTdecode.JwtPayload = JWTdecode.default(token);
    const userID = decodedToken!.sub;

    return Number(userID);
};
