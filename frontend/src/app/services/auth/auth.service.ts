import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { enviroment } from 'src/enviroments/enviroment';
import { ApiPaths } from '../../enums/api-paths';
import { Router } from '@angular/router';
import { getTokenUserID } from '../../helpers/extractors/token';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  constructor(private http: HttpClient, private router: Router,) {
    this.routerSub = this.router.events.subscribe({
      next: (value) => {
        this.userID = of(getTokenUserID());
        if (getTokenUserID()) {
          this.session = of(true);
        } else {
          this.session = of(false);
        };
      },
      error: (err) => {
        console.error(err)
      }
    });
  };

  private routerSub: Subscription;
  private userID: Observable<number | undefined>;
  private session: Observable<boolean>;
  public isDarkMode: boolean = JSON.parse(localStorage.getItem('isDarkMode') || 'false');

  getIsDarkMode(): boolean {
    return this.isDarkMode;
  }

  ngOnDestroy(): void {
    this.routerSub.unsubscribe();
  };

  getUserID(): Observable<number | undefined> {
    return this.userID;
  };

  getSessionStatus(): Observable<boolean> {
    return this.session;
  };

  login(username: string, password: string): void {
    this.http.post<any>(enviroment.baseUrl + ApiPaths.User + "/login", { name: username, password: password })
      .subscribe({
        next(data) {
          sessionStorage.setItem("token", data.token.split(":")[1]);
        },
        error(err) {
          console.log(err);
          throw new Error(err);
        },
        complete: () => {
          this.session = of(true);
          this.userID = of(getTokenUserID());
          this.router.navigate(["/profile/" + this.userID])
        }
      });
  };

  logout(): Observable<any> {
    const uriResult = this.http.delete<any>(enviroment.baseUrl + ApiPaths.User + "/logout")
    uriResult.subscribe(
      {
        next: (data) => {
          this.session = of(false);
          sessionStorage.removeItem("token");
        },
        error(err) {
          console.log(err);
          throw new Error(err);
        },
        complete: () => {
          this.router.navigate(["/login"]);
          this.userID = of(undefined);
        }
      });

    return uriResult;
  };
};