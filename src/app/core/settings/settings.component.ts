import { Component, OnInit } from '@angular/core';
import { environment } from "../../../environments/environment.prod";
import { AuthService } from "../../server/auth/auth.service";
import {API_VERSIONS, APIVersion} from "../../server/types/settings";
import {DatabaseService} from "../../server/database/database.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  protected serverInstanceUrl: string;

  protected apiVersions: APIVersion[];
  protected apiVersion: APIVersion;

  constructor(
    protected authService: AuthService,
    private databaseService: DatabaseService
  ) {
    this.serverInstanceUrl = environment.serverInstance;
    this.apiVersions = API_VERSIONS;
    this.apiVersion = authService.preferredAPI;
  }

  ngOnInit(): void {
  }

  protected resetDatabase(): void {
    console.log(`settingsComponent::resetDatabase: Starting database reset...`);
    this.databaseService.resetDatabase();
    this.authService.logout();
    this.authService.forceLogin();
  }
}
