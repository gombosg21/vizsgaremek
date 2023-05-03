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
export class StoryService implements OnInit , OnDestroy {

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
    this.userSub = this.Auth.getUserID().subscribe({
      next: (value) => { this.sessionID = value },
      error: (error) => { console.error(error) },
      complete: () => { }
    });
  };


  getStoryByID(ID: number): Observable<any> {
    return this.http.get(this.ApiPath + "/" + ID);
  };

  getAllStoriesFromUserID(userID: number): Observable<any> {
    if(this.sessionID || userID) {
      const ID = userID ?? this.sessionID;
          return this.http.get(this.ApiPath + "/" + ApiPaths.User + "/" + ID + "/all");
    }
    return throwError(() => {new Error("called w/o userID or valid sessionID!")});
  };

  postStory(story: carousel): Observable<any> {
    return this.http.post(this.ApiPath, story);
  };

  getLocalStoryInstance():Observable<ErrorModel | carousel> {
    return this.caruselInstance;
  };

  setLocalStoryInstance(story: carousel | ErrorModel) {
    this.caruselInstance = of(story);
  };

  getLocalStoryList(): Observable<(ErrorModel | carousel)[]> {
    return this.caruselList;
  };

  setLocalStoryList(storyList: (ErrorModel | carousel)[]) {
    this.caruselList = of(storyList);
  };
};
