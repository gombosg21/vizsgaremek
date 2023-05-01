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
  isDarkMode: boolean;

  constructor(
    private titleService: Title,
    private authService: AuthService,
  ) {
    this.titleService.setTitle('VisualPosting - Login');
  this.isDarkMode = authService.getIsDarkMode();
  

  };


  isFormValid() {
    return this.username && this.password;
  };

  login() {
    this.authService.login(this.username, this.password);
  };
};
