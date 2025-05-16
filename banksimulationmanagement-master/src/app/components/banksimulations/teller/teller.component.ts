import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { TellerService } from '../teller/teller.service';

@Component({
  selector: 'app-teller',
  templateUrl: './teller.component.html',
  styleUrls: ['./teller.component.css']
})
export class TellerComponent implements OnInit {

  @Input()
  view: number = 1;
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  tellerID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();

  tellers = [];
  tellersAll = [];
  teller = {
      teller_ID: 0,
      teller_MOBNO: "",
      teller_NAME: "",
      teller_ADDRESS: "",
      isactive:true,
  }

  constructor(
    private tellerservice: TellerService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router : Router,
  ) { }

  ngOnInit(): void {
    this.tellers = JSON.parse(window.sessionStorage.getItem('tellers'));
    this.tellersAll = JSON.parse(window.sessionStorage.getItem('tellersAll'));
    if (this.view == 1 && this.disabled == false && this.tellers == null) {
      this.tellerGet();
    } else if (this.view == 1 && this.disabled == true && this.tellersAll == null) {
      this.tellerGetAll();
    } else if (this. view == 2 && this.tellersAll == null) {
      this.tellerGetAll();
    }

    if (this.tellerID != 0 && !this.tellerID && Number(window.sessionStorage.getItem('teller'))>0) {
      this.tellerID = Number(window.sessionStorage.getItem('teller'));
    }

    if (this.view == 5 && this.tellerID) {
      window.sessionStorage.setItem("teller", this.tellerID);
      this.tellerGetOne(this.tellerID);
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
          onClick: this.tellerGetAll.bind(this),
        },
      }
    );
  }

  add() {
    this.teller = {
      teller_ID: 0,
      teller_MOBNO: "",
      teller_NAME: "",
      teller_ADDRESS: "",
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

  tellerEdit(){
    this.disabled = false;
  }

  tellerCancel() {
    this.disabled = true;
    if (this.teller.teller_ID==0) {
      this.router.navigate(["/home/teller "], {});
    }
  }

  setTeller(response) {
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.teller = response;
  }

  setTellers(response) {
    if ((this.view == 1 || this.view == 11)  && this.disabled == false) {
      this.tellers = response;
      window.sessionStorage.setItem("tellers", JSON.stringify(this.tellers));
    } else {
      this.tellersAll = response;
      window.sessionStorage.setItem("tellersAll", JSON.stringify(this.tellersAll));
    }
    this.cancel.next();
  }

  tellerGet() {
    this.tellerservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setTellers(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  tellerGetAll() {
    this.tellerservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setTellers(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  tellerGetOne(id) {
    this.disabled = true;
    this.tellerservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setTeller(response);

        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  tellerAdd(teller) {
    teller.isactive="Y";

    this.tellerservice.add(teller).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.teller_ID) {
          this.toastrservice.success("Success", "New Teller Added");
          this.tellerGetAll();
          this.setTeller(response);
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  tellerUpdate(teller) {
    if (teller.isactive == true) {
      teller.isactive = "Y";
    } else {
      teller.isactive = "N";
    }
    this.tellerservice.update(teller, teller.teller_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.teller_ID) {
          this.toastrservice.success("Success", " Teller Updated");
          this.tellerGetAll();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }
}
