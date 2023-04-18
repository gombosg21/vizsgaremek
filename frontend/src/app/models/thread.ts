import { comment } from "./comment";
import { reaction } from "./reaction";

export interface thread {
    name: string,
    ID: number,
    status: number,
    created: Date,
    last_activity: Date,
    thread_reactionlist: reaction[],
    comments: comment[],
}