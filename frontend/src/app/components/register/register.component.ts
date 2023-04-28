import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RegisterService } from '../../services/register/register.service';
import { Register } from '../../models/register';

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
  birth_date: string = '';
  birthDateClass: string = '';


  constructor(
    private titleService: Title,
    private registerService: RegisterService,
    private router: Router
  ) {
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
    const asciiRegex = /^[\x00-\x7F]*$/;
    const hasUppercase = /[A-Z]/.test(this.password);
    const hasLowercase = /[a-z]/.test(this.password);
    const hasNumber = /\d/.test(this.password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(this.password);
  
    if (
      this.password.length >= 8 &&
      this.password.length <= 32 &&
      asciiRegex.test(this.password) &&
      hasUppercase &&
      hasLowercase &&
      hasNumber &&
      hasSpecialChar
    ) {
      this.passwordClass = 'is-valid';
    } else {
      this.passwordClass = 'is-invalid';
    }
  }
  
  
  validatePasswordConfirm() {
    if (this.password === this.passwordConfirm && this.passwordClass === 'is-valid') {
      this.passwordConfirmClass = 'is-valid';
    } else {
      this.passwordConfirmClass = 'is-invalid';
    }
  }
  
  validateBirthDate() {
    if (!this.birth_date) {
      this.birthDateClass = 'is-invalid';
      return false;
    }

    const currentDate = new Date();
    const birthDateObj = new Date(this.birth_date);
    const isValid = birthDateObj <= currentDate;

    this.birthDateClass = isValid ? 'is-valid' : 'is-invalid';
    return isValid;}
  
    isFormValid() {
      return (
        this.usernameClass === 'is-valid' &&
        this.emailClass === 'is-valid' &&
        this.passwordClass === 'is-valid' &&
        this.passwordConfirmClass === 'is-valid' &&
        this.birthDateClass === 'is-valid'
      );
    }   

  register() {
    console.log('Register inputs:', {
      username: this.username,
      email: this.email,
      password: this.password,
      passwordConfirm: this.passwordConfirm,
      selectedGender: this.selectedGender,
      birth_date: this.birth_date
    });
    
    if (this.isFormValid()) {
      const genderValue = this.selectedGender === 'male' ? 0 : this.selectedGender === 'female' ? 1 : 2;
      const birthDateObject = new Date(this.birth_date);
      
      if (birthDateObject >= new Date()) {
        console.log('Error: Birth date cannot be in the future');
        return;
      }
      const formatted_birth_date = `${birthDateObject.getFullYear()}-${(birthDateObject.getMonth() + 1).toString().padStart(2, '0')}-${birthDateObject.getDate().toString().padStart(2, '0')}`;

      console.log('Formatted birth date:', formatted_birth_date);
      const registerData = new Register(this.username, this.email, this.password, this.passwordConfirm, genderValue, formatted_birth_date);
      
      this.registerService.registerUser(registerData).subscribe(
        (response) => {
          console.log('Registration suuccessful', response);
          this.router.navigate(['/login']);
        },
        (error) => {
          console.log('Registration failed');
          console.error('Error details:', error.error);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}

