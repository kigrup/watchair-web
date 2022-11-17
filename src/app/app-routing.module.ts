import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './signed-in/home/home.component';
import { LoginComponent } from "./core/login/login.component";
import { SettingsComponent } from "./core/settings/settings.component";
import { LogoutComponent } from "./signed-in/logout/logout.component";
import { DomainNewComponent } from "./signed-in/domain-new/domain-new.component";
import { DomainComponent } from "./signed-in/domain/domain.component";

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: "full" },
  { path: 'login', component: LoginComponent },
  { path: 'settings', component: SettingsComponent},
  { path: 'home', component: HomeComponent},
  { path: 'logout', component: LogoutComponent},
  { path: 'domains/new', component: DomainNewComponent},
  { path: 'domains/view/:domainId', component: DomainComponent}

]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
