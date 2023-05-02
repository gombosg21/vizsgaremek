import { comment } from "./comment";
import { reaction_short } from "./reaction";
import { user_short } from "./user";

export interface thread {
    name: string,
    ID: number,
    status: number,
    created: Date,
    last_activity: Date,
    reactions?: reaction_short[],
    comments: comment[],
    user: user_short
};

export interface thread_short {
    ID: number,
    created: Date,
    last_activity: Date,
    name: string,
    status: number
    user: user_short
};