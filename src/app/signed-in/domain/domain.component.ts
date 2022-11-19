import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../server/auth/auth.service";
import { DomainsService } from "../../server/domains/domains.service";
import {ActivatedRoute, Router} from "@angular/router";
import { Domain } from "../../server/types/domains";

@Component({
  selector: 'app-domain',
  templateUrl: './domain.component.html',
  styleUrls: ['./domain.component.scss']
})
export class DomainComponent implements OnInit {

  protected domainId: string | null;
  protected domain: Domain | undefined;


  constructor(
    private authService: AuthService,
    private domainsService: DomainsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    authService.forceLogin();

    this.domainId = null;
    route.paramMap.subscribe((params) => {
      const newDomainId = params.get('domainId');
      if (this.domainId !== newDomainId) {
        this.domainId = newDomainId;
        this.ngOnInit();
      }
    })
  }

  ngOnInit(): void {
    this.fetchDomain();
  }

  private fetchDomain() {
    if (this.domainId) {
      this.domain = this.domainsService.getDomain(this.domainId);
      console.log(`domain: ${this.domain}`);
    }
  }

  async deleteDomain() {
    if (this.domain !== undefined) {
      await this.domainsService.deleteDomain(this.domain.id);
      this.router.navigate(['home']);
    }
  }

}
