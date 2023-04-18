import { profile } from "./profile";

export interface user {
    ID: number,
    name: string,
    password: string,
    re_password: string,
    register_date: Date ,
    gender: number,
    birth_date: Date,
    type: number,
    profile: profile,
};