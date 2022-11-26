import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './signed-in/home/home.component';
import { LoginComponent } from './core/login/login.component';
import { MatSidenavModule } from "@angular/material/sidenav";
import {PanelMenuModule} from "primeng/panelmenu";
import { SettingsComponent } from './core/settings/settings.component';
import {MenuModule} from "primeng/menu";
import { DrawerComponent } from './core/drawer/drawer.component';
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {CheckboxModule} from "primeng/checkbox";
import {InputTextModule} from "primeng/inputtext";
import {DividerModule} from "primeng/divider";
import {FormsModule} from "@angular/forms";
import {DropdownModule} from "primeng/dropdown";
import {HttpClientModule} from "@angular/common/http";
import { LogoutComponent } from './signed-in/logout/logout.component';
import { DomainNewComponent } from './signed-in/domain-new/domain-new.component';
import { DomainComponent } from './signed-in/domain/domain.component';
import {SkeletonModule} from "primeng/skeleton";
import { DocsGettingStartedComponent } from './core/docs-getting-started/docs-getting-started.component';
import { DocsUploadingDataComponent } from './core/docs-uploading-data/docs-uploading-data.component';
import {FileUploadModule} from "primeng/fileupload";
import {TableModule} from "primeng/table";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SettingsComponent,
    DrawerComponent,
    LogoutComponent,
    DomainNewComponent,
    DomainComponent,
    DocsGettingStartedComponent,
    DocsUploadingDataComponent,
  ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        MatSidenavModule,
        PanelMenuModule,
        MenuModule,
        ButtonModule,
        RippleModule,
        CheckboxModule,
        InputTextModule,
        DividerModule,
        FormsModule,
        DropdownModule,
        HttpClientModule,
        SkeletonModule,
        FileUploadModule,
        TableModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
