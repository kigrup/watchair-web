import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../server/auth/auth.service";
import { DomainsService } from "../../server/domains/domains.service";
import {ActivatedRoute, Router} from "@angular/router";
import { Domain } from "../../server/types/domains";
import {HttpResponse} from "@angular/common/http";
import {Job} from "../../server/types/jobs";
import {JobsService} from "../../server/jobs/jobs.service";
import {format} from "date-fns"
import {Metric, MetricValue} from "../../server/types/metrics";
import {MetricsService} from "../../server/metrics/metrics.service";

@Component({
  selector: 'app-domain',
  templateUrl: './domain.component.html',
  styleUrls: ['./domain.component.scss']
})
export class DomainComponent implements OnInit {

  protected domainId: string | undefined;
  protected domain: Domain | undefined;
  protected jobs: Job[] = [];
  protected reviewsDoneMetric: Metric | undefined;
  protected submissionsAcceptanceMetric: Metric | undefined;
  protected submissionsAcceptanceData: any;

  protected primeNgChartOptions: any = {
    responsive: false,
    maintainsAspectRatio: false
  }

  protected filesUrl: string | undefined;
  protected uploadedFiles: any[] = [];

  constructor(
    private authService: AuthService,
    private domainsService: DomainsService,
    private jobsService: JobsService,
    private metricsService: MetricsService,
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
    this.fetchJobs(false);
    this.fetchMetrics(false);
  }

  private fetchDomain() {
    if (this.domainId) {
      this.domain = this.domainsService.getDomain(this.domainId);
      console.log(`domain: ${this.domain}`);
    }
  }

  protected async fetchJobs(forceRequest: boolean) {
    if (this.domainId) {
      console.log(`DomainComponent::fetchJobs: Fetching jobs for domain id ${this.domainId}. Use cache? (don't request jobs again): ${!forceRequest}`);
      if (forceRequest) {
        await this.jobsService.fetchJobs(this.domainId);
      }
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

  protected async fetchMetrics(forceRequest: boolean) {
    if (this.domainId) {
      console.log(`DomainComponent::fetchMetrics: Fetching metrics for domain id ${this.domainId}. Use cache? (don't request jobs again): ${!forceRequest}`);
      if (forceRequest) {
        await this.metricsService.fetchMetrics(this.domainId);
      }
      this.reviewsDoneMetric = this.metricsService.getDomainMetrics(this.domainId).find((metric: Metric) => {
        return metric.title === 'Review assignments finished'
      });
      this.submissionsAcceptanceMetric = this.metricsService.getDomainMetrics(this.domainId).find((metric: Metric) => {
        return metric.title === 'Submissions evaluation scores'
      })
      this.updateMetricsData();
    }
  }

  private updateMetricsData() {
    const sortStrNum = (a: MetricValue, b: MetricValue): -1 | 0 | 1 => {
      return (a.label.charAt(0) === '-' && b.label.charAt(0) === '-') ? (a.label < b.label ? -1 : 1) : (a.label < b.label ? 1 : -1)
    }

    const sortedValues: MetricValue[] | undefined = this.submissionsAcceptanceMetric?.values.sort(sortStrNum);
    if (this.submissionsAcceptanceMetric !== undefined && sortedValues !== undefined) {
      this.submissionsAcceptanceMetric.values = sortedValues;
    }
    console.log(sortedValues);
    this.submissionsAcceptanceData = {
      labels: this.submissionsAcceptanceMetric?.values.map((metricValue: MetricValue) => { return metricValue.label }),
      datasets: [{
        data: this.submissionsAcceptanceMetric?.values.map((metricValue: MetricValue) => { return metricValue.value }),
        backgroundColor: this.submissionsAcceptanceMetric?.values.map((metricValue: MetricValue) => { return metricValue.color })
      }]
    };
  }
}
