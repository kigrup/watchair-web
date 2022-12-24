import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../server/auth/auth.service";
import { DomainsService } from "../../server/domains/domains.service";
import {ActivatedRoute, Router} from "@angular/router";
import { Domain } from "../../server/types/domains";
import {HttpResponse} from "@angular/common/http";
import {Job} from "../../server/types/jobs";
import {JobsService} from "../../server/jobs/jobs.service";
import {Metric, MetricValue} from "../../server/types/metrics";
import {MetricsService} from "../../server/metrics/metrics.service";

@Component({
  selector: 'app-domain',
  templateUrl: './domain.component.html',
  styleUrls: ['./domain.component.scss']
})
export class DomainComponent {

  protected domainId: string | undefined;
  protected domain: Domain | undefined;
  protected jobs: Job[] = [];
  protected reviewsDoneMetric: Metric | undefined;
  protected individualReviewsDoneMetric: Metric | undefined;
  protected submissionsAcceptanceMetric: Metric | undefined;
  protected individualSubmissionsAcceptanceMetric: Metric | undefined;
  protected submissionsAcceptanceData: any;

  protected tableMetrics: any[] = []

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
      console.log(`DomainComponent::constructor: retrieved domaindId: ${newDomainId} from params`)
      if (newDomainId !== null && this.domainId !== newDomainId) {
        this.domainId = newDomainId;
        console.log('DomainComponent::constructor: assigned domainId');
        this.filesUrl = this.domainsService.getDomainFilesUrl(this.domainId);
        void this.initializeDomain();
      }
    })
    this.domainsService.domainsFetchedSubject.subscribe((value) => {
      this.initializeDomain();
    })
    this.jobsService.jobsFetchedSubject.subscribe((value) => {
      this.initializeDomain();
    })
    this.metricsService.metricsFetchedSubject.subscribe((value) => {
      this.initializeDomain();
    })
  }

  async initializeDomain(): Promise<void> {
    console.log(`DomainComponent::ngOnInit: Initializing domain. DomainId=${this.domainId}`);
    await this.fetchDomain();
    await this.fetchJobs(false);
    await this.fetchMetrics(false);
  }

  private fetchDomain() {
    if (this.domainId) {
      this.domain = this.domainsService.getDomain(this.domainId);
      if (this.domain === undefined) {
        console.warn(`DomainComponent::fetchDomain: Domain with id ${this.domainId} not found in domain service!`)
      }
    }
  }

  protected async fetchJobs(forceRequest: boolean) {
    if (this.domainId) {
      console.log(`DomainComponent::fetchJobs: Fetching jobs for domain id ${this.domainId}. Use cache? (don't request jobs again): ${!forceRequest}`);
      if (forceRequest) {
        await this.jobsService.fetchJobs(this.domainId);
        await this.fetchMetrics(true);
      }
      this.jobs = this.jobsService.getDomainJobs(this.domainId);
    }
  }

  async deleteDomain() {
    if (this.domain !== undefined) {
      await this.domainsService.deleteDomain(this.domain.id);
      await this.router.navigate(['home']);
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
      this.reviewsDoneMetric = this.metricsService.getDomainMetric(this.domainId, 'Global: Review assignments finished')
      this.individualReviewsDoneMetric = this.metricsService.getDomainMetric(this.domainId, 'Individual: Review assignments finished')
      this.submissionsAcceptanceMetric = this.metricsService.getDomainMetric(this.domainId, 'Global: Submissions evaluation scores')
      this.individualSubmissionsAcceptanceMetric = this.metricsService.getDomainMetric(this.domainId, 'Individual: Submissions evaluation scores')
      this.updateMetricsData();
    }
  }

  private updateMetricsData() {
    // Submission acceptance metric
    const sortStrNum = (a: MetricValue, b: MetricValue): -1 | 0 | 1 => {
      return (a.label.charAt(0) === '-' && b.label.charAt(0) === '-') ? (a.label < b.label ? -1 : 1) : (a.label < b.label ? 1 : -1)
    }

    const sortedValues: MetricValue[] | undefined = this.submissionsAcceptanceMetric?.values.sort(sortStrNum);
    if (this.submissionsAcceptanceMetric !== undefined && sortedValues !== undefined) {
      this.submissionsAcceptanceMetric.values = sortedValues;
    }
    this.submissionsAcceptanceData = {
      labels: this.submissionsAcceptanceMetric?.values.map((metricValue: MetricValue) => { return metricValue.label }),
      datasets: [{
        data: this.submissionsAcceptanceMetric?.values.map((metricValue: MetricValue) => { return metricValue.value }),
        backgroundColor: this.submissionsAcceptanceMetric?.values.map((metricValue: MetricValue) => { return metricValue.color })
      }]
    };

    // Reviews done metric
    this.tableMetrics = []
    this.individualReviewsDoneMetric?.values.forEach((metric) => {
      this.tableMetrics.push({
        pcMember: metric.label,
        reviewsDonePercent: Math.floor(100*metric.value/metric.max),
        reviewsDone: `${metric.value}/${metric.max} (${Math.floor(100*metric.value/metric.max)}%)`
      })
    })

    // Review scores metric
    this.individualSubmissionsAcceptanceMetric?.values.forEach((metric) => {
      this.tableMetrics.find((v, i) => {
        return v.pcMember === metric.label
      }).relativeAcceptanceFactor = `${metric.value}`
    })

    //this.tableMetrics.sort((a, b) => { return a.reviewsDonePercent - b.reviewsDonePercent})
    this.tableMetrics.sort((a, b) => { return a.relativeAcceptanceFactor - b.relativeAcceptanceFactor})
  }
}
