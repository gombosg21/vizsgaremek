import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription, throwError, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ApiPaths } from 'src/app/enums/api-paths';
import { enviroment } from 'src/enviroments/enviroment';
import { followed } from 'src/app/models/folowed';

@Injectable({
  providedIn: 'root'
})
export class FollowedService implements OnInit, OnDestroy {

  private apiPath: string = enviroment.baseUrl + ApiPaths.Follow;

  private userSub: Subscription;
  private sessionId?: number;

  private subList: Observable<followed[]>;

  constructor(private http: HttpClient, private Auth: AuthService) { };

  get getLocalSubsList(): Observable<any> {
    return this.subList;
  };

  set setLocalSubsList(sublist: followed[]) {
    this.subList = of(sublist);
  };

  postSub(targetUserID: number): Observable<any> {
    return this.http.post(this.apiPath + "/" + targetUserID, "");
  };

  deleteUnsub(targetUserID: number): Observable<any> {
    return this.http.delete(this.apiPath + "/" + targetUserID);
  };

  getSubs(): Observable<followed[]> {
    if (this.sessionId) {
      return this.http.get<followed[]>(this.apiPath);
    } else {
      return throwError(() => { new Error("was called w/o a valid session!") });
    };
  };

  getSubCount(userID?: number): Observable<number> {
    if (this.sessionId || userID) {
      const ID = userID ?? this.sessionId;
      return this.http.get<number>(this.apiPath + "/count/" + ID);
    } else {
      return throwError(() => { new Error("was called w/o a valid session or a userID!") });
    };
  };

  ngOnInit(): void {
    this.userSub = this.Auth.getUserID.subscribe({
      error: (err) => { console.error(err) },
      next: (val) => {
        this.sessionId = val;
      },
      complete: () => { }
    });
  };

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    };
  };
};
