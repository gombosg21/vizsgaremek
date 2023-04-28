import { profile } from "./profile";
import { reaction_short } from "./reaction";

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
    profile_reactionlists : reaction_short[]
};

export interface user_short {
    ID:number,
    alias: string,
};