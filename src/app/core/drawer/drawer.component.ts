import { Component, OnInit } from '@angular/core';
import {MenuItem} from "primeng/api";
import {AuthService} from "../../server/auth/auth.service";

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss']
})
export class DrawerComponent implements OnInit {

  protected loggedIn: boolean = false;

  private readonly outItemsLabels: string[];
  protected outItems: MenuItem[];

  private readonly inItemsLabels: string[];
  protected inItems: MenuItem[];

  constructor(
    private authService: AuthService
  ) {
    this.outItemsLabels = ['Login', 'Settings'];
    this.outItems = [
      {
        label: `<b>${this.outItemsLabels[0]}</b>`,
        routerLink: ['/login'],
        icon: 'pi pi-sign-in'
      },
      {
        label: this.outItemsLabels[1],
        routerLink: ['/settings'],
        icon: 'pi pi-cog'
      }
    ];

    this.inItemsLabels = ['Domains', 'Log out'];
    this.inItems = [
      {
        label: `<b>${this.inItemsLabels[0]}</b>`,
        routerLink: ['/home'],
        icon: 'pi pi-sign-in'
      },
      {
        label: this.inItemsLabels[1],
        routerLink: ['/logout'],
        icon: 'pi pi-cog'
      }
    ]

    this.setupMenuItems()
  }

  ngOnInit(): void {

  }

  private setupMenuItems(): void {
    const toggleBoldCommand = (items: MenuItem[], itemsLabels: string[]) => {return (event: any) => {
      for (let i = 0; i < itemsLabels.length; i++) {
        items[i].label = itemsLabels[i];
        event.item.label = `<b>${event.item.label}</b>`;
      }
    }}

    this.outItems.forEach((menuItem) => {
      menuItem.escape = false;
      menuItem.command = toggleBoldCommand(this.outItems, this.outItemsLabels);
    })
  }
}
