import { Injectable } from '@angular/core';
import { enviroment } from 'src/enviroments/enviroment';
import { ApiPaths } from '../../enums/api-paths';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getProfile(ID: Number): Observable<any> {
    const targetURL = enviroment.baseUrl + ApiPaths.User + "/" + String(ID);

    return this.http.get<any>(targetURL);
  };

  updateProfile(ID: Number, Data: any): Observable<any> {
    const targetURL = enviroment.baseUrl + ApiPaths.User + "/" + String(ID);

    return this.http.patch(targetURL, Data);
  };

  requestResetPassword(Name: string): Observable<any> {
    const targetURL = enviroment.baseUrl + ApiPaths.User + "/reset-password";

    return this.http.post(targetURL, { name: Name });
  };
};
