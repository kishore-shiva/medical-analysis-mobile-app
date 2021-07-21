import { localizedString } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patientslist',
  templateUrl: './patientslist.component.html',
  styleUrls: ['./patientslist.component.scss'],
})
export class PatientslistComponent implements OnInit {

  patients_list : any;

  constructor(private router: Router) { }

  signOut(){
    localStorage.setItem("doctorDetails", JSON.stringify(null));
    localStorage.setItem("patientslist", JSON.stringify(null));
    this.router.navigate(['/']);
  }

  openChartComponent(patient: any){
    localStorage.setItem("patientDetails",JSON.stringify(patient));
    this.router.navigate(['chart'])
  }

  ngOnInit() {
    console.log('executing patients')
    this.patients_list = JSON.parse(localStorage.getItem('patientslist'));
    //this.patients_list = [{"name" : "kishore", "id": "user 1"},{"name" : "kishore", "id": "user 1"},{"name" : "kishore", "id": "user 1"},{"name" : "kishore", "id": "user 1"},{"name" : "kishore", "id": "user 1"},{"name" : "kishore", "id": "user 1"},{"name" : "kishore", "id": "user 1"},{"name" : "kishore", "id": "user 1"},{"name" : "kishore", "id": "user 1"},{"name" : "kishore", "id": "user 1"}]
  }

}
