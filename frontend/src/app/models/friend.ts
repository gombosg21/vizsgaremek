import { user_short } from "./user";

export interface verified_friend {
    user_ID: user_short,
    friend_ID: user_short
}

export interface pending_friend {
    friend_ID: user_short,
    pending: boolean
}