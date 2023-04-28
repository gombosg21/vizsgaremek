import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable, firstValueFrom } from 'rxjs'
import { reaction_local } from 'src/app/models/reaction';
import { TagsService } from '../tags/tags.service';
import { ReactionService } from '../reaction/reaction.service';


@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(private dbService: NgxIndexedDBService, private TagsService: TagsService, private ReactionsService: ReactionService) {
  }

  flushReactions(): Observable<any> {
    return this.dbService.bulkDelete("reactions", []);
  };

  getCacheReactions(IDs: number[]): Observable<reaction_local[]> {
    return this.dbService.bulkGet("reactions", IDs);
  };

  getAllCahceReactions(): Observable<reaction_local[]> {
    return this.dbService.getAll("reactions");
  };

  async fillReactions(): Promise<Observable<number[]>> {
    const dataSource = this.ReactionsService.getAllReactions()
    const rawData = await firstValueFrom(dataSource);
    const data:reaction_local[] = rawData.map((reaction) => ({ ID: reaction.ID, name: reaction.name, data: new Blob([atob(reaction.data)])}))
    console.log(data)
    return this.dbService.bulkAdd("reactions", data);
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
