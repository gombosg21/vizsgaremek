import { comment } from "./comment";

export interface thread {
    name: string,
    ID: number,
    status: number,
    created: Date,
    last_activity: Date,
    thread_reactionlist: number[],
    comments: comment[],
}