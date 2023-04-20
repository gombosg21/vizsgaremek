import { NgxIndexedDBService, NgxIndexedDBModule, DBConfig } from "ngx-indexed-db";
import { Injectable, NgModule } from '@angular/core';


const dbConfig: DBConfig = {
    name: "VisualIndexDB",
    version: 1.0,
    objectStoresMeta: [
        {
            store: "reactions",
            storeConfig: {
                keyPath: 'id',
                autoIncrement: true,
            },
            storeSchema: [
                {
                    name: "name", keypath: "name", options: { unique: true }
                },
                {
                    name: "data", keypath: "data", options: { unique: true }
                }
            ]

        }, {
            store: "tags",
            storeConfig: {
                keyPath: 'id',
                autoIncrement: true,
            }
            ,
            storeSchema: [
                {
                    name: "name", keypath: "name", options: { unique: true }
                },
                {
                    name: "count", keypath: "count", options: { unique: false }
                }
            ]
        }
    ]
}

