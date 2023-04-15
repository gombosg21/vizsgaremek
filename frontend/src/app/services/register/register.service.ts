import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Register } from '../../models/register.model';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiUrl = 'http://localhost:3600/api/v/0.1/user/register';

  constructor(private http: HttpClient) {}

  registerUser(registerData: Register): Observable<any> {
    return this.http.post<any>(this.apiUrl, registerData);
  }
}