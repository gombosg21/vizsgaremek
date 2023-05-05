import { user_short } from "./user";

export interface pending_friend extends user_short {
    pending: boolean,
    date: Date
};

export interface verified_friend extends user_short {
    date :Date
};