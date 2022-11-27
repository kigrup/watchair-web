import { Injectable } from '@angular/core';
import {Job} from "../types/jobs";
import {Metrics, UnitMetric} from "../types/metrics";
import {firstValueFrom, Subject} from "rxjs";
import {AuthService} from "../auth/auth.service";
import {HttpClient} from "@angular/common/http";
import {DomainsService} from "../domains/domains.service";
import {Domain} from "../types/domains";

@Injectable({
  providedIn: 'root'
})
export class MetricsService {

  private serverMetrics: Metrics;
  public getDomainMetrics(domainId: string): Metrics {
    return {
      unitMetrics: this.serverMetrics.unitMetrics.filter((unitMetric: UnitMetric) => { return unitMetric.domainId === domainId})
    }
  }

  private _metricsFetchedSubject: Subject<Metrics> = new Subject<Metrics>();
  public get metricsFetchedSubject(): Subject<Metrics> {
    return this._metricsFetchedSubject;
  }

  constructor(
    private authService: AuthService,
    private domainsService: DomainsService,
    private http: HttpClient
  ) {
    this.serverMetrics = {
      unitMetrics: []
    };
    console.log('Metrics Service constructed');
    domainsService.domainsFetchedSubject.subscribe(async (domains: Domain[]) => {
      for (let i = 0; i < domains.length; i++) {
        await this.fetchMetrics(domains[i].id)
      }
    })
  }

  public async fetchMetrics(domainId: string): Promise<void> {
    console.log(`MetricsService::fetchMetrics: Fetching metrics`);
    const req = this.http.get<Metrics>(`http://${this.authService.instanceURL}/api/${this.authService.preferredAPI.version}/domains/${domainId}/metrics`);
    const res: Metrics = await firstValueFrom(req);
    console.log(`MetricsService::fetchMetrics: Fetched ${res.unitMetrics.length} unitMetrics with titles: ${res.unitMetrics.map((unitMetric: UnitMetric) => { return `"${unitMetric.title}"` })}`);
    this.serverMetrics.unitMetrics = this.serverMetrics.unitMetrics.filter((unitMetric: UnitMetric) => {
      return unitMetric.domainId !== domainId
    }).concat(res.unitMetrics);
    this.metricsFetchedSubject.next(this.serverMetrics);
  }
}
