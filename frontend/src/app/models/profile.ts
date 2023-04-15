export class profile {
    constructor(
        public alias : string | undefined,
        public description : string | undefined,
        public gender : number  | undefined,
        public register_date : Date | undefined,
        public birth_date : Date | undefined,
        public avatar : string | undefined,
        public type : string | undefined
    ) {};
};