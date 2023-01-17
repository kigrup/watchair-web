import { Injectable } from '@angular/core';
import { AuthService } from "../auth/auth.service";
import { Domain } from "../types/domains";
import {firstValueFrom, Subject} from "rxjs";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {JobsService} from "../jobs/jobs.service";
import {MetricsService} from "../metrics/metrics.service";

@Injectable({
  providedIn: 'root'
})
export class DomainsService {

  private serverDomains: Domain[] = [];
  public getDomain(id: string): Domain | undefined {
    const result = this.serverDomains.find((domain: Domain) => { return domain.id === id});
    console.log(`DomainsService::getDomain: Trying to get domain with id ${id}. Found? ${result !== undefined}`);
    return result
  }
  public getDomains(): Domain[] {
    return this.serverDomains;
  }

  private _domainsFetchedSubject: Subject<Domain[]> = new Subject<Domain[]>();
  public get domainsFetchedSubject(): Subject<Domain[]> {
    return this._domainsFetchedSubject;
  }

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {
    console.log('DomainsService::constructor: Constructing domain Service...');
    authService.loginSubject.subscribe((loggedIn) => {
      console.log(`DomainsService::constructor: Received auth service login event: loggedIn=${loggedIn}`)
      if (loggedIn) {
        this.fetchDomains();
      }
    });
    if (this.serverDomains.length === 0) {
      this.fetchDomains();
    }
    console.log('DomainsService::constructor: Constructed domain Service!');
  }

  private async fetchDomains(): Promise<void> {
    console.log(`DomainsService::fetchDomains: Fetching domains`);
    const req = this.http.get<Domain[]>(`http://${this.authService.instanceURL}/api/${this.authService.preferredAPI.version}/domains`);
    const res: Domain[] = await firstValueFrom(req);
    console.log(`DomainsService::fetchDomains: Fetched ${res.length} domains. Domain names: ${res.map((domain: Domain) => { return `"${domain.name}"` })}`);
    this.serverDomains = res;
    this.domainsFetchedSubject.next(this.serverDomains);
  }

  public async createDomain(domainName: string, startDate: Date | undefined, endDate: Date | undefined): Promise<boolean> {
    if (domainName === undefined || domainName === '') {
      return false;
    }
    console.log(`DomainsService::createDomain: Sending create request with name ${domainName}`);
    const req = this.http.post<any>(`http://${this.authService.instanceURL}/api/${this.authService.preferredAPI.version}/domains`, {
      name: domainName,
      startDate: startDate !== undefined ? startDate : undefined,
      endDate: endDate !== undefined ? endDate : undefined
    });
    const res: Domain = await firstValueFrom(req);
    await this.fetchDomains();
    return true;
  }

  public async deleteDomain(domainId: string): Promise<boolean> {
    if (domainId === undefined || domainId === '') {
      return false;
    }
    console.log(`DomainsService::deleteDomain: Sending delete request with id ${domainId}`);
    const req = this.http.delete<any>(`http://${this.authService.instanceURL}/api/${this.authService.preferredAPI.version}/domains/${domainId}`,
      { observe: 'response' });
    try {
      const res = await firstValueFrom(req);
    } catch (e) {
      console.log(`DomainsService::deleteDomain: Error caught while deleting domain. ${(e instanceof HttpErrorResponse ? `Response status ${e.status}` : '')}`)
    }
    await this.fetchDomains();
    return true;
  }

  public getDomainFilesUrl(domainId: string) {
    return `http://${this.authService.instanceURL}/api/${this.authService.preferredAPI.version}/domains/${domainId}/files`;
  }
}
