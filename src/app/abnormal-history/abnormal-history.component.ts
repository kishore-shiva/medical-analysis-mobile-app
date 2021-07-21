import { Component, OnInit } from '@angular/core';
import { ChartgoingService } from '../services/chartgoing.service';
import { SocketserviceService } from '../services/socketservice.service';
import {MatDialog} from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-abnormal-history',
  templateUrl: './abnormal-history.component.html',
  styleUrls: ['./abnormal-history.component.scss'],
})
export class AbnormalHistoryComponent implements OnInit {

  abnormal_values;

  constructor(private chartService: ChartgoingService, private router: Router, private dialog: MatDialog, private socketService: SocketserviceService) { }

  ngOnInit() {
    var patientDetails = JSON.parse(localStorage.getItem('patientDetails'));
    this.socketService.getAbnormalityRecord(patientDetails["id"]).subscribe((data) => { this.abnormal_values = data; })
  }

  openDialog(abnormal) {
    localStorage.setItem('currentHistoryChart', JSON.stringify(abnormal));
    this.dialog.open(DialogElementsExampleDialog);
  }

  getAbnormalValue(){
    //this.abnormal_values = this.chartService.getAbnormalValue();
  }

}

@Component({
  selector: 'dialog-elements-example-dialog',
  templateUrl: './chart_dialog.html',
})
export class DialogElementsExampleDialog {
  constructor(private dialog: MatDialog) {
   }

  abnormal_chart;

  close(){
    this.dialog.closeAll();
  }
  ngOnInit(): void{
    var abnormal_values = JSON.parse(localStorage.getItem('currentHistoryChart'));
    try{
      this.abnormal_chart = new Chart("abnormality", {
        type: 'line',
        data: {
          labels: abnormal_values['graph_x'],
          datasets: [
            {
              data: abnormal_values['graph_y'],
              label: 'Saturation',
              borderColor: 'blue',
              fill: false,
            },
          ],
        },
        options: {
          title: {
            display: true,
            text: 'Abnormal Saturation',
          },
        },
      });
    }
    catch(e){
      console.log('error in creating the abnormal chart')
    }
  }
}
