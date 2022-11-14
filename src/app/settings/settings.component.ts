import { Component, OnInit } from '@angular/core';
import { environment } from "../../environments/environment.prod";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  protected serverInstanceUrl: string;

  apiVersions: any[] = [{ name: 'v1' }];
  apiVersion: any = this.apiVersions[0];

  constructor() {
    this.serverInstanceUrl = environment.serverInstance;
  }

  ngOnInit(): void {
  }

}
