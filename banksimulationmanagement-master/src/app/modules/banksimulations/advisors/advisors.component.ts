import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { RouterLinkWithHref } from '@angular/router';

import { AdvisorComponent } from 'src/app/components/banksimulations/advisor/advisor.component';
import { AdvisorService } from 'src/app/components/banksimulations/advisor/advisor.service';

declare var $: any;

@Component({
  selector: 'app-advisors',
  templateUrl: './advisors.component.html',
  styleUrls: ['./advisors.component.css']
})
export class AdvisorsComponent implements OnInit {
  @ViewChild("advisors") advisors: AdvisorComponent;
  @ViewChild("addadvisor") addadvisor: AdvisorComponent;
  @ViewChild("editadvisor") editadvisor: AdvisorComponent;

  constructor(
    private advisorservice: AdvisorService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
  }

  view() {
  }

  addNew() {
    this.addadvisor.add();
    $("#add").modal("show");
  }

  edit(row) {
    this.editadvisor.advisor = {
      advisor_ID: row.data.advisor_ID,
      advisor_NAME:row.data.advisor_NAME,
      advisor_ADDRESS:row.data.advisor_ADDRESS,
      advisor_MOBNO:row.data.advisor_MOBNO,
      isactive: row.data.isactive
    };
    if (row.data.isactive=="Y") {
      this.editadvisor.advisor.isactive = true;
    } else {
      this.editadvisor.advisor.isactive = false;
    }
    $("#edit").modal("show");
  }

  cancel() {
    $("#add").modal("hide");
    $("#edit").modal("hide");
  }

}
