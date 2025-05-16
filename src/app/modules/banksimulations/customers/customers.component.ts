import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { RouterLinkWithHref } from '@angular/router';

import { CustomerComponent } from 'src/app/components/banksimulations/customer/customer.component';
import { CustomerService } from 'src/app/components/banksimulations/customer/customer.service';

declare var $: any;

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  @ViewChild("customers") customers: CustomerComponent;
  @ViewChild("addcustomer") addcustomer: CustomerComponent;
  @ViewChild("editcustomer") editcustomer: CustomerComponent;

  constructor(
    private customerservice: CustomerService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
  }

  view() {
  }

  addNew() {
    this.addcustomer.add();
    $("#add").modal("show");
  }

  edit(row) {
    this.editcustomer.customer = {
      customer_ID: row.data.customer_ID,
      customer_NAME:row.data.customer_NAME,
      customer_ADDRESS:row.data.customer_ADDRESS,
      customer_MOBNO:row.data.customer_MOBNO,
      isactive: row.data.isactive
    };
    if (row.data.isactive=="Y") {
      this.editcustomer.customer.isactive = true;
    } else {
      this.editcustomer.customer.isactive = false;
    }
    $("#edit").modal("show");
  }

  cancel() {
    $("#add").modal("hide");
    $("#edit").modal("hide");
  }

}
