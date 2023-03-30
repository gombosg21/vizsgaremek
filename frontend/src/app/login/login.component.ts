import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';

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
    private authService: AuthService
  ) {
    this.titleService.setTitle('VisualPosting - Bejelentkezés');
  }

  login() {
    const user = new User(this.username, this.password);
    this.authService.loginUser(user).subscribe(
      (response) => {
        console.log('Login successful:', response); 
        // sessionStorage.setItem('user', JSON.stringify(response)); // TODO: store user in session storage
        // this.router.navigate([`/api/v/0.1/user/${response.id}`]); // TODO: redirect to profile page
      },
      (error) => {
        console.error('Login failed:', error);
        this.errorMessage = 'Login failed: Invalid username or password';
        this.password = ''; // Clear pw input
      }
    );
  }
  

  isFormValid() {
    return this.username && this.password;
  }
}
