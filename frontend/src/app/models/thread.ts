import { comment } from "./comment";
import { reaction } from "./reaction";

export interface thread {
    name: String,
    ID: Number,
    status: Number,
    created: Date,
    last_activity: Date,
    thread_reactionlist: reaction[],
    comments: comment[],
}