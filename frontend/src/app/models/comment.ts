import { reaction_short } from "./reaction"
import { user_short } from "./user"

export interface comment {
    ID: number,
    created: Date,
    last_edit: Date
    content: string,
    reactions?: reaction_short[],
    user: user_short;
}