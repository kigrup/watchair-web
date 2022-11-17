import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../../environments/environment.prod";
import { API_VERSIONS, APIVersion } from "../types/settings";
import { Router } from "@angular/router";
import { firstValueFrom, Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _isLoggedIn: boolean;
  public get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  private _instanceURL: string;
  public get instanceURL(): string {
    return this._instanceURL;
  }

  private _preferredAPI: APIVersion;
  public get preferredAPI(): APIVersion {
    return this._preferredAPI;
  }

  private _loginSubject: Subject<boolean> = new Subject<boolean>();
  public get loginSubject(): Subject<boolean> {
    return this._loginSubject;
  }

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this._isLoggedIn = false;
    this._instanceURL = environment.serverInstance;
    this._preferredAPI = API_VERSIONS[0];
  }

  public forceLogin() {
    if (!this._isLoggedIn) {
      this.router.navigate(['/login']);
    }
  }

  public async attemptLogin(username: string, password: string): Promise<boolean> {
    console.log(`Attempting login at ${this._instanceURL} with user "${username}" and password "${password}"`);
    const req = this.http.get<any>(`http://${this._instanceURL}/api/ping`);
    const res: any = await firstValueFrom(req)
    if (res.pong) {
      this.login();
      return true;
    } else {
      console.log('Login failed');
      return false;
    }
  }

  private login() {
    console.log('Logged in!');
    this._isLoggedIn = true;
    this._loginSubject.next(this._isLoggedIn);
    this.router.navigate(['/home'])
  }

  public logout() {
    console.log('Logged out!');
    this._isLoggedIn = false;
    this._loginSubject.next(this._isLoggedIn);
    this.router.navigate(['/login'])
  }
}
