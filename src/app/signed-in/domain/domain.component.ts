import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../server/auth/auth.service";

@Component({
  selector: 'app-domain',
  templateUrl: './domain.component.html',
  styleUrls: ['./domain.component.scss']
})
export class DomainComponent implements OnInit {

  constructor(
    private authService: AuthService
  ) {
    authService.forceLogin();
  }

  ngOnInit(): void {
  }

}
