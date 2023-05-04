import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { enviroment } from 'src/enviroments/enviroment';
import { ApiPaths } from '../../enums/api-paths';
import { Observable, Subscription, of, throwError } from 'rxjs';
import { media } from 'src/app/models/media';
import { ErrorModel } from 'src/app/models/error';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MediaService implements OnInit, OnDestroy {

  private ApiPath = enviroment.baseUrl + ApiPaths.Media;

  private localMediaList: Observable<(media | ErrorModel)[]>;
  private localMedia: Observable<media>;
  private userSub: Subscription;
  private sessionID?: number;


  constructor(private http: HttpClient, private Auth: AuthService) {
    this.userSub = this.Auth.getUserID().subscribe({
      next: (value) => { this.sessionID = value },
      error: (error) => { console.error(error) },
      complete: () => { }
    });
  };

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  };

  ngOnInit(): void {

  };

  getLocalMediaList(): Observable<(media | ErrorModel)[]> {
    return this.localMediaList;
  };

  setLocalMediaList(mediaList: (media | ErrorModel)[]): void {
    this.localMediaList = of(mediaList);
  };

  setLocalMediaInstance(mediaInstance: media): void {
    this.localMedia = of(mediaInstance);
  };

  getLocalMediaInstance(): Observable<media> {
    return this.localMedia;
  };

  getAllMediaFromUserID(userID?: number): Observable<(media | ErrorModel)[]> {
    if (this.sessionID || userID) {
      const ID = userID ?? this.sessionID;
      return this.http.get<(media | ErrorModel)[]>(this.ApiPath + "/user/" + ID);
    } else {
      return throwError(() => { new Error("called w/o userID or valid sessionID!") });
    };
  };

  getOneByID(ID: number): Observable<media | ErrorModel> {
    return this.http.get<media | ErrorModel>(this.ApiPath + "/" + ID);
  };

  postMedia(data: FormData): Observable<any> {
    return this.http.post<any>(this.ApiPath, data);
  };

  getQueryMedia(tagids: number[]): Observable<(media | ErrorModel)[]> {
    var query = "";

    for (let i = 0; i < tagids.length; i++) {
      if (i == 0) {
        query += "tagids=" + tagids[i];
      } else {
        query += "&tagids=" + tagids[i];
      };
    };

    return this.http.get<media[]>(this.ApiPath + "/search/tags?" + query);
  };

  postUpdateMediaTags(ID: number, addTagIDArray?: number[], removeTagIDArray?: number[]): Observable<any> {
    const dataObj: any = {};

    if (addTagIDArray) {
      dataObj.tag_id_list_remove = removeTagIDArray;
    };

    if (removeTagIDArray) {
      dataObj.tag_id_list_add = addTagIDArray;
    };

    if (!addTagIDArray && !removeTagIDArray) {
      return throwError(() => { new Error("no changes supplied, aborting.") })
    };

    return this.http.post(this.ApiPath + "/" + ID + "/tags", dataObj);
  };
};
