import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { RouterLinkWithHref } from '@angular/router';

import { AtmComponent } from 'src/app/components/banksimulations/atm/atm.component';
import { AtmService } from 'src/app/components/banksimulations/atm/atm.service';

declare var $: any;

@Component({
  selector: 'app-atms',
  templateUrl: './atms.component.html',
  styleUrls: ['./atms.component.css']
})
export class AtmsComponent implements OnInit {
  @ViewChild("atms") atms: AtmComponent;
  @ViewChild("addatm") addatm: AtmComponent;
  @ViewChild("editatm") editatm: AtmComponent;

  constructor(
    private atmservice: AtmService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
  }

  view() {
  }

  addNew() {
    this.addatm.add();
    $("#add").modal("show");
  }

  edit(row) {
    this.editatm.atm = {
      atm_ID: row.data.atm_ID,
      ATM_DESCRIPTION:row.data.ATM_DESCRIPTION,
      isactive: row.data.isactive
    };
    if (row.data.isactive=="Y") {
      this.editatm.atm.isactive = true;
    } else {
      this.editatm.atm.isactive = false;
    }
    $("#edit").modal("show");
  }

  cancel() {
    $("#add").modal("hide");
    $("#edit").modal("hide");
  }

}
