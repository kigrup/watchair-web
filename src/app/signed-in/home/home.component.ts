import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../server/auth/auth.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  protected username: string | undefined;

  constructor(
    private authService: AuthService
  ) {
    this.authService.forceLogin();
    authService.loginSubject.subscribe((loggedIn: boolean) => {
      this.username = authService.loggedUsername ?? undefined;
    })
  }

  ngOnInit(): void {
    if (this.username === undefined) {
      this.username = this.authService.loggedUsername ?? undefined
    }
  }


}
