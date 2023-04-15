import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ApiPaths } from '../enums/api-paths';
import { enviroment } from 'src/enviroments/enviroment';

import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

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
  ) {
    this.titleService.setTitle('VisualPosting - Login');
    ;
  }


  isFormValid() {
    return this.username && this.password;
  };

  login() {
    this.authService.login(this.username, this.password);
  };
};
