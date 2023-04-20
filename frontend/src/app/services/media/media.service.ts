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

  constructor(private http: HttpClient) {

  }


  getAllMediaFromUserID(ID: number): Observable<any> {
    return this.http.get(this.ApiPath + "/all/" + ID);
  };

  getOneFromUserID(ID: number): Observable<media> {
    return this.http.get<media>(this.ApiPath + "/" + ID);
  };

  uploadMedia(data: media): Observable<media> {
    return this.http.post<media>(this.ApiPath, data);
  };
}
