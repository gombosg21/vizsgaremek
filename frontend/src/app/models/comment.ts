import { reaction } from "./reaction"

export interface comment {
    ID: number,
    created: Date,
    last_edit: Date
    comment_reactionlists: reaction[],
}