import { tag } from "./tag"
import { reaction_short } from "./reaction"

export interface media {
    ID?: number,
    file_data: string,
    uploaded: Date,
    last_edit: Date,
    visibility: number,
    description: string,
    placeholder_text: string,
    tags?: tag[],
    reactions?: reaction_short[]
};

export interface upload {
    image?: any,
    description?: string,
    placeholder_text?: string,
    visibility?: string,
    tag_id_array?: number[]
};