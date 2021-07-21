import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import * as Chart from 'chart.js';
import { ToastController } from '@ionic/angular';
import { ChartgoingService } from '../services/chartgoing.service';
import { Socket } from 'ngx-socket-io';
import { SocketserviceService } from '../services/socketservice.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})


export class ChartComponent implements OnInit {

  patientDetails;

  constructor(private router: Router ,private chartService : ChartgoingService, public toastController: ToastController, private socket: Socket, private socketService: SocketserviceService
  ,private alertCtrl: AlertController  ) { }

  //historical analysis buttin access:
  history_access = false;

  //abnormal chart variables:
  saturation_ab_chart;
  bp_sys; bp_dias; hr_chart;


  //saturation varialbles:
  abnormal_sat_iteration = 0;
  sat_abnormal_count = 0;
  high_saturation_count = 0;
  low_saturation_count = 0;

  //bp-systolic variables:
  bp_sys_iteration = 0;
  bp_sys_abnormal_count = 0;

  //bp-diastolic varialbles:
  bp_dia_iteration = 0;
  bp_dia_abnormal_count = 0;

  //heart-rate variables:
  hr_iteration = 0;
  hr_abnormal_count = 0;
  high_hr_count = 0;
  low_hr_count = 0;

  //sign out:
  async signOut(){
    const confirm = await this.alertCtrl.create({
      header: 'Sign out!',
      message: 'are you sure signing out ?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Confirm Cancel');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Confirm Okay.');
            localStorage.setItem("userDetails", null);
            localStorage.setItem("doctorDetails", null);
            localStorage.setItem("nurseDetails", null);
            this.router.navigate(['/']);
          }
        }
      ]
    });
    await confirm.present();
  }

  //Beep sound:
  playAudio(){
    let audio = new Audio();
    audio.src = "../../assets/beep.wav";
    audio.load();
    audio.play();
  }

  //Toast Messages :
  async showSaturationToast() {
    const toast = await this.toastController.create({
      color: "danger",
      position: 'middle',
      message: 'Abnormal Saturation Detected!',
      duration: 2500,
    });
    toast.present();
  }
  async showBPToast() {
    const toast = await this.toastController.create({
      color: "danger",
      position: 'middle',
      message: 'Abnormal Blood Pressure Detected!',
      duration: 2500,
    });
    toast.present();
  }
  async showHRToast() {
    const toast = await this.toastController.create({
      color: "danger",
      position: 'middle',
      message: 'Abnormal Heart Beat Rate Detected!',
      duration: 2500,
    });
    toast.present();
  }

  //showing abnomal chart functions:
  show_saturation_abnormality(saturation, time){
    try{
      this.saturation_ab_chart = new Chart("abnormal_saturation", {
        type: 'line',
        data: {
          labels: time,
          datasets: [
            {
              data: saturation,
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

  //showing bp_sys abnormality chart:
  showBPSysAbnormalChart(bp_sys, time){
    try{
      this.bp_sys = new Chart("abnormal_bp", {
        type: 'line',
        data: {
          labels: time,
          datasets: [
            {
              data: bp_sys,
              label: 'Blood Pressure',
              borderColor: 'orange',
              fill: false,
            },
          ],
        },
        options: {
          title: {
            display: true,
            text: 'Abnormal Blood Pressure(sys)',
          },
        },
      });
    }
    catch(e){
      console.log('error in creating the abnormal chart')
    }
  }

  //showing bp-dia abnormal chart:
  showBPDiaAbnormalChart(arr, time){
    try{
      this.bp_dias = new Chart("abnormal_bp_dia", {
        type: 'line',
        data: {
          labels: time,
          datasets: [
            {
              data: arr,
              label: 'Blood Pressure',
              borderColor: 'violet',
              fill: false,
            },
          ],
        },
        options: {
          title: {
            display: true,
            text: 'Abnormal Blood Pressure(dia)',
          },
        },
      });
    }
    catch(e){
      console.log('error in creating the abnormal chart')
    }
  }

  //showing heart rate abnormal chart:
  showHRAbnormalChart(arr, time){
    try{
      this.hr_chart = new Chart("abnormal_heart", {
        type: 'line',
        data: {
          labels: time,
          datasets: [
            {
              data: arr,
              label: 'Heart Rate',
              borderColor: 'red',
              fill: false,
            },
          ],
        },
        options: {
          title: {
            display: true,
            text: 'Abnormal Heart Rate',
          },
        },
      });
    }
    catch(e){
      console.log('error in creating the abnormal chart')
    }
  }

  Labels = []
  Data = []
  saturationChart = new Chart('myChart', {
    type: 'line',
    data: {
      labels: this.Labels,
      datasets: [
        {
          data: this.Data,
          label: 'Africa',
          borderColor: 'red',
          fill: false,
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: 'World population per region (in millions)',
      },
    },
  });

  // this function starts to plot the graph


  ngOnInit(): void{

    console.log('execuitin chart main')

    console.log('patient is : ',localStorage.getItem('userDetails'));
    console.log('doctor is : ',localStorage.getItem('doctorDetails'));
    console.log('nurse is : ',localStorage.getItem('nurseDetails'));


    if(localStorage.getItem('doctorDetails') != 'null' || localStorage.getItem('userDetails') != 'null'){
      this.history_access = true;
    }

    this.patientDetails = JSON.parse(localStorage.getItem("patientDetails"));

    //refreshing the local storage when app is restarted. Delete this when completed
    localStorage.setItem('sat_arr', JSON.stringify([]))
    localStorage.setItem('sat_label',JSON.stringify([]))

    localStorage.setItem('bp_sys_arr', JSON.stringify([]))

    localStorage.setItem('bp_dia_arr', JSON.stringify([]))

    localStorage.setItem('hr_arr', JSON.stringify([]));

    this.socketService.listen().subscribe((data) => {
      console.log('from socket server: '+data)

      //storing saturation in local storage array:
      let saturation_array = JSON.parse(localStorage.getItem('sat_arr'))
      let sat_label = JSON.parse(localStorage.getItem('sat_label'));

      if(saturation_array.length > 29){
        saturation_array = saturation_array.slice(saturation_array.length-30, saturation_array.length)
        sat_label = sat_label.slice(sat_label.length-30, sat_label.length)
        console.log('sat arr is : '+saturation_array)

        saturation_array.push(data['Saturation'])
        sat_label.push(data['Time']);
        localStorage.setItem('sat_arr', JSON.stringify(saturation_array))
        localStorage.setItem('sat_label', JSON.stringify(sat_label))
      }
      else{
        saturation_array.push(data['Saturation'])
        sat_label.push(data['Time'])
        console.log('sat arr is : '+saturation_array)
        localStorage.setItem('sat_arr',JSON.stringify(saturation_array))
        localStorage.setItem('sat_label', JSON.stringify(sat_label))
      }

      //updating the saturation chart:
      this.saturationChart = new Chart('myChart', {
        type: 'line',
        data: {
          labels: sat_label,
          datasets: [
            {
              data: saturation_array,
              label: 'Saturation',
              borderColor: 'red',
              fill: false,
              lineTension: 0,
            },
          ],
        },
        options: {
          animation: {
            duration: 0
          },
          title: {
            display: true,
            text: 'Saturation vs time',
          },
        },
      });

      //chekcing abnormal saturation:
      if(Number(data['Saturation']) < 80 || Number(data['Saturation']) > 100){
        console.log('abnormality detected!, abnormal count: '+this.abnormal_sat_iteration+' and count: '+this.sat_abnormal_count)

        if(Number(data['Saturation'] < 80)){ this.low_saturation_count += 1; }
        else{ this.high_saturation_count += 1; }

        this.abnormal_sat_iteration += 1;
        if(this.abnormal_sat_iteration >= 30){
          if(this.sat_abnormal_count > 14){

            //inserting abnormal values into the abnormality database:
            var average = 0;
              for(var i=0; i<saturation_array.length; i++){
                average += Number(saturation_array[i]);
              }
              average = average/saturation_array.length;
            if(this.high_saturation_count > this.low_saturation_count){
              let date: Date = new Date();
              this.socketService.insertAbnormality(this.patientDetails["id"],sat_label[sat_label.length-1],date.getDate()+'-'+(Number(date.getMonth())+1)+'-'+date.getFullYear(),"High Saturation",(''+average),sat_label,saturation_array).subscribe((data) => {console.log("inserted satuiration abnormality record")}, (error) => {console.log(error)});
            }
            else{
              let date: Date = new Date();
              this.socketService.insertAbnormality(this.patientDetails["id"],sat_label[sat_label.length-1],date.getDate()+'-'+(Number(date.getMonth())+1)+'-'+date.getFullYear(),"Low Saturation",(''+average),sat_label,saturation_array).subscribe((data) => {console.log("inserted satuiration abnormality record")}, (error) => {console.log(error)});
            }
            //ends

            this.showSaturationToast(); this.playAudio();
            this.show_saturation_abnormality(saturation_array, sat_label);
            this.sat_abnormal_count = 0; this.abnormal_sat_iteration = 0; this.high_saturation_count = 0; this.low_saturation_count = 0;
          }
          else{
            this.sat_abnormal_count = 0; this.abnormal_sat_iteration = 0; this.high_saturation_count = 0; this.low_saturation_count = 0;
          }
        }
        else{
          this.sat_abnormal_count += 1;
          this.abnormal_sat_iteration += 1;
        }
      }
      else if(this.abnormal_sat_iteration > 0){
        if(this.abnormal_sat_iteration >= 30){
          if(this.sat_abnormal_count > 14){
            var average = 0;
              for(var i=0; i<saturation_array.length; i++){
                average += Number(saturation_array[i]);
              }
              average = average/saturation_array.length;

            //inserting high or low saturation in the abnormality database
            if(this.high_saturation_count > this.low_saturation_count){
              let date: Date = new Date();
              this.socketService.insertAbnormality(this.patientDetails["id"],sat_label[sat_label.length-1],date.getDate()+'-'+(Number(date.getMonth())+1)+'-'+date.getFullYear(),"High Saturation",(''+average),sat_label,saturation_array).subscribe((data) => {console.log("inserted satuiration abnormality record")}, (error) => {console.log(error)});
            }
            else{
              let date: Date = new Date();
              this.socketService.insertAbnormality(this.patientDetails["id"],sat_label[sat_label.length-1],date.getDate()+'-'+(Number(date.getMonth())+1)+'-'+date.getFullYear(),"Low Saturation",(''+average),sat_label,saturation_array).subscribe((data) => {console.log("inserted satuiration abnormality record")}, (error) => {console.log(error)});
            }
            //ends

            this.showSaturationToast(); this.playAudio();
            this.sat_abnormal_count = 0; this.abnormal_sat_iteration = 0; this.high_saturation_count = 0; this.low_saturation_count = 0;
          }
          else{
            this.sat_abnormal_count = 0; this.abnormal_sat_iteration = 0; this.high_saturation_count = 0; this.low_saturation_count = 0;
          }
        }
        this.abnormal_sat_iteration += 1;
      }

      //checking bp_sys abnormality:
      let bp_sys_arr = JSON.parse(localStorage.getItem('bp_sys_arr'))
      if(data['BP-Systolic'] == "NA"){
        bp_sys_arr.push("120");
      }
      else{
        bp_sys_arr.push(data['BP-Systolic']);
      }
      if(bp_sys_arr.length > 29){
        bp_sys_arr = bp_sys_arr.slice(bp_sys_arr.length-30, bp_sys_arr.length);
      }
      localStorage.setItem('bp_sys_arr', JSON.stringify(bp_sys_arr))
      console.log('bp_sys_arr is : '+JSON.parse(localStorage.getItem('bp_sys_arr')))


      if(Number(data['BP-Systolic']) > 120){
        console.log('abnormality sys BP detected!, abnormal count: '+this.bp_sys_iteration+' and count: '+this.bp_sys_abnormal_count)
        this.bp_sys_iteration += 1;
        if(this.bp_sys_iteration >= 30){
          if(this.bp_sys_abnormal_count > 14){

            var average = 0;
              for(var i=0; i<bp_sys_arr.length; i++){
                average += Number(bp_sys_arr[i]);
              }
              average = average/bp_sys_arr.length;

            //inserting the abnormal value in the abnormality database:
            let date: Date = new Date();
            this.socketService.insertAbnormality(this.patientDetails["id"],sat_label[sat_label.length-1],date.getDate()+'-'+(Number(date.getMonth())+1)+'-'+date.getFullYear(),"BP-Systolic",(''+bp_sys_arr),sat_label,bp_sys_arr).subscribe((data) => {console.log("inserted bp sys abnormality record")}, (error) => {console.log(error)});
            //ends

            this.showBPToast(); this.playAudio();
            this.showBPSysAbnormalChart(bp_sys_arr, sat_label);
            this.bp_sys_abnormal_count = 0; this.bp_sys_iteration = 0;
          }
          else{
            this.bp_sys_abnormal_count = 0; this.bp_sys_iteration = 0;
          }
        }
        else{
          this.bp_sys_abnormal_count += 1;
          this.bp_sys_iteration += 1;
        }
      }
      else if(this.bp_sys_iteration > 0){
        if(this.bp_sys_iteration >= 30){
          if(this.bp_sys_abnormal_count > 14){

            var average = 0;
              for(var i=0; i<bp_sys_arr.length; i++){
                average += Number(bp_sys_arr[i]);
              }
              average = average/bp_sys_arr.length;

            //inserting the abnormal value in the abnormality database:
            let date: Date = new Date();
            this.socketService.insertAbnormality(this.patientDetails["id"],sat_label[sat_label.length-1],date.getDate()+'-'+(Number(date.getMonth())+1)+'-'+date.getFullYear(),"BP-Systolic",(''+average),sat_label,bp_sys_arr).subscribe((data) => {console.log("inserted bp sys abnormality record")}, (error) => {console.log(error)});
            //ends

            this.showBPToast(); this.playAudio();
            this.showBPSysAbnormalChart(bp_sys_arr, sat_label);
            this.bp_sys_abnormal_count = 0; this.bp_sys_iteration = 0;
          }
          else{
            this.bp_sys_abnormal_count = 0; this.bp_sys_iteration = 0;
          }
        }
        this.bp_sys_iteration += 1;
      }

    //checking bp_dia abnormality:
    let bp_dia_arr = JSON.parse(localStorage.getItem('bp_dia_arr'))
    if(data['BP-Diastolic'] == "NA"){
      bp_sys_arr.push("80");
    }
    else{
      bp_dia_arr.push(data['BP-Diastolic']);
    }
    if(bp_sys_arr.length > 29){
      bp_dia_arr = bp_dia_arr.slice(bp_dia_arr.length-30, bp_dia_arr.length);
    }
    localStorage.setItem('bp_dia_arr', JSON.stringify(bp_dia_arr))
    console.log('bp_dia_arr is : '+JSON.parse(localStorage.getItem('bp_dia_arr')))


    if(Number(data['BP-Diastolic']) > 80){
      console.log('abnormality dia BP detected!, abnormal count: '+this.bp_dia_iteration+' and count: '+this.bp_dia_abnormal_count)
      this.bp_dia_iteration += 1;
      if(this.bp_dia_iteration >= 30){
        if(this.bp_dia_abnormal_count > 14){

          var average = 0;
              for(var i=0; i<bp_dia_arr.length; i++){
                average += Number(bp_dia_arr[i]);
              }
              average = average/bp_dia_arr.length;
          //inserting abnormal values on abnormality database:
          let date: Date = new Date();
          this.socketService.insertAbnormality(this.patientDetails["id"],sat_label[sat_label.length-1],date.getDate()+'-'+(Number(date.getMonth())+1)+'-'+date.getFullYear(),"BP-Diastolic",(''+bp_dia_arr),sat_label,bp_dia_arr).subscribe((data) => {console.log("inserted bp dia abnormality record")}, (error) => {console.log(error)});
          //ends

          this.showBPToast(); this.playAudio();
          this.showBPDiaAbnormalChart(bp_dia_arr, sat_label);
          this.bp_dia_abnormal_count = 0; this.bp_dia_iteration = 0;
        }
        else{
          this.bp_dia_abnormal_count = 0; this.bp_dia_iteration = 0;
        }
      }
      else{
        this.bp_dia_abnormal_count += 1;
        this.bp_dia_iteration += 1;
      }
    }
    else if(this.bp_dia_iteration > 0){
      if(this.bp_dia_iteration >= 30){
        if(this.bp_dia_abnormal_count > 14){

          var average = 0;
              for(var i=0; i<bp_dia_arr.length; i++){
                average += Number(bp_dia_arr[i]);
              }
              average = average/bp_dia_arr.length;
          //inserting the abonrmal values in the abnormality database:
          let date: Date = new Date();
          this.socketService.insertAbnormality(this.patientDetails["id"],sat_label[sat_label.length-1],date.getDate()+'-'+(Number(date.getMonth())+1)+'-'+date.getFullYear(),"BP-Diastolic",(''+average),sat_label,bp_dia_arr).subscribe((data) => {console.log("inserted bp dia abnormality record")}, (error) => {console.log(error)});
          //ends

          this.showBPToast(); this.playAudio();
          this.showBPDiaAbnormalChart(bp_dia_arr, sat_label);
          this.bp_dia_abnormal_count = 0; this.bp_dia_iteration = 0;
        }
        else{
          this.bp_dia_abnormal_count = 0; this.bp_dia_iteration = 0;
        }
      }
      this.bp_dia_iteration += 1;
    }

    //checking heart rate abnomality:
    let hr_arr = JSON.parse(localStorage.getItem('hr_arr'))
    hr_arr.push(data['Heart-Rate']);
    if(hr_arr.length > 29){
      hr_arr = hr_arr.slice(hr_arr.length-30, hr_arr.length);
    }
    localStorage.setItem('hr_arr', JSON.stringify(hr_arr))
    console.log('hr_arr is : '+JSON.parse(localStorage.getItem('hr_arr')))


    if(Number(data['Heart-Rate']) > 80 || Number(data['Heart-Rate']) < 60){

      if(Number(data['Heart-Rate'] > 80)){ this.high_hr_count += 1; }
      else{ this.low_hr_count += 1; }

      console.log('abnormality heart rate detected!, abnormal count: '+this.hr_iteration+' and count: '+this.hr_abnormal_count)
      this.hr_iteration += 1;
      if(this.hr_iteration >= 30){
        if(this.hr_abnormal_count > 14){

          //inserting high or low heart rate into the abnormality record database
          if(this.high_hr_count > this.low_hr_count){
            var average = 0;
              for(var i=0; i<hr_arr.length; i++){
                average += Number(hr_arr[i]);
              }
              average = average/hr_arr.length;
            let date: Date = new Date();
            this.socketService.insertAbnormality(this.patientDetails["id"],sat_label[sat_label.length-1],date.getDate()+'-'+(Number(date.getMonth())+1)+'-'+date.getFullYear(),"High Heart Rate",(''+average),sat_label,hr_arr).subscribe((data) => {console.log("inserted high hr abnormality record")}, (error) => {console.log(error)});
          }
          else{
            let date: Date = new Date();
            this.socketService.insertAbnormality(this.patientDetails["id"],sat_label[sat_label.length-1],date.getDate()+'-'+(Number(date.getMonth())+1)+'-'+date.getFullYear(),"Low Heart Rate",(''+average),sat_label,hr_arr).subscribe((data) => {console.log("inserted low hr abnormality record")}, (error) => {console.log(error)});
          }
          //ends

          this.showHRToast(); this.playAudio();
          this.showHRAbnormalChart(hr_arr, sat_label);
          this.hr_abnormal_count = 0; this.hr_iteration = 0; this.high_hr_count = 0; this.low_hr_count = 0;
        }
        else{
          this.hr_abnormal_count = 0; this.hr_iteration = 0; this.high_hr_count = 0; this.low_hr_count = 0;
        }
      }
      else{
        this.hr_abnormal_count += 1;
        this.hr_iteration += 1;
      }
    }
    else if(this.hr_iteration > 0){
      if(this.hr_iteration >= 30){
        if(this.hr_abnormal_count > 14){

          //inserting high or low heart rate into the abnormality record database
          if(this.high_hr_count > this.low_hr_count){
            var average = 0;
              for(var i=0; i<hr_arr.length; i++){
                average += Number(hr_arr[i]);
              }
              average = average/hr_arr.length;
            let date: Date = new Date();
            this.socketService.insertAbnormality(this.patientDetails["id"],sat_label[sat_label.length-1],date.getDate()+'-'+(Number(date.getMonth())+1)+'-'+date.getFullYear(),"High Heart Rate",(''+average),sat_label,hr_arr).subscribe((data) => {console.log("inserted high hr abnormality record")}, (error) => {console.log(error)});
          }
          else{
            let date: Date = new Date();
            this.socketService.insertAbnormality(this.patientDetails["id"],sat_label[sat_label.length-1],date.getDate()+'-'+(Number(date.getMonth())+1)+'-'+date.getFullYear(),"Low Heart Rate",(''+average),sat_label,hr_arr).subscribe((data) => {console.log("inserted low hr abnormality record")}, (error) => {console.log(error)});
          }
          //ends

          this.showHRToast(); this.playAudio();
          this.showHRAbnormalChart(hr_arr, sat_label);
          this.hr_abnormal_count = 0; this.hr_iteration = 0; this.high_hr_count = 0; this.low_hr_count = 0;
        }
        else{
          this.hr_abnormal_count = 0; this.hr_iteration = 0; this.high_hr_count = 0; this.low_hr_count = 0;
        }
      }
      this.hr_iteration += 1;
    }
    })

    //top saturation chart:
    this.saturationChart = new Chart('myChart', {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            data: [],
            label: 'Saturation',
            borderColor: 'red',
            fill: false,
            lineTension: 0,
          },
        ],
      },
      options: {
        animation: {
          duration: 0
        },
        title: {
          display: true,
          text: 'Saturation vs time',
        },
      },
    });


    //showing the abnormality graph:
    try{
      this.saturation_ab_chart = new Chart("abnormal_saturation", {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            {
              data: [],
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

    //intital graph for bp systolic:
    try{
      this.bp_sys = new Chart("abnormal_bp", {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            {
              data: [],
              label: 'Blood Pressure',
              borderColor: 'orange',
              fill: false,
            },
          ],
        },
        options: {
          title: {
            display: true,
            text: 'Abnormal Blood Pressure(sys)',
          },
        },
      });
    }
    catch(e){
      console.log('error in creating the abnormal chart')
    }

    // graph for abnormal bp diastolic
    try{
      this.bp_dias = new Chart("abnormal_bp_dia", {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            {
              data: [],
              label: 'Blood Pressure',
              borderColor: 'violet',
              fill: false,
            },
          ],
        },
        options: {
          title: {
            display: true,
            text: 'Abnormal Blood Pressure(dia)',
          },
        },
      });
    }
    catch(e){
      console.log('error in creating the abnormal chart')
    }

    // graph for abnormal heart rate
    try{
      this.hr_chart = new Chart("abnormal_heart", {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            {
              data: [],
              label: 'Heart Rate',
              borderColor: 'red',
              fill: false,
            },
          ],
        },
        options: {
          title: {
            display: true,
            text: 'Abnormal Heart Rate',
          },
        },
      });
    }
    catch(e){
      console.log('error in creating the abnormal chart')
    }

    /**if(this.chartService.chartStarted == false){
      this.startGraph();
    }**/
}

}
