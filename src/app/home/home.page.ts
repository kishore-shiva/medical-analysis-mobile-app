import { Component, OnInit } from '@angular/core';
import { ChartgoingService } from '../services/chartgoing.service';
import { SocketserviceService } from '../services/socketservice.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  passerrMsg = "";

  testmsg = "asdasd";

  ChartService: any = false;
  selectValue: String;

  loading = false;

  ngOnInit(): void{

    this.http.get('http://192.168.1.32:9001/see', {}, {})
    .then(data => {
      this.testmsg = data.data["name"]
      console.log(data.status);
      console.log(JSON.stringify(data.data)); // data received by server
      console.log(data.headers);

    })
    .catch(error => {

      this.testmsg = "error";
      console.log(JSON.stringify(error));
      console.log(error.status);
      console.log(error.error); // error message as string
      console.log(error.headers);

    });

    //chekcing for previous patient login from local storage:
    var user_details = JSON.parse(localStorage.getItem("userDetails"));
    if(user_details != null){
      console.log("user details is : "+user_details["username"]);
      this.router.navigate(['/chart']);
    }

    //checking for previous doctor login from localstorage
    var doctor_details = JSON.parse(localStorage.getItem("doctorDetails"));
    if(doctor_details != null){
      this.router.navigate(['/patientslist'])
    }

    var nurse_details = JSON.parse(localStorage.getItem("nurseDetails"));
    if(nurse_details != null){
      this.router.navigate(['/patientslist'])
    }

    this.selectValue = "patient";
    this.socketService.listen().subscribe((data) => {
      console.log("from socket server: "+data['Saturation']);
    });
    console.log(this.ChartService);
    this.chartService.setChartSpeed(1);
  }

  constructor(private chartService: ChartgoingService, private socketService: SocketserviceService, private router: Router, private alertCtrl: AlertController, private http: HTTP) {
  }

  onChange(){
    console.log(this.selectValue);
  }

  async serverdownMessage(message){
    const confirm = await this.alertCtrl.create({
      header: 'Server Down!',
      message: message,
      buttons: [
        {
          text: 'ok',
          role: 'cancel',
          handler: () => {
            console.log('Confirm Cancel');
          }
        },
      ]
    });
    await confirm.present();
  }

  login(){
    var username = (document.getElementById("username") as HTMLInputElement).value;
    var password = (document.getElementById("password") as HTMLInputElement).value;

    if(username == "" && password == ""){
      this.passerrMsg = "*username and password required";
    }
    else if(username == ""){
      this.passerrMsg = "*username required";
    }
    else if(password == ""){
      this.passerrMsg = "*password requried";
    }
    else{
      this.passerrMsg = "";
      if(this.selectValue == "patient"){
        this.loading = true;
        this.socketService.loginPatient(username, password).subscribe((data) => {
          if(data == null){
            this.passerrMsg = "invalid username or password";
            this.loading = false;
          }
          else{
          console.log('logged in value is : '+ data);
          this.loading = false;
          localStorage.setItem("userDetails", JSON.stringify(data));
          localStorage.setItem("patientDetails", JSON.stringify(data));
          this.router.navigate(['/chart']);
          }
        }, (error) => {
          console.log("server down"); this.loading = false;
          this.serverdownMessage(JSON.stringify(error));
        })
      }
      else if(this.selectValue == "doctor"){

        this.socketService.loginDoctor(username, password).subscribe((data) => {
          if(data == null){
            this.passerrMsg = "invalid username or password";
            this.loading = false;
          }else{
            this.loading = true;
            localStorage.setItem("doctorDetails", JSON.stringify(data));
            this.socketService.getPatientsbyDoctor(data["id"]).subscribe((data) => {
              console.log('patient details is :'+data.length);
              localStorage.setItem("patientslist", JSON.stringify(data));
              this.loading = false;
              this.router.navigate(['/patientslist'])
          });
          }
        },(error) => {
          console.log("server down"); this.loading = false;
          this.serverdownMessage(JSON.stringify(error));
        })
      }
      else{
        this.socketService.loginNurse(username, password).subscribe((data) => {
          if(data == null){
            this.passerrMsg = "invalid username or password";
            this.loading = false;
          }
          else{
          console.log('logged in value is : '+data["patients"]);

          // This service function returns the full patients details from the patients model searching from nurse["patients"] field:
          this.socketService.getPatientsbyNurse(data["patients"]).subscribe((data) => {
            localStorage.setItem("patientslist", JSON.stringify(data));
            this.router.navigate(['/patientslist'])
          })

          }
        },(error) => {
          console.log("server down"); this.loading = false;
          this.serverdownMessage(JSON.stringify(error));
        })
      }
    }
  }
}
