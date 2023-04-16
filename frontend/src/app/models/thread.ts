export class thread {
    constructor(
    public name:String | undefined,
    public id:Number | undefined,
    public status:Number | undefined,
    public created_date:Date | undefined,
    public last_activity:Date | undefined,
) {};
}