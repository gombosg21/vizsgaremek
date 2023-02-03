import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string;
  password: string;

  constructor() { }

  login() {
    console.log(this.username, this.password);
    

  }
  isFormValid() {
    return this.username && this.password;
  }
}
