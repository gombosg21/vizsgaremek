import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, of } from 'rxjs';
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
        if (getTokenUserID()) {
          this.userID.next(getTokenUserID());
          this.session.next(true);
        } else {
          this.session.next(false);
        };
      },
      error: (err) => {
        console.error(err)
      }
    });
  };

  private routerSub: Subscription;
  private userID: BehaviorSubject<undefined | number> = new BehaviorSubject<undefined | number>(undefined);
  private session: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isDarkMode: boolean = JSON.parse(localStorage.getItem('isDarkMode') || 'false');

  public get getIsDarkMode(): boolean {
    return this.isDarkMode;
  }

  ngOnDestroy(): void {
    this.routerSub.unsubscribe();
  };

  public get getUserID(): Observable<number | undefined> {
    return this.userID;
  };

  public get getSessionStatus(): Observable<boolean> {
    return this.session;
  };

  public login(username: string, password: string): void {
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
          this.session.next(true);
          this.userID.next(getTokenUserID());
          this.router.navigate(["/profile/" + this.userID]);
        }
      });
  };

  public logout(): Observable<any> {
    const uriResult = this.http.delete<any>(enviroment.baseUrl + ApiPaths.User + "/logout")
    uriResult.subscribe(
      {
        next: (data) => {
          this.session.next(false);
          sessionStorage.removeItem("token");
        },
        error(err) {
          console.log(err);
          throw new Error(err);
        },
        complete: () => {
          this.router.navigate(["/login"]);
          this.userID.next(undefined);
        }
      });

    return uriResult;
  };
};