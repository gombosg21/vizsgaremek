import { profile } from "./profile";

export interface user {
    ID: Number,
    name: String | undefined,
    password: String | undefined,
    re_password: String | undefined,
    register_date: Date | undefined,
    gender: Number | undefined,
    birth_date: Date | undefined,
    type: Number | undefined,
    profile: profile | undefined,
};