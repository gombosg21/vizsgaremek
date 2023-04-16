import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(public Router: Router, public AuthService: AuthService) {

  }
  CanActivate(): boolean {
    if (!this.AuthService.activeToken()) {
      this.Router.navigate(['login']);
      return false;
    };
    return true;
  };
};
