import { reaction } from "./reaction"

export interface comment {
    ID: number,
    created: Date,
    last_edit: Date
    content: string,
    comment_reactionlists: reaction[],
}