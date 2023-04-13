import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user.model';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3600/api/v/0.1/user';

  constructor(private http: HttpClient) {}

  loginUser(user: User): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, user).pipe(
      catchError((error) => {
        //todo: handle error
        return throwError(error);
      })
    );
  }

  getUserProfile(userId: string): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`http://localhost:3600/api/v/0.1/user/${userId}`, { headers, withCredentials: true });
  }
}  