import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  DxMenuModule,
  DxRangeSelectorModule,
  DxPopupModule,
  DxChartModule,
  DxPieChartModule,
  DxVectorMapModule,
  DxDataGridModule,
  DxBulletModule,
  DxButtonModule,
  DxCheckBoxModule,
  DxSelectBoxModule,
  DxDropDownButtonModule,
} from 'devextreme-angular';
import { IconPickerModule } from "ngx-icon-picker";

import { SharedModule } from '../shared/shared.module';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';

import { AtmComponent } from '../../components/banksimulations/atm/atm.component';
import { AdvisorComponent } from '../../components/banksimulations/advisor/advisor.component';
import { TellerComponent } from '../../components/banksimulations/teller/teller.component';
import { CustomerComponent } from '../../components/banksimulations/customer/customer.component';

import { TellersComponent } from '../../modules/banksimulations/tellers/tellers.component';
import { AdvisorsComponent } from '../../modules/banksimulations/advisors/advisors.component';
import { AtmsComponent } from '../../modules/banksimulations/atms/atms.component';
import { CustomersComponent } from '../../modules/banksimulations/customers/customers.component';

@NgModule({
  imports: [
    HomeRoutingModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    NgSelectModule,
    CommonModule,
    SharedModule,
    DxMenuModule,
    DxRangeSelectorModule,
    DxPopupModule,
    DxChartModule,
    DxPieChartModule,
    DxVectorMapModule,
    DxDataGridModule,
    DxBulletModule,
    DxButtonModule,
    DxCheckBoxModule,
    DxSelectBoxModule,
    DxDropDownButtonModule,
    IconPickerModule,
  ],
  declarations: [
    HomeComponent,
    DashboardComponent,

    AtmComponent,
    AdvisorComponent,
    TellerComponent,
    CustomerComponent,

    TellersComponent,
    AdvisorsComponent,
    AtmsComponent,
    CustomersComponent
  ]
})

export class HomeModule {

  constructor() { }

  ngOnInit(): void {
  }
}
