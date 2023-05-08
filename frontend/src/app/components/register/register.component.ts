import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RegisterService } from '../../services/register/register.service';
import { Register } from '../../models/register';
import { AuthService } from '../../services/auth/auth.service';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  isDarkMode: boolean;

  public registerFromGroup = new FormGroup({
    nameFormControl: new FormControl<string>('', Validators.compose([Validators.required, Validators.minLength(8),
    Validators.maxLength(32), RegisterComponent.userNameCharsetValidator])),
    emailFormControl: new FormControl<string>('', Validators.compose([Validators.required, Validators.email])),
    passwordFormControl: new FormControl<string>('', Validators.compose([Validators.required, Validators.minLength(8),
    Validators.maxLength(32), RegisterComponent.passwordCharsetValidator, RegisterComponent.passwordMatchValidator])),
    passwordConfirmFormControl: new FormControl<string>('', Validators.compose([Validators.required, Validators.minLength(8),
    Validators.maxLength(32), RegisterComponent.passwordCharsetValidator, RegisterComponent.passwordMatchValidator])),
    genderFormControl: new FormControl<string>('', Validators.compose([Validators.required])),
    birthDateControl: new FormControl<Date>(new Date(), Validators.compose([Validators.required, RegisterComponent.futureBirthValidator])),
  });

  constructor(
    private titleService: Title,
    private registerService: RegisterService,
    private router: Router,
    private authService: AuthService
  ) {
    this.titleService.setTitle('VisualPosting - Register');
    this.isDarkMode = this.authService.getIsDarkMode;
  };

  ngOnInit(): void { };

  static userNameCharsetValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    let name = control.value
    return /^[\W]/.test(name) ? { badCharacters: true } : null;
  };

  static passwordCharsetValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    let password = control.value;
    let errors: any = {};
    let invalid: boolean = false;
    if ((/^[\x00-\x7F]*$/.test(password?.value)) == false) {
      invalid = true;
      errors.notAscii = true;
    };
    if ((/[A-Z]/.test(password)) == false) {
      invalid = true;
      errors.missingUpperCase = true;
    };
    if ((/[a-z]/.test(password)) == false) {
      invalid = true;
      errors.missingLowerCase = true;
    };
    if ((/\d/.test(password)) == false) {
      invalid = true;
      errors.missingNumber = true;
    };
    if ((/[!@#$%^&*(),.?":{}|<>]/.test(password)) == false) {
      invalid = true;
      errors.missingSpecialChars = true;
    }
    if (invalid) { return errors } else { return null };
  };

  static passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    let password = control.get('passwordFormControl');
    let repassword = control.get('passwordConfirmFormControl');
    return password?.value === repassword?.value ? null : { passwordMiscMatch: true }
  };

  static futureBirthValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    let birthdate = control.value;
    return new Date(birthdate) < new Date() ? null : { futureDate: true }
  };

  onSubmit() {
    console.log(this.registerFromGroup.controls)

    if (this.registerFromGroup.valid) {
      const registerData: Register = {
        name: this.registerFromGroup.value.nameFormControl!,
        email: this.registerFromGroup.value.emailFormControl!,
        password: this.registerFromGroup.value.passwordFormControl!,
        re_password: this.registerFromGroup.value.passwordConfirmFormControl!,
        gender: Number(this.registerFromGroup.value.genderFormControl!),
        birth_date: this.registerFromGroup.value.birthDateControl!,
      };
      this.registerService.registerUser(registerData).subscribe({
        next: (response) => {
          console.log('Registration suuccessful', response);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.log('Registration failed');
          console.error('Error details:', error.error);
        }
      });
      console.log(registerData)
    } else {
      console.log('Form is invalid');
    };
  };

  onThemeSwitchChange(event: any) {
    const theme = event.target.checked ? 'dark-theme' : 'light-theme';
    document.documentElement.setAttribute('data-theme', theme);
  };
};

