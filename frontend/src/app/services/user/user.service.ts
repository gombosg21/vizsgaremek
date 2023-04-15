import { Injectable } from '@angular/core';
import { enviroment } from 'src/enviroments/enviroment';
import { ApiPaths } from '../../enums/api-paths';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private controllerUrl: string = enviroment.baseUrl + ApiPaths.User;

  constructor(private http: HttpClient) { }

  getProfile(ID: Number): Observable<any> {
    const targetURL = this.controllerUrl + "/" + String(ID);

    return this.http.get<any>(targetURL);
  };

  updateProfile(ID: Number, Data: any): Observable<any> {
    const targetURL = this.controllerUrl + "/" + String(ID);

    return this.http.patch(targetURL, Data);
  };

  requestResetPassword(Name: string): Observable<any> {
    const targetURL = this.controllerUrl + "/reset-password";

    return this.http.post(targetURL, { name: Name });
  };

  deleteUser(): Observable<any> {
    const targetURL = this.controllerUrl;

    // TODO tell auth that we're no longer good 

    return this.http.delete(targetURL);
  };

  updatePassword(password: String, re_password:string): Observable<any> {
    const targetURL = this.controllerUrl + "/change-password";

    //TODO export validation OUTSIDE of service
    if (password != re_password) {
      throw new Error("password fields dont match");
    };

    return this.http.post(targetURL, { password: password, re_password: re_password });
  };
};