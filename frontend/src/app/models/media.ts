import { tag } from "./tag"
import { reaction_short } from "./reaction"

export interface media {
    ID?:number,
    data:string,
    created:Date,
    last_edit:Date,
    visibility:number,
    description:string,
    placeholder:string,
    tags?:tag[],
    reactions?: reaction_short[]
};