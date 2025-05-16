import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { AtmService } from '../atm/atm.service';

@Component({
  selector: 'app-atm',
  templateUrl: './atm.component.html',
  styleUrls: ['./atm.component.css']
})
export class AtmComponent implements OnInit {

  @Input()
  view: number = 1;
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  atmID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();

  atms = [];
  atmsAll = [];
  atm = {
      atm_ID: 0,
      ATM_DESCRIPTION: "",
      isactive:true,
  }

  constructor(
    private atmservice: AtmService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router : Router,
  ) { }

  ngOnInit(): void {
    this.atms = JSON.parse(window.sessionStorage.getItem('atms'));
    this.atmsAll = JSON.parse(window.sessionStorage.getItem('atmsAll'));
    if (this.view == 1 && this.disabled == false && this.atms == null) {
      this.atmGet();
    } else if (this.view == 1 && this.disabled == true && this.atmsAll == null) {
      this.atmGetAll();
    } else if (this. view == 2 && this.atmsAll == null) {
      this.atmGetAll();
    }

    if (this.atmID != 0 && !this.atmID && Number(window.sessionStorage.getItem('atm'))>0) {
      this.atmID = Number(window.sessionStorage.getItem('atm'));
    }

    if (this.view == 5 && this.atmID) {
      window.sessionStorage.setItem("atm", this.atmID);
      this.atmGetOne(this.atmID);
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
          onClick: this.atmGetAll.bind(this),
        },
      }
    );
  }

  add() {
    this.atm = {
      atm_ID: 0,
      ATM_DESCRIPTION: "",
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

  atmEdit(){
    this.disabled = false;
  }

  atmCancel() {
    this.disabled = true;
    if (this.atm.atm_ID==0) {
      this.router.navigate(["/home/atm "], {});
    }
  }

  setAtm(response) {
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.atm = response;
  }

  setAtms(response) {
    if ((this.view == 1 || this.view == 11)  && this.disabled == false) {
      this.atms = response;
      window.sessionStorage.setItem("atms", JSON.stringify(this.atms));
    } else {
      this.atmsAll = response;
      window.sessionStorage.setItem("atmsAll", JSON.stringify(this.atmsAll));
    }
    this.cancel.next();
  }

  atmGet() {
    this.atmservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setAtms(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  atmGetAll() {
    this.atmservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setAtms(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  atmGetOne(id) {
    this.disabled = true;
    this.atmservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setAtm(response);

        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  atmAdd(atm) {
    atm.isactive="Y";

    this.atmservice.add(atm).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.atm_ID) {
          this.toastrservice.success("Success", "New Atm Added");
          this.atmGetAll();
          this.setAtm(response);
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  atmUpdate(atm) {
    if (atm.isactive == true) {
      atm.isactive = "Y";
    } else {
      atm.isactive = "N";
    }
    this.atmservice.update(atm, atm.atm_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.atm_ID) {
          this.toastrservice.success("Success", " Atm Updated");
          this.atmGetAll();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }
}
