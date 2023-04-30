import { Injectable } from '@angular/core';
import { enviroment } from 'src/enviroments/enviroment';
import { ApiPaths } from '../../enums/api-paths';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { reaction, reaction_short } from 'src/app/models/reaction';

@Injectable({
  providedIn: 'root'
})
export class ReactionService {

  private controllerUrl: string = enviroment.baseUrl;

  private reactionInstances: reaction_short[];

  constructor(private http: HttpClient) {

  }

  getStoredInstanceList(): reaction_short[] {
    return this.reactionInstances;
  };

  setStoredInstanceList(instanceList: reaction_short[]): void {
    this.reactionInstances = instanceList;
  };

  getAllReactions(): Observable<reaction[]> {
    return this.http.get<reaction[]>(this.controllerUrl + ApiPaths.Reaction);
  };

  addReactionInstance(reactionIDs:number[], targetID: number, TargetType: string): Observable<any> {
    return this.http.post(this.controllerUrl + TargetType + "/" + targetID + "/" + ApiPaths.Reaction, { reactions: reactionIDs });
  };

  removeReactionInstance(reactionID: number, targetID: number, TargetType: string): Observable<any> {
    return this.http.post(this.controllerUrl + TargetType + "/" + targetID + "/" + ApiPaths.Reaction, { ID: reactionID });
  };
};
