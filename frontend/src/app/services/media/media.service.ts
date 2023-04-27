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


  getAllMediaFromUserID(ID: number): Observable<media[]> {
    return this.http.get<media[]>(this.ApiPath + "/user/" + ID);
  };

  getOneFromUserID(ID: number): Observable<media> {
    return this.http.get<media>(this.ApiPath + "/" + ID);
  };

  uploadMedia(data: any): Observable<any> {
    return this.http.post<any>(this.ApiPath, data);
  };
}
