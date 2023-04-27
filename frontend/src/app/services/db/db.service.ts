import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(private dbService: NgxIndexedDBService) {

  }

  flushReactions():Observable<any> {
    return this.dbService.bulkDelete("reactions",[]);
  }

  fillReactions() {

  }

  flushTags() {

  }

  fillTags() {

  }

}
