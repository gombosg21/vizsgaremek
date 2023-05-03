import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable, firstValueFrom } from 'rxjs'
import { reaction } from 'src/app/models/reaction';
import { TagsService } from '../tags/tags.service';
import { ReactionService } from '../reaction/reaction.service';
import { Buffer } from 'buffer'
import { tag } from 'src/app/models/tag';


@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(private dbService: NgxIndexedDBService, private TagsService: TagsService, private ReactionsService: ReactionService) {
  }

  flushReactions(): Observable<any> {
    return this.dbService.bulkDelete("reactions", []);
  };

  getCacheReactions(IDs: number[]): Observable<reaction[]> {
    return this.dbService.bulkGet("reactions", IDs);
  };

  getAllCahceReactions(): Observable<reaction[]> {
    return this.dbService.getAll("reactions");
  };

  getAllCacheTags(): Observable<tag[]> {
    return this.dbService.getAll("tags");
  };

  async fillReactions(): Promise<Observable<number[]>> {
    const dataSource = this.ReactionsService.getAllReactions()
    const data = await firstValueFrom(dataSource);
    const mappedInput = data.map(img => (
      {
        ID: img.ID,
        data: img.data,
        name: img.name
      }));
    return this.dbService.bulkAdd("reactions", mappedInput);
  };

  flushTags(): Observable<any> {
    return this.dbService.bulkDelete("tags", []);
  };

  async fillTags(): Promise<Observable<number[]>> {
    const dataSource = this.TagsService.getAllTags();
    const data = await firstValueFrom(dataSource);
    return this.dbService.bulkAdd("tags", data);
  };
}
