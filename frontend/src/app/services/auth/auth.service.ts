import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroment } from 'src/enviroments/enviroment';
import { ApiPaths } from '../../enums/api-paths';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {
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
    });
    return uriResult;
  };

  logout(): void {
    this.http.delete<void>(enviroment.baseUrl + ApiPaths.User + "/logout").subscribe(() => {
      sessionStorage.removeItem("token");
    });
  };

  getToken(): string | null {
    const token = sessionStorage.getItem("token");
    return token;
  };

  activeToken(): Boolean {
    const token = sessionStorage.getItem("token");

    if (!token) {
      return false;
    };
    return true;
  };
};