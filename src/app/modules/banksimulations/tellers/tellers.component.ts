import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OnFailService } from '../../../services/on-fail.service';
import { RouterLinkWithHref } from '@angular/router';

import { TellerComponent } from 'src/app/components/banksimulations/teller/teller.component';
import { TellerService } from 'src/app/components/banksimulations/teller/teller.service';

declare var $: any;

@Component({
  selector: 'app-tellers',
  templateUrl: './tellers.component.html',
  styleUrls: ['./tellers.component.css']
})
export class TellersComponent implements OnInit {
  @ViewChild("tellers") tellers: TellerComponent;
  @ViewChild("addteller") addteller: TellerComponent;
  @ViewChild("editteller") editteller: TellerComponent;

  constructor(
    private tellerservice: TellerService,
    private toastrservice: ToastrService,
    private onfailservice: OnFailService,
  ) { }

  ngOnInit(): void {
  }

  view() {
  }

  addNew() {
    this.addteller.add();
    $("#add").modal("show");
  }

  edit(row) {
    this.editteller.teller = {
      teller_ID: row.data.teller_ID,
      teller_NAME:row.data.teller_NAME,
      teller_ADDRESS:row.data.teller_ADDRESS,
      teller_MOBNO:row.data.teller_MOBNO,
      isactive: row.data.isactive
    };
    if (row.data.isactive=="Y") {
      this.editteller.teller.isactive = true;
    } else {
      this.editteller.teller.isactive = false;
    }
    $("#edit").modal("show");
  }

  cancel() {
    $("#add").modal("hide");
    $("#edit").modal("hide");
  }

}
