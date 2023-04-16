import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { isTokenExpired } from 'src/app/helpers/extractors/token';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(public Router: Router, public AuthService: AuthService) {

  }
  canActivate(): boolean {
    if (!this.AuthService.activeToken()) {
      this.Router.navigate(['login']);
      return false;
    } else {
      if (isTokenExpired()) {
        this.Router.navigate(['login']);
        return false
      } else {
        return true;
      }
    };
  };
};
