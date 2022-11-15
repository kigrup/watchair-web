import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../server/auth/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public username: string = "";
  public password: string = "";

  public loadingLogin: boolean = false;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  async login(): Promise<void> {
    this.loadingLogin = true;
    const loginSuccesful = await this.authService.attemptLogin(this.username, this.password);
    this.loadingLogin = false;
  }
}
