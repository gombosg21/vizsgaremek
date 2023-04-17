import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroment } from 'src/enviroments/enviroment';
import { ApiPaths } from '../../enums/api-paths';
import { Router } from '@angular/router';
import { getTokenUserID } from '../../helpers/extractors/token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router,) {
  };

  login(username: string, password: string): Observable<any> {
    const uriResult = this.http.post<any>(enviroment.baseUrl + ApiPaths.User + "/login", { name: username, password: password });
    uriResult.subscribe({
      next(data) {
        sessionStorage.setItem("token", data.token.split(":")[1])
      },
      error(err) {
        console.log(err);
        throw new Error(err);
      },
      complete: () => {
        this.router.navigate(["/profile/" + getTokenUserID() ])}
    });
    return uriResult;
  };

  logout(): Observable<any> {
    const uriResult = this.http.delete<any>(enviroment.baseUrl + ApiPaths.User + "/logout")
    uriResult.subscribe(
      {
        next: (data) => {
          sessionStorage.removeItem("token")
        }
      });

    return uriResult;
  };

  getToken(): string | null {
    const token = sessionStorage.getItem("token");
    return token;
  };

  activeToken(): boolean {
    const token = sessionStorage.getItem("token");

    if (!token) {
      return false;
    };
    return true;
  };
};