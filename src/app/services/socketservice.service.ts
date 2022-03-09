import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subscriber, BehaviorSubject, ObservableLike } from 'rxjs';
import {io} from 'socket.io-client';
import { baseurl } from '../shared/baseurl';

@Injectable({
  providedIn: 'root'
})
export class SocketserviceService {

  httpHeader = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  socket: any;
  readonly url: string = 'http://localhost:9002';

  constructor(private http: HttpClient) {
    this.socket = io(this.url)
   }

   listen(){
     return new Observable((subscriber) => {
       this.socket.on('kishore-tells', data => {
         subscriber.next(data);
       })
     });
   }

  //Login services
  loginPatient(user: String, pass: String): Observable<any>{
    return this.http.post(baseurl+'/loginpatient', {"username": user, "password": pass}, this.httpHeader);
  }
  loginDoctor(user: String, pass: String): Observable<any>{
    return this.http.post(baseurl+'/logindoctor', {"username": user, "password": pass});
  }
  loginNurse(user: String, pass: String): Observable<any>{
    return this.http.post(baseurl+'/loginnurse', {"username": user, "password": pass});
  }

  //gets the list of patients by doctor & nurse id
  getPatientsbyDoctor(id: String): Observable<any>{
    return this.http.post(baseurl+'/getpatients', {"doc_id": id});
  }
  getPatientsbyNurse(patients: []): Observable<any>{
    return this.http.post(baseurl+'/getnursepatients', { "patients" : patients });
  }

  //insert and get abnormal values for abnormality history:
  insertAbnormality(patient_id, time, date, abnormality_type, abnormal_value, graph_x, graph_y): Observable<any>{
    return this.http.post(baseurl+'/insertabnormal', {"patient_id":patient_id, "time":time, "date":date, "abnormality_type":abnormality_type
    , "abnormal_value":abnormal_value, "graph_x":graph_x, "graph_y":graph_y});
  }
  getAbnormalityRecord(patient_id): Observable<any>{
    return this.http.post(baseurl+'/getabnormal', {"patient_id" : patient_id});
  }
}
