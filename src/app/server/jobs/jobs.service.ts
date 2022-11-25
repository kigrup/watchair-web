import { Injectable } from '@angular/core';
import {firstValueFrom, Subject} from "rxjs";
import { Job } from "../types/jobs";
import { AuthService } from "../auth/auth.service";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class JobsService {

  private serverJobs: Job[] = [];
  public getDomainJobs(domainId: string): Job[] | undefined {
    return this.serverJobs.filter((job: Job) => { return job.domainId === domainId});
  }

  private _jobsFetchedSubject: Subject<Job[]> = new Subject<Job[]>();
  public get jobsFetchedSubject(): Subject<Job[]> {
    return this._jobsFetchedSubject;
  }

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {
    authService.loginSubject.subscribe((loggedIn) => {
      if (loggedIn) {
        this.fetchJobs();
      }
    });
  }

  private async fetchJobs(): Promise<void> {
    console.log(`JobsService::fetchJobs: Fetching jobs`);
    const req = this.http.get<Job[]>(`http://${this.authService.instanceURL}/api/${this.authService.preferredAPI.version}/jobs`);
    const res: Job[] = await firstValueFrom(req);
    console.log(`JobsService::fetchJobs: Fetched ${res.length} jobs. Job ids: ${res.map((job: Job) => { return `"${job.id}"` })}`);
    this.serverJobs = res;
    this.jobsFetchedSubject.next(this.serverJobs);
  }
}
