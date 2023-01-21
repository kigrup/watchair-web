import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../server/auth/auth.service";
import { Domain } from "../../server/types/domains";
import {DomainsService} from "../../server/domains/domains.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  protected username: string | undefined;
  protected domains: Domain[] = []

  constructor(
    private authService: AuthService,
    private domainService: DomainsService
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
    const fetchedDomains: Domain[] = this.domainService.getDomains();
    if (fetchedDomains.length > 0) {
      this.domains = fetchedDomains;
    }
    this.domainService.domainsFetchedSubject.subscribe((domains: Domain[]) => {
      console.log(`homeComponent::ngOnInit: domainsFetchedSubject event. Updating domains...`)
      this.domains = domains;
    });

  }

}
