import { Injectable } from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {firstValueFrom} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {

  }

  public async resetDatabase(): Promise<boolean> {
    if (!this.authService.isLoggedIn) {
      console.log(`databaseService::resetDatabase: Can't reset database if not logged in to a server.`)
      return false
    }
    console.log(`databaseService::resetDatabase: Sending database reset request`);
    const req = this.http.post<any>(`http://${this.authService.instanceURL}/api/${this.authService.preferredAPI.version}/database/sync`, {
      force: true
    });
    const res: any = await firstValueFrom(req);
    console.log(`databaseService::resetDatabase: message=${res.message}`);
    return true;
  }
}
