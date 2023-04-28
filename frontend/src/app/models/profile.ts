import { thread } from "./thread";
import { reaction_short } from "./reaction";

export interface profile {
    alias: string,
    birth_date: Date,
    description: string,
    visibility: string,
    picture_ID: number,
    medium: string,
    profile_reactionlists: reaction_short[],
    thread: thread,
};