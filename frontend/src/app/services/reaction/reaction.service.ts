import { Injectable } from '@angular/core';
import { enviroment } from 'src/enviroments/enviroment';
import { ApiPaths } from '../../enums/api-paths';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { reaction, reaction_short } from 'src/app/models/reaction';

@Injectable({
  providedIn: 'root'
})
export class ReactionService {

  private controllerUrl: string = enviroment.baseUrl;

  private reactionInstances: Observable<reaction_short[]>;

  constructor(private http: HttpClient) {};

  public get getStoredInstanceList(): Observable<reaction_short[]> {
    return this.reactionInstances;
  };

  public set setStoredInstanceList(instanceList: reaction_short[]) {
    this.reactionInstances = of(instanceList);
  };

  getAllReactions(): Observable<reaction[]> {
    return this.http.get<reaction[]>(this.controllerUrl + ApiPaths.Reaction);
  };

  addReactionInstance(reactionIDs: number[], targetID: number, TargetType: string): Observable<any> {
    return this.http.post(this.controllerUrl + TargetType + "/" + targetID + "/" + ApiPaths.Reaction, { reactions: reactionIDs });
  };

  removeReactionInstance(reactionID: number, targetID: number, TargetType: string): Observable<any> {
    return this.http.post(this.controllerUrl + TargetType + "/" + targetID + "/" + ApiPaths.Reaction, { ID: reactionID });
  };
};
