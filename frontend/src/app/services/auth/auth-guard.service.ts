import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { isTokenExpired } from 'src/app/helpers/extractors/token';
import { activeToken, destroyToken } from 'src/app/helpers/extractors/token';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(public Router: Router, public AuthService: AuthService) {
  }

  canActivate(route? :ActivatedRouteSnapshot, state?: RouterStateSnapshot): boolean | Promise<boolean> {
    if (!(activeToken())) {
      this.Router.navigate(['/login']);
      console.log("false, no token")
      return false;
    } else {
      if (isTokenExpired()) {
        destroyToken();
        this.Router.navigate(['/login']);
        console.log("false, expired")
        return false
      } else {
        console.log("true, valid")
        return true;
      };
    };
  };
};
