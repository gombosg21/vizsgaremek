import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { carousel } from 'src/app/models/carousel';
import { Observable, Subscription, of, throwError } from 'rxjs';
import { ApiPaths } from 'src/app/enums/api-paths';
import { enviroment } from 'src/enviroments/enviroment';
import { AuthService } from '../auth/auth.service';
import { ErrorModel } from 'src/app/models/error';

@Injectable({
  providedIn: 'root'
})
export class StoryService implements OnInit, OnDestroy {

  constructor(private http: HttpClient, private Auth: AuthService) { }

  private ApiPath = enviroment.baseUrl + ApiPaths.Story;
  private userSub: Subscription;
  private sessionID?: number;
  private caruselInstance: Observable<ErrorModel | carousel>;
  private caruselList: Observable<(ErrorModel | carousel)[]>;

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  };

  ngOnInit(): void {
    this.userSub = this.Auth.getUserID.subscribe({
      next: (value) => { this.sessionID = value },
      error: (error) => { console.error(error) },
      complete: () => { }
    });
  };


  getStoryByID(ID: number): Observable<any> {
    return this.http.get(this.ApiPath + "/" + ID);
  };

  getAllStoriesFromUserID(userID: number): Observable<any> {
    if (this.sessionID || userID) {
      const ID = userID ?? this.sessionID;
      return this.http.get(this.ApiPath + "/" + ApiPaths.User + "/" + ID + "/all");
    }
    return throwError(() => { new Error("called w/o userID or valid sessionID!") });
  };

  postStory(story: carousel): Observable<any> {
    return this.http.post(this.ApiPath, story);
  };

  public get getLocalStoryInstance(): Observable<ErrorModel | carousel> {
    return this.caruselInstance;
  };

  public set setLocalStoryInstance(story: carousel | ErrorModel) {
    this.caruselInstance = of(story);
  };

  public get getLocalStoryList(): Observable<(ErrorModel | carousel)[]> {
    return this.caruselList;
  };

  public set setLocalStoryList(storyList: (ErrorModel | carousel)[]) {
    this.caruselList = of(storyList);
  };

  getQuery(name?: string, user_id?: number, media_ids?: number[], description?: string, created_start?: Date, created_end?: Date, edit_start?: Date, edit_end?: Date): Observable<(ErrorModel | carousel)[]> {
    var queryString = '?';
    if (name) { queryString += 'name=' + name + '&' };
    if (user_id) { queryString += 'user_id=' + user_id + '&' };
    if (media_ids) {
      media_ids.forEach(ID => {
        queryString += 'media_ids=' + ID + '&'
      });
    };
    if (description) { queryString += 'description=' + description + '&' }
    if (created_start) { queryString += 'created_start=' + created_start + '&' }
    if (created_end) { queryString += 'created_end=' + created_end + '&' }
    if (edit_start) { queryString += 'edit_start=' + edit_start + '&' }
    if (edit_end) { queryString += 'edit_end=' + edit_end + '&' }
    if (queryString = '?') {
      throwError(() => { new Error('no query params where supplied!') });
    };
    const query = queryString.slice(0,-1);

    return this.http.get<(ErrorModel | carousel)[]>(this.ApiPath + query);
  };
};
