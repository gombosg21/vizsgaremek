import { Injectable } from '@angular/core';
import { enviroment } from 'src/enviroments/enviroment';
import { ApiPaths } from '../../enums/api-paths';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { reaction } from 'src/app/models/reaction';

@Injectable({
  providedIn: 'root'
})
export class ReactionService {

  private controllerUrl: string = enviroment.baseUrl;

  constructor(private http: HttpClient) {

  }

  getAllReactions():Observable<reaction[]> {
    return this.http.get<reaction[]>(this.controllerUrl + ApiPaths.Reaction);
  };

  addReactionInstance(reactionID: number, targetID: number, TargetType: string): Observable<any> {
    return this.http.post(this.controllerUrl + TargetType + "/" + targetID + "/" + ApiPaths.Reaction, { ID: reactionID });
  };

  removeReactionInstance(reactionID: number, targetID: number, TargetType: string): Observable<any> {
    return this.http.post(this.controllerUrl + TargetType + "/" + targetID + "/" + ApiPaths.Reaction, { ID: reactionID });
  };
};
