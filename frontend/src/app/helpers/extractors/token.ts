import * as JWTdecode from "jwt-decode";


export function isTokenExpired(): Boolean {
    const token = getToken();
    if (!token) {
        throw new Error("no token, aborting");
    };

    const decodedToken: JWTdecode.JwtPayload = JWTdecode.default(token);

    const expiry = decodedToken!.exp!;

    if (expiry < (new Date()).getTime()) {
        return true;
    } else {
        return false;
    };
};

export function getTokenUserID(): number | undefined {
    const token = getToken();
    if (!token) {
        return undefined;
    };
    const decodedToken: JWTdecode.JwtPayload = JWTdecode.default(token);
    const userID = decodedToken!.sub;

    return Number(userID);
};

export function getToken(): string | null {
    const token = sessionStorage.getItem("token");
    return token;
};

export function activeToken(): boolean {
    const token = getToken();
    if (!token) {
        return false;
    };
    return true;
};

export function destroyToken(): void {
    sessionStorage.removeItem("token");
};