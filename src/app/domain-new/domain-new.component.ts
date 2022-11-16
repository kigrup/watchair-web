import { Component, OnInit } from '@angular/core';
import {AuthService} from "../server/auth/auth.service";

@Component({
  selector: 'app-domain-new',
  templateUrl: './domain-new.component.html',
  styleUrls: ['./domain-new.component.scss']
})
export class DomainNewComponent implements OnInit {

  constructor(
    private authService: AuthService
  ) {
    authService.forceLogin();
  }

  ngOnInit(): void {
  }

}
