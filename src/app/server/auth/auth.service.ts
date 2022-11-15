import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../../environments/environment.prod";
import { API_VERSIONS, APIVersion } from "../types/settings";
import { Router } from "@angular/router";

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
    const res = await req.subscribe();
    if ('pong' in res) {
      return true;
    } else {
      return false;
    }
  }

  public login() {
    this._isLoggedIn = true;
  }
}
