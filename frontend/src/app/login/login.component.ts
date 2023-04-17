import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { getTokenUserID } from '../helpers/extractors/token';

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
  ) {
    this.titleService.setTitle('VisualPosting - Login');
    ;
  }


  isFormValid() {
    return this.username && this.password;
  };

  login() {
    this.authService.login(this.username, this.password).subscribe({
      error: (error) => { console.error({ error: error }) }
    });
  };

  logout() {
    this.authService.logout();
  }
};
