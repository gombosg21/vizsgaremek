import { Injectable } from '@angular/core';
import { enviroment } from 'src/enviroments/enviroment';
import { ApiPaths } from '../../enums/api-paths';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { user } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private controllerUrl: string = enviroment.baseUrl + ApiPaths.User;

  constructor(private http: HttpClient) { }

  getProfile(ID: Number): Observable<user> {
    const targetURL = this.controllerUrl + "/" + String(ID);

    return this.http.get<user>(targetURL);
  };

  updateProfile(ID: Number, Data: { description: string, visibility: number, picture_ID: number, alias: string }): Observable<Object> {
    const targetURL = this.controllerUrl + "/" + String(ID);

    return this.http.patch<Object>(targetURL, Data);
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