import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotfoundComponent } from '../../pages/notfound/notfound.component';
import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { TellersComponent } from '../../modules/banksimulations/tellers/tellers.component';
import { AdvisorsComponent } from '../../modules/banksimulations/advisors/advisors.component';
import { AtmsComponent } from '../../modules/banksimulations/atms/atms.component';
import { CustomersComponent } from '../../modules/banksimulations/customers/customers.component';

const routes: Routes = [{
  path: '', component: HomeComponent,
  children: [
    { path: 'dashboard', component: DashboardComponent },

    { path: 'tellers', component: TellersComponent },
    { path: 'customers', component: CustomersComponent },
    { path: 'atms', component: AtmsComponent },
    { path: 'advisors', component: AdvisorsComponent },

    { path: '', redirectTo: 'dashboard' },
    { path: '**', component: NotfoundComponent }
  ]
}]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
