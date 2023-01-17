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
import {SortEvent} from "primeng/api";

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
  protected individualLocalSubmissionsAcceptanceMetric: Metric | undefined;
  protected minAverageScoreDeviation: number = Number.MAX_SAFE_INTEGER;
  protected maxAverageScoreDeviation: number = Number.MIN_SAFE_INTEGER;
  protected submissionsAcceptanceData: {name: string, value: number}[] = [];
  protected submissionsAcceptanceScoreAverage: number | undefined;
  protected participationScoreMetric: Metric | undefined;

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
      this.individualLocalSubmissionsAcceptanceMetric = this.metricsService.getDomainMetric(this.domainId, 'Individual Local: Submissions evaluation scores')
      this.participationScoreMetric = this.metricsService.getDomainMetric(this.domainId, 'Individual: Participation in the review process')
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
    if (this.submissionsAcceptanceMetric !== undefined) {
    this.submissionsAcceptanceData = this.submissionsAcceptanceMetric.values.map((metricValue: MetricValue) => {
      return {
        name: metricValue.label,
        value: metricValue.value
      }
    })
    }

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
      if (metric.label === 'average') {
        this.submissionsAcceptanceScoreAverage = metric.value
      } else {
        this.tableMetrics.find((v, i) => {
          return v.pcMember === metric.label
        }).relativeAcceptanceFactor = `${metric.value.toFixed(2)}`
      }
    })

    this.individualLocalSubmissionsAcceptanceMetric?.values.forEach((metric) => {
      this.maxAverageScoreDeviation = Math.max(this.maxAverageScoreDeviation, metric.value);
      this.minAverageScoreDeviation = Math.min(this.minAverageScoreDeviation, metric.value);
      this.tableMetrics.find((v, i) => {
        return v.pcMember === metric.label
      }).localRelativeAcceptanceFactor = `${metric.value.toFixed(2)}`
    })

    // Participation
    this.participationScoreMetric?.values.forEach((metric) => {
      const indexOfMember = this.tableMetrics.indexOf(this.tableMetrics.find((v,i) => {
        return v.pcMember === metric.label
      }));
      if (indexOfMember >= 0) {
        this.tableMetrics[indexOfMember].participationScore = metric.value
      }
    })

    //this.tableMetrics.sort((a, b) => { return a.reviewsDonePercent - b.reviewsDonePercent})
    this.tableMetrics.sort((a, b) => { return a.localRelativeAcceptanceFactor - b.localRelativeAcceptanceFactor})
  }

  private mapRangeClamped (from: number[], to: number[], s: number): number {
    const num = to[0] + (s - from[0]) * (to[1] - to[0]) / (from[1] - from[0]);
    return Math.max(to[0], Math.min(to[1], num))
  };

  public getRGB(factor: string, valueType: 'assignments done' | 'global acceptance' | 'local acceptance'): string {
    if (valueType === 'assignments done') {
      const percent = factor.substring(factor.lastIndexOf('(')+1, factor.lastIndexOf('%)'))
      const valueNumber = Number.parseFloat(percent);
      const lightness = this.mapRangeClamped([0, 100], [65, 100], valueNumber);
      return `hsl(207, 100%, ${lightness}%)`
    } else if (valueType === 'local acceptance') {
      const valueNumber = Number.parseFloat(factor);
      const lightness = this.mapRangeClamped([-2, 0], [75, 100], -Math.abs(valueNumber));
      return `hsl(207, 100%, ${lightness}%)`
    } else {
      return 'white';
    }
  }

  customSort(event: SortEvent) {
    if (event.data !== undefined) {
      event.data.sort((data1, data2) => {
        if (event.field !== undefined && event.order) {
          let value1 = data1[event.field];
          let value2 = data2[event.field];
          let result = null;
          if (event.field === 'reviewsDone') {
            if (value1 == null && value2 != null)
              result = -1;
            else if (value1 != null && value2 == null)
              result = 1;
            else if (value1 == null && value2 == null)
              result = 0;
            else if (typeof value1 === 'string' && typeof value2 === 'string')
              result = value1.localeCompare(value2);
            else
              result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
            return (event.order * result);
          } else {
            result = (Number(value1) < Number(value2)) ? -1 : (Number(value1) > Number(value2)) ? 1 : 0;
            return (event.order * result);
          }
        }
        return 0;
      });
    }
  }
}
