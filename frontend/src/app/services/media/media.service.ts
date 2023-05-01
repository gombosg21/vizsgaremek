import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroment } from 'src/enviroments/enviroment';
import { ApiPaths } from '../../enums/api-paths';
import { Observable } from 'rxjs';
import { media } from 'src/app/models/media';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  private ApiPath = enviroment.baseUrl + ApiPaths.Media;

  private localMediaList:media[];
  private localMedia:media;

  constructor(private http: HttpClient) {

  }

  getLocalMediaList():media[] {
    return this.localMediaList;
  };

  setLocalMediaList(mediaList:media[]):void {
    this.localMediaList = mediaList;
  };

  setLocalMediaInstance(mediaInstance:media):void {
    this.localMedia = mediaInstance;
  };

  getLocalMediaInstance():media {
    return this.localMedia;
  };

  getAllMediaFromUserID(ID: number): Observable<media[]> {
    return this.http.get<media[]>(this.ApiPath + "/user/" + ID);
  };

  getOneFromUserID(ID: number): Observable<media> {
    return this.http.get<media>(this.ApiPath + "/" + ID);
  };

  postMedia(data: FormData): Observable<any> {
    return this.http.post<any>(this.ApiPath, data);
  };

  getQueryMedia(tagids:number[]):Observable<media[]>{
    var query = "";

    for (let i = 0; i < tagids.length; i++) {
      if(i == 0) {
        query += "tagids=" + tagids[i];
      } else {
        query += "&tagids=" + tagids[i];
      };
    };

    return this.http.get<media[]>(this.ApiPath + "/search/tags?" + query);
  };
};
