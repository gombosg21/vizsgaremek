import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroment } from 'src/enviroments/enviroment';
import { ApiPaths } from '../../enums/api-paths';
import { durationStringtoDate } from "src/app/helpers/converters/to_date";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public LiveSession: boolean = false;
  public token_expires: Date | undefined = undefined;

  constructor(private http: HttpClient) {
  };

  login(username: string, password: string) {
    this.LiveSession = false;
    this.token_expires = undefined;
    this.http.post<any>(enviroment.baseUrl + ApiPaths.User + "/login", { name: username, password: password }).subscribe((data: any) => {
      sessionStorage.setItem("token", data.token.split(":")[1]);
      this.LiveSession = true;
      this.token_expires = durationStringtoDate(data.token_expires);
    });
  };

  logout(): void {
    this.http.delete<void>(enviroment.baseUrl + ApiPaths.User + "/logout").subscribe(() => {
      this.LiveSession = false;
      this.token_expires = undefined;
      sessionStorage.removeItem("token");
    });
  };

  getToken(): string | null {
    const token = sessionStorage.getItem("token");
    return token;
  };
};