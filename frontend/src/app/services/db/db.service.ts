import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(private dbService: NgxIndexedDBService) {

  }

  addItem(table: string, item: Object): Observable<any> {
    return this.dbService.add(table, item);
  };

  removeItem(table: string, keyData: any): Observable<any> {
    return this.dbService.delete(table, keyData)
  }

}
