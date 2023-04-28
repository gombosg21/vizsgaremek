import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Register } from '../../models/register';
import { enviroment } from 'src/enviroments/enviroment';
import { ApiPaths } from '../../enums/api-paths';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private targetURL = enviroment.baseUrl + ApiPaths.User + "/register";

  constructor(private http: HttpClient) {}

  registerUser(registerData: Register): Observable<any> {
    return this.http.post<any>(this.targetURL, registerData);
  };
};