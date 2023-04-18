import { reaction } from "./reaction";
import { thread } from "./thread";

export interface profile {
    alias: string,
    birth_date: Date,
    description: string,
    visibility: string,
    picture_ID: number,
    medium: string,
    profile_reactionlists: reaction[],
    thread: thread,
};