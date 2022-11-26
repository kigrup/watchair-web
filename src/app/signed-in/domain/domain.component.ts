import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../server/auth/auth.service";
import { DomainsService } from "../../server/domains/domains.service";
import {ActivatedRoute, Router} from "@angular/router";
import { Domain } from "../../server/types/domains";
import {HttpResponse} from "@angular/common/http";
import {Job} from "../../server/types/jobs";
import {JobsService} from "../../server/jobs/jobs.service";
import {format} from "date-fns"

@Component({
  selector: 'app-domain',
  templateUrl: './domain.component.html',
  styleUrls: ['./domain.component.scss']
})
export class DomainComponent implements OnInit {

  protected domainId: string | undefined;
  protected domain: Domain | undefined;
  protected jobs: Job[] = [];

  protected filesUrl: string | undefined;
  protected uploadedFiles: any[] = [];

  constructor(
    private authService: AuthService,
    private domainsService: DomainsService,
    private jobsService: JobsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    authService.forceLogin();

    route.paramMap.subscribe((params) => {
      const newDomainId = params.get('domainId');
      if (newDomainId !== null && this.domainId !== newDomainId) {
        this.domainId = newDomainId;
        this.filesUrl = this.domainsService.getDomainFilesUrl(this.domainId);
        this.ngOnInit();
      }
    })
  }

  ngOnInit(): void {
    this.fetchDomain();
    this.fetchJobs();
  }

  private fetchDomain() {
    if (this.domainId) {
      this.domain = this.domainsService.getDomain(this.domainId);
      console.log(`domain: ${this.domain}`);
    }
  }

  private fetchJobs() {
    if (this.domainId) {
      this.jobs = this.jobsService.getDomainJobs(this.domainId);
    }
  }

  async deleteDomain() {
    if (this.domain !== undefined) {
      await this.domainsService.deleteDomain(this.domain.id);
      this.router.navigate(['home']);
    }
  }

  protected onUpload(event: any) {
    const response: HttpResponse<any> = event.originalEvent;
    if (response.body.job !== undefined) {
      this.jobs.unshift(response.body.job);
    }
  }

}
