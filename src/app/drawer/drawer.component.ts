import { Component, OnInit } from '@angular/core';
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss']
})
export class DrawerComponent implements OnInit {

  private readonly itemLabels: string[];
  protected items: MenuItem[];

  constructor() {
    this.itemLabels = ['Login', 'Settings'];
    this.items = [
      {
        label: `<b>${this.itemLabels[0]}</b>`,
        routerLink: ['/login'],
      },
      {
        label: this.itemLabels[1],
        routerLink: ['/settings']
      }
    ]

    this.setupMenuItems()
  }

  ngOnInit(): void {

  }

  private setupMenuItems(): void {
    const toggleBoldCommand = (event: any) => {
      for (let i = 0; i < this.itemLabels.length; i++) {
        this.items[i].label = this.itemLabels[i];
        event.item.label = `<b>${event.item.label}</b>`;
      }
    }

    this.items.forEach((menuItem) => {
      menuItem.escape = false;
      menuItem.command = toggleBoldCommand;
    })
  }
}
