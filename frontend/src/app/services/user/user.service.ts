import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { enviroment } from 'src/enviroments/enviroment';
import { ApiPaths } from '../../enums/api-paths';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription, throwError } from 'rxjs';
import { user } from '../../models/user';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit, OnDestroy {

  private controllerUrl: string = enviroment.baseUrl + ApiPaths.User;
  private userSub: Subscription;
  private sessionID?: number;

  constructor(private http: HttpClient, private Auth: AuthService) {
    this.userSub = this.Auth.getUserID().subscribe({
      next: (value) => { this.sessionID = value },
      error: (error) => { console.error(error) },
      complete: () => { }
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  };

  ngOnInit(): void {

  };

  getProfile(userID?: Number): Observable<user> {
    if (this.sessionID || userID) {
      const ID = userID ?? this.sessionID;
      return this.http.get<user>(this.controllerUrl + "/" + ID);
    };
    return throwError(() => { new Error("called w/o userID or a valid sessionID!") })
  };

  updateProfile(Data: { description: string, visibility: number, picture_ID: number, alias: string }): Observable<Object> {
    if (this.sessionID) {
      return this.http.patch<Object>(this.controllerUrl, Data);
    };
    return throwError(() => { new Error("called w/o a valid sessionID") })
  };

  requestResetPassword(Name: string): Observable<Object> {
    const targetURL = this.controllerUrl + "/reset-password";

    return this.http.post<Object>(targetURL, { name: Name });
  };

  deleteUser(): Observable<Object> {
    const targetURL = this.controllerUrl;

    // TODO tell auth that we're no longer good 

    return this.http.delete(targetURL);
  };

  updatePassword(password: String, re_password: string): Observable<Object> {
    const targetURL = this.controllerUrl + "/change-password";

    //TODO export validation OUTSIDE of service
    if (password != re_password) {
      throw new Error("password fields dont match");
    };

    return this.http.post<Object>(targetURL, { password: password, re_password: re_password });
  };
};