import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, throwError } from 'rxjs'
import { ApiPaths } from 'src/app/enums/api-paths';
import { enviroment } from 'src/enviroments/enviroment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class FriendsService implements OnDestroy, OnInit {

  private BaseUrl: string = enviroment.baseUrl + ApiPaths.Friends;
  private userSub: Subscription;
  private sessionID?: number;

  constructor(private http: HttpClient, private Auth: AuthService) {
  };

  ngOnInit(): void {
    this.userSub = this.Auth.getUserID().subscribe({
      next: (value) => { this.sessionID = value },
      error: (error) => { console.error(error) },
      complete: () => { }
    });
  };

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  };

  getFriendList(userID?: number): Observable<any> {
    if (this.sessionID || userID) {
      const ID = userID ?? this.sessionID;
      return this.http.get(this.BaseUrl + "/" + ID);
    };
    return throwError(() => { new Error("called w/o userID or valid sessionID!!!") });
  };

  getPendingList(): Observable<any> {
    return this.http.get(this.BaseUrl + "/pending");
  };

  postRequestFriend(targetUserID: number): Observable<any> {
    return this.http.post(this.BaseUrl + "/" + targetUserID + "/add", "");
  };

  postVerifyRequest(targetUserID: number): Observable<any> {
    return this.http.post(this.BaseUrl + "/" + targetUserID + "/confirm", "");
  };

  deleteRejectFriendRequest(targetUserID: number): Observable<any> {
    return this.http.delete(this.BaseUrl + "/" + targetUserID + "/confirm");
  };

  deleteUnfriend(targetUserID: number): Observable<any> {
    return this.http.delete(this.BaseUrl + "/" + targetUserID);
  };

};
