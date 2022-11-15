import { Component, OnInit } from '@angular/core';
import { environment } from "../../../environments/environment.prod";
import { AuthService } from "../../server/auth/auth.service";
import {API_VERSIONS, APIVersion} from "../../server/types/settings";

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
    private authService: AuthService
  ) {
    this.serverInstanceUrl = environment.serverInstance;
    this.apiVersions = API_VERSIONS;
    this.apiVersion = authService.preferredAPI;
  }

  ngOnInit(): void {
  }

}
