import { Injectable } from '@angular/core';
import {Metric, MetricValue} from "../types/metrics";
import {firstValueFrom, Subject} from "rxjs";
import {AuthService} from "../auth/auth.service";
import {HttpClient} from "@angular/common/http";
import {DomainsService} from "../domains/domains.service";
import {Domain} from "../types/domains";

@Injectable({
  providedIn: 'root'
})
export class MetricsService {

  private serverMetrics: Metric[] = [];
  public getDomainMetrics(domainId: string): Metric[] {
    return this.serverMetrics.filter((metric: Metric) => { return metric.domainId === domainId})
  }

  private _metricsFetchedSubject: Subject<Metric[]> = new Subject<Metric[]>();
  public get metricsFetchedSubject(): Subject<Metric[]> {
    return this._metricsFetchedSubject;
  }

  constructor(
    private authService: AuthService,
    private domainsService: DomainsService,
    private http: HttpClient
  ) {
    console.log('Metrics Service constructed');
    domainsService.domainsFetchedSubject.subscribe(async (domains: Domain[]) => {
      for (let i = 0; i < domains.length; i++) {
        await this.fetchMetrics(domains[i].id)
      }
    })
  }

  public async fetchMetrics(domainId: string): Promise<void> {
    console.log(`MetricsService::fetchMetrics: Fetching metrics`);
    const req = this.http.get<Metric[]>(`http://${this.authService.instanceURL}/api/${this.authService.preferredAPI.version}/domains/${domainId}/metrics`);
    const res: Metric[] = await firstValueFrom(req);
    console.log(`MetricsService::fetchMetrics: Fetched ${res.length} metrics with titles: ${res.map((metric: Metric) => { return `"${metric.title}"` })}`);
    this.serverMetrics = this.serverMetrics.filter((metric: Metric) => {
      return metric.domainId !== domainId
    }).concat(res);
    this.metricsFetchedSubject.next(this.serverMetrics);
  }
}
