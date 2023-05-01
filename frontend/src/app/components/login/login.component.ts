import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../services/auth/auth.service';

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
    private authService: AuthService,
  ) {
    this.titleService.setTitle('VisualPosting - Login');

  };


  isFormValid() {
    return this.username && this.password;
  };

  login() {
    this.authService.login(this.username, this.password);
  };
};
