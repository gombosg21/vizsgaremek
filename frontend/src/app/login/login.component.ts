import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string;
  password: string;
  errorMessage: string;

  constructor(
    private titleService: Title,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private cookieService: CookieService 
  ) {
    this.titleService.setTitle('VisualPosting - Login');
  }
  
  login() {
    const user = new User(this.username, this.password);
    this.authService.loginUser(user).subscribe(
      (response) => {
        console.log('Login successful:', response);
        sessionStorage.setItem('user', JSON.stringify(response));
        sessionStorage.setItem('token', response.token);

        console.log('Token:', response.token);
        
        this.cookieService.set('VSCookie', response.token, { expires: 30, path: '/', sameSite: 'Lax' });
  
        console.log('Response object:', response);
  
        this.router.navigate([`/profile/${response.ID}`]);
  
        this.http.get('/api/v/0.1/user', { observe: 'response' }).subscribe((response) => {
          const vsCookie = response.headers.get('set-cookie');
          console.log('VSCookie:', vsCookie);
        });
      },
      (error) => {
        console.error('Login failed:', error);
        this.errorMessage = 'Login failed: Invalid username or password';
        this.password = '';
      }
    );
  }

  isFormValid() {
    return this.username && this.password;
  }
}
