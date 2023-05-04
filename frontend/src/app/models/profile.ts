import { thread } from "./thread";
import { reaction_short } from "./reaction";

export interface profile {
    alias: string,
    birth_date: Date,
    description: string,
    visibility: number,
    picture_ID: number,
    medium?: { file_data: string },
    reactions?: reaction_short[],
    thread: thread,
};