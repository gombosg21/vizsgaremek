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

  private controllerUrl: string = enviroment.baseUrl + ApiPaths.Reaction;

  constructor(private http: HttpClient) { }

  getAllreactions():Observable<reaction[]> {
    const targetUrl = this.controllerUrl;

    return this.http.get<reaction[]>(targetUrl);
  };
}
