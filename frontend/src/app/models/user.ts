import { profile } from "./profile";

export interface user {
    ID: Number,
    name: String,
    password: String,
    re_password: String,
    register_date: Date,
    gender: Number,
    birth_date: Date,
    type: Number,
    profile: profile,
};