import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../server/auth/auth.service";
import {DomainsService} from "../../server/domains/domains.service";

@Component({
  selector: 'app-domain-new',
  templateUrl: './domain-new.component.html',
  styleUrls: ['./domain-new.component.scss']
})
export class DomainNewComponent implements OnInit {

  protected enoughDomainData: boolean = false;
  protected newDomainName: string = '';

  constructor(
    private authService: AuthService,
    private domainService: DomainsService
  ) {
    authService.forceLogin();
  }

  ngOnInit(): void { }

  formChange() {
    this.enoughDomainData = (this.newDomainName !== undefined && this.newDomainName !== '')
  }

  protected createDomain() {
    this.domainService.createDomain(this.newDomainName);
  }
}
