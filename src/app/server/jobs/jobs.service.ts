import { Injectable } from '@angular/core';
import {firstValueFrom, Subject} from "rxjs";
import { Job } from "../types/jobs";
import { HttpClient } from "@angular/common/http";
import { DomainsService } from "../domains/domains.service";
import { Domain } from "../types/domains";
import {AuthService} from "../auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class JobsService {

  private serverJobs: Job[] = [];
  public getDomainJobs(domainId: string): Job[] {
    return this.serverJobs.filter((job: Job) => { return job.domainId === domainId});
  }

  private _jobsFetchedSubject: Subject<Job[]> = new Subject<Job[]>();
  public get jobsFetchedSubject(): Subject<Job[]> {
    return this._jobsFetchedSubject;
  }

  constructor(
    private authService: AuthService,
    private domainsService: DomainsService,
    private http: HttpClient
  ) {
    console.log('Jobs Service constructed');
    domainsService.domainsFetchedSubject.subscribe(async (domains: Domain[]) => {
      for (let i = 0; i < domains.length; i++) {
        await this.fetchJobs(domains[i].id)
      }
    })
  }

  public async fetchJobs(domainId: string): Promise<void> {
    console.log(`JobsService::fetchJobs: Fetching jobs`);
    const req = this.http.get<Job[]>(`http://${this.authService.instanceURL}/api/${this.authService.preferredAPI.version}/domains/${domainId}/jobs`);
    const res: Job[] = await firstValueFrom(req);
    console.log(`JobsService::fetchJobs: Fetched ${res.length} jobs. Job ids: ${res.map((job: Job) => { return `"${job.id}"` })}`);
    this.serverJobs = this.serverJobs.filter((job: Job) => {
      return (job.domainId !== domainId)
    }).concat(res);

    this.jobsFetchedSubject.next(this.serverJobs);
  }
}
