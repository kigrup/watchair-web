import { Injectable } from '@angular/core';
import {Job} from "../types/jobs";
import {Metrics, UnitMetric} from "../types/metrics";
import {firstValueFrom, Subject} from "rxjs";
import {AuthService} from "../auth/auth.service";
import {HttpClient} from "@angular/common/http";

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
    private http: HttpClient
  ) {
    this.serverMetrics = {
      unitMetrics: []
    }
  }

  private async fetchMetrics(domainId: string): Promise<void> {
    console.log(`MetricsService::fetchMetrics: Fetching metrics`);
    const req = this.http.get<Metrics>(`http://${this.authService.instanceURL}/api/${this.authService.preferredAPI.version}/domains/${domainId}/metrics`);
    const res: Metrics = await firstValueFrom(req);
    console.log(`MetricsService::fetchMetrics: Fetched metrics`);
    this.serverMetrics = res;
    this.metricsFetchedSubject.next(this.serverMetrics);
  }
}
