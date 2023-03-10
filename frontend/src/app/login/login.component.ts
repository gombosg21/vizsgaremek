import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string;
  password: string;


  loginData = {
    username: 'admin',
    password: 'admin'
  };

  constructor (private titleService: Title, private router: Router) {
    this.titleService.setTitle('VisualPosting - Bejelentkezés');
  }

  login() {
    console.log(this.username, this.password);

    if (this.username === this.loginData.username && this.password === this.loginData.password) {
      this.router.navigate(['/feed']);
    }
  }

  isFormValid() {
    return this.username && this.password;
  }
}
