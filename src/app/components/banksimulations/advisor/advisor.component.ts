import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';

import { AdvisorService } from '../advisor/advisor.service';

@Component({
  selector: 'app-advisor',
  templateUrl: './advisor.component.html',
  styleUrls: ['./advisor.component.css']
})
export class AdvisorComponent implements OnInit {

  @Input()
  view: number = 1;
  @Input()
  iscompulsory: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  all: boolean = false;
  @Input()
  advisorID = null;

  @Output() edit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() show = new EventEmitter();

  advisors = [];
  advisorsAll = [];
  advisor = {
      advisor_ID: 0,
      advisor_MOBNO: "",
      advisor_NAME: "",
      advisor_ADDRESS: "",
      isactive:true,
  }

  constructor(
    private advisorservice: AdvisorService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
    private router : Router,
  ) { }

  ngOnInit(): void {
    this.advisors = JSON.parse(window.sessionStorage.getItem('advisors'));
    this.advisorsAll = JSON.parse(window.sessionStorage.getItem('advisorsAll'));
    if (this.view == 1 && this.disabled == false && this.advisors == null) {
      this.advisorGet();
    } else if (this.view == 1 && this.disabled == true && this.advisorsAll == null) {
      this.advisorGetAll();
    } else if (this. view == 2 && this.advisorsAll == null) {
      this.advisorGetAll();
    }

    if (this.advisorID != 0 && !this.advisorID && Number(window.sessionStorage.getItem('advisor'))>0) {
      this.advisorID = Number(window.sessionStorage.getItem('advisor'));
    }

    if (this.view == 5 && this.advisorID) {
      window.sessionStorage.setItem("advisor", this.advisorID);
      this.advisorGetOne(this.advisorID);
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
          onClick: this.advisorGetAll.bind(this),
        },
      }
    );
  }

  add() {
    this.advisor = {
      advisor_ID: 0,
      advisor_MOBNO: "",
      advisor_NAME: "",
      advisor_ADDRESS: "",
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

  advisorEdit(){
    this.disabled = false;
  }

  advisorCancel() {
    this.disabled = true;
    if (this.advisor.advisor_ID==0) {
      this.router.navigate(["/home/advisor "], {});
    }
  }

  setAdvisor(response) {
    if (response.isactive == "Y") {
      response.isactive = true;
    } else {
      response.isactive = false;
    }
    this.advisor = response;
  }

  setAdvisors(response) {
    if ((this.view == 1 || this.view == 11)  && this.disabled == false) {
      this.advisors = response;
      window.sessionStorage.setItem("advisors", JSON.stringify(this.advisors));
    } else {
      this.advisorsAll = response;
      window.sessionStorage.setItem("advisorsAll", JSON.stringify(this.advisorsAll));
    }
    this.cancel.next();
  }

  advisorGet() {
    this.advisorservice.get().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setAdvisors(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  advisorGetAll() {
    this.advisorservice.getAll().subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setAdvisors(response);
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  advisorGetOne(id) {
    this.disabled = true;
    this.advisorservice.getOne(id).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else{
          this.setAdvisor(response);

        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  advisorAdd(advisor) {
    advisor.isactive="Y";

    this.advisorservice.add(advisor).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.advisor_ID) {
          this.toastrservice.success("Success", "New Advisor Added");
          this.advisorGetAll();
          this.setAdvisor(response);
          this.disabled = true;
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }

  advisorUpdate(advisor) {
    if (advisor.isactive == true) {
      advisor.isactive = "Y";
    } else {
      advisor.isactive = "N";
    }
    this.advisorservice.update(advisor, advisor.advisor_ID).subscribe(response => {
      if (response) {
        if (response.error && response.status) {
          this.toastrservice.warning("Message", " " + response.message);
        } else if (response.advisor_ID) {
          this.toastrservice.success("Success", " Advisor Updated");
          this.advisorGetAll();
        } else {
          this.toastrservice.error("Some thing went wrong");
        }
      }
    }, error => {
      this.onfailservice.onFail(error);
    })
  }
}
