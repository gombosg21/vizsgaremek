import { media } from "./media"
import { user_short } from "./user"
import { reaction_short } from "./reaction"
import { thread_short } from "./thread"

export interface carousel {
    ID: number,
    user?: user_short,
    created_date:Date,
    modified_date:Date,
    name: string,
    visibility: number,
    description: string,
    reactions?: reaction_short[],
    carousel_medialist: [{
        item_number: number,
        item_description: string,
        media: media
    }],
    threads?: thread_short[]
}