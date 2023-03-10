import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  username: string = '';
  email: string = '';
  password: string = '';
  passwordConfirm: string = '';
  selectedGender: string = '';
  usernameClass: string = '';
  emailClass: string = '';
  passwordClass: string = '';
  passwordConfirmClass: string = '';
  birthMonth: number = 0;
  birthDay: number = 0;
  birthYear: number = 0;
  birthMonthClass: string = '';
  birthDayClass: string = '';
  birthYearClass: string = '';
  birthDate: Date = new Date();
  
  
  
  constructor (private titleService: Title) {
    this.titleService.setTitle('VisualPosting - Regisztráció');
  }
  
  ngOnInit(): void {}
  


  
  
  validateUsername() {
    if (this.username.length >= 4 && this.username.length <= 15 && !/^[\W]/.test(this.username)) {
      this.usernameClass = 'is-valid';
    } else {
      this.usernameClass = 'is-invalid';
    }
  }
  
  validateEmail() {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRegex.test(this.email)) {
      this.emailClass = "is-valid";
    } else {
      this.emailClass = "is-invalid";
    }
  }

  validatePassword() {
    if (this.password.length >= 6) {
        this.passwordClass = 'is-valid';
    } else {
        this.passwordClass = 'is-invalid';
    }
}
validatePasswordConfirm() {
  if (this.password === this.passwordConfirm) {
      this.passwordConfirmClass = 'is-valid';
  } else {
      this.passwordConfirmClass = 'is-invalid';
  }
}

isFormValid() {
  return this.usernameClass === 'is-valid' && this.emailClass === 'is-valid' && this.passwordClass === 'is-valid' && this.passwordConfirmClass === 'is-valid';

}

register() {
  if (this.isFormValid()) {
      console.log('Form is valid');
      console.log(this.username, this.email, this.password, this.selectedGender, this.birthDate);
  } else {
      console.log('Form is invalid');
  }
}
  

  
  
  }

