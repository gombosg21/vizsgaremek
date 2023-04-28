export interface reaction {
    ID: number,
    name: string,
    data: string,
};

export interface reaction_short {
    ID: number,
    count: number,
};

export interface reaction_local {
    ID: number,
    name: string,
    data: Blob,
};