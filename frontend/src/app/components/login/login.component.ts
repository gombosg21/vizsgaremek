import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../services/auth/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public loginFormGroup = new FormGroup({
    userNameControl: new FormControl<string>('', Validators.compose([Validators.required])),
    passwordControl: new FormControl<string>('', Validators.compose([Validators.required]))
  });

  isDarkMode: boolean;

  constructor(
    private titleService: Title,
    private authService: AuthService,
  ) {
    this.titleService.setTitle('VisualPosting - Login');
    this.isDarkMode = authService.getIsDarkMode();
  };

  login() {
    if (this.loginFormGroup.valid) {
      this.authService.login(this.loginFormGroup.value.userNameControl!, this.loginFormGroup.value.passwordControl!);
    };
  };
};
