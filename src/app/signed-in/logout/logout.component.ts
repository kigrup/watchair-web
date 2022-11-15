import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../server/auth/auth.service";

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(
    private authService: AuthService
  ) {
    this.authService.forceLogin();
  }

  ngOnInit(): void { }

}
