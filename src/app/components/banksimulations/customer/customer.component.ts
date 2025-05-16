import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { CustomerService } from '../customer/customer.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  @Input()
  view: number = 1;
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  customerID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();

  customers = [];
  customersAll = [];
  customer = {
      customer_ID: 0,
      customer_MOBNO: "",
      customer_NAME: "",
      customer_ADDRESS: "",
      isactive:true,
  }

  constructor(
    private customerservice: CustomerService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router : Router,
  ) { }

  ngOnInit(): void {
    this.customers = JSON.parse(window.sessionStorage.getItem('customers'));
    this.customersAll = JSON.parse(window.sessionStorage.getItem('customersAll'));
    if (this.view == 1 && this.disabled == false && this.customers == null) {
      this.customerGet();
    } else if (this.view == 1 && this.disabled == true && this.customersAll == null) {
      this.customerGetAll();
    } else if (this. view == 2 && this.customersAll == null) {
      this.customerGetAll();
    }

    if (this.customerID != 0 && !this.customerID && Number(window.sessionStorage.getItem('customer'))>0) {
      this.customerID = Number(window.sessionStorage.getItem('customer'));
    }

    if (this.view == 5 && this.customerID) {
      window.sessionStorage.setItem("customer", this.customerID);
      this.customerGetOne(this.customerID);
    }

  }

  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          width: 136,
          text: 'Refresh',
          onClick: this.customerGetAll.bind(this),
        },
      }
    );
  }

  add() {
    this.customer = {
      customer_ID: 0,
      customer_MOBNO: "",
      customer_NAME: "",
      customer_ADDRESS: "",
      isactive: true,
    };
  }

  update(row) {
    this.edit.next(row);
  }

  editView() {
    this.disabled = false;
  }

  showView(row) {
    this.show.next(row);
  }

  cancelView() {
    this.cancel.next();
  }

  customerEdit(){
    this.disabled = false;
  }

  customerCancel() {
    this.disabled = true;
    if (this.customer.customer_ID==0) {
      this.router.navigate(["/home/customer "], {});
    }
  }

  setCustomer(response) {
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.customer = response;
  }

  setCustomers(response) {
    if ((this.view == 1 || this.view == 11)  && this.disabled == false) {
      this.customers = response;
      window.sessionStorage.setItem("customers", JSON.stringify(this.customers));
    } else {
      this.customersAll = response;
      window.sessionStorage.setItem("customersAll", JSON.stringify(this.customersAll));
    }
    this.cancel.next();
  }

  customerGet() {
    this.customerservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setCustomers(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  customerGetAll() {
    this.customerservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setCustomers(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  customerGetOne(id) {
    this.disabled = true;
    this.customerservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setCustomer(response);

        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  customerAdd(customer) {
    customer.isactive="Y";

    this.customerservice.add(customer).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.customer_ID) {
          this.toastrservice.success("Success", "New Customer Added");
          this.customerGetAll();
          this.setCustomer(response);
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  customerUpdate(customer) {
    if (customer.isactive == true) {
      customer.isactive = "Y";
    } else {
      customer.isactive = "N";
    }
    this.customerservice.update(customer, customer.customer_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.customer_ID) {
          this.toastrservice.success("Success", " Customer Updated");
          this.customerGetAll();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }
}
