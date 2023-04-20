export interface media {
    ID?:number,
    data:string,
    created:Date,
    last_edit:Date,
    visibility:number,
    descriptin:string,
    placeholder:string,
    tags?:any[],
    reactions?: any[]
};