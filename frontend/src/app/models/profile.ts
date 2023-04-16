import { reaction } from "./reaction";
import { thread } from "./thread";

export interface profile {
    alias: String,
    description: String,
    visibility: String,
    picture_ID: Number,
    medium: String,
    profile_reactionlists: reaction[],
    thread: thread | undefined,
};