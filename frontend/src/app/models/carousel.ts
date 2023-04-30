import { media } from "./media"
import { user_short } from "./user"

export interface carousel {
    user : user_short
    name: string,
    visibility: number,
    description: string,
    carousel_medialist: [{
        item_number: number,
        item_description: string,
        media: media
    }]
}