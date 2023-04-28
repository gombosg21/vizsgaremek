import { comment } from "./comment";
import { reaction_short } from "./reaction";

export interface thread {
    name: string,
    ID: number,
    status: number,
    created: Date,
    last_activity: Date,
    thread_reactionlist: reaction_short[],
    comments: comment[],
}