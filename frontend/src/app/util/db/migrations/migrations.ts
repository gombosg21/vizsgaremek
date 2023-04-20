import { NgxIndexedDBModule, DBConfig } from "ngx-indexed-db";

export function migrationFactory() {

    return {
        1: (db:any,transaction:any) => {
            const store = transaction.objectStore('tags')
        }
    }

}