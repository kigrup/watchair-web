import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {AuthService} from "../../server/auth/auth.service";
import {DomainsService} from "../../server/domains/domains.service";
import {Domain} from "../../server/types/domains";
import {JobsService} from "../../server/jobs/jobs.service";
import {MetricsService} from "../../server/metrics/metrics.service";

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss']
})
export class DrawerComponent implements OnInit {

  protected loggedIn: boolean = false;

  protected menuVisible: boolean = true;

  private readonly docsMenuOption: MenuItem;
  private readonly outItemsLabels: string[];
  protected outItems: MenuItem[];

  private readonly createDomainsOption: any;
  private readonly inItemsLabels: string[];
  protected inItems: MenuItem[];

  constructor(
    private authService: AuthService,
    private domainService: DomainsService,
    private jobsService: JobsService,
    private metricsService: MetricsService
  ) {
    this.docsMenuOption = {
      label: 'Documentation',
      icon: 'pi pi-question-circle',
      items: [
        {
          label: 'Getting started',
          routerLink: ['/docs/getting-started'],
          icon: 'pi pi-info-circle'
        },
        {
          label: 'Uploading data',
          routerLink: ['/docs/uploading-data'],
          icon: 'pi pi-send'
        }
      ]
    }

    this.outItemsLabels = ['Login', 'Settings', 'Documentation'];
    this.outItems = [
      {
        label: this.outItemsLabels[0],
        routerLink: ['/login'],
        icon: 'pi pi-sign-in'
      },
      {
        label: this.outItemsLabels[1],
        routerLink: ['/settings'],
        icon: 'pi pi-cog'
      },
      this.docsMenuOption
    ];

    this.createDomainsOption = {
      label: 'Create new',
      routerLink: ['/domains/new'],
      icon: 'pi pi-plus'
    };
    this.inItemsLabels = ['Home', 'Domains', 'Documentation', 'Log out'];
    this.inItems = [
      {
        label: this.inItemsLabels[0],
        routerLink: ['/home'],
        icon: 'pi pi-home'
      },
      {
        label: this.inItemsLabels[1],
        icon: 'pi pi-briefcase',
        items: [
          this.createDomainsOption
        ],
        expanded: true
      },
      this.docsMenuOption,
      {
        label: this.inItemsLabels[3],
        routerLink: ['/logout'],
        icon: 'pi pi-sign-out'
      }
    ]
    //this.setupMenuItems();
  }

  ngOnInit(): void {
    this.authService.loginSubject.subscribe((loggedIn: boolean) => {
      this.loggedIn = loggedIn;
    });
    this.domainService.domainsFetchedSubject.subscribe((domains: Domain[]) => {
      this.fetchedDomains(domains);
      this.updateMenu();
    });
  }

  async updateMenu() {
    this.menuVisible = false;
    setTimeout(() => {
      this.menuVisible = true;
    }, 0);
  }

  private setupMenuItems(): void {
    const toggleBoldCommand = (items: MenuItem[], itemsLabels: string[]) => {return (event: any) => {
      for (let i = 0; i < itemsLabels.length; i++) {
        if (event.item.items === undefined) {
          items[i].label = itemsLabels[i];
          event.item.label = `<b>${event.item.label}</b>`;
        }
      }
    }}

    this.outItems.forEach((menuItem) => {
      menuItem.escape = false;
      menuItem.command = toggleBoldCommand(this.outItems, this.outItemsLabels);
    });

    this.inItems.forEach((menuItem) => {
      menuItem.escape = false;
      menuItem.command = toggleBoldCommand(this.inItems, this.inItemsLabels);
    });
  }

  private fetchedDomains(domains: Domain[]): void {
    const domainsMenuOption = this.inItems.find((option) => {
      return option.label === this.inItemsLabels[1];
    });
    if (domainsMenuOption === undefined) {
      console.warn("Can't find 'Domains' menu option, can't show domains in the sidebar menu");
      return
    }
    domainsMenuOption.items = [];
    domains.forEach((domain) => {
      domainsMenuOption.items?.push({
        label: domain.name,
        routerLink: [`/domains/view/${domain.id}`],
        icon: 'pi pi-book'
      })
    });
    domainsMenuOption.items?.push(this.createDomainsOption);
  }
}
