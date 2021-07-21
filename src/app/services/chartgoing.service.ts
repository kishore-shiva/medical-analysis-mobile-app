import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { AbnormalHistoryComponent } from '../abnormal-history/abnormal-history.component';

@Injectable({
  providedIn: 'root'
})
export class ChartgoingService {

  chartState = false;
  ChartSubject = new Subject<boolean>();

  private abnormal_values_subject = new BehaviorSubject([]);
  private chart_speed = new BehaviorSubject(0);

  chartStarted = false;

  abnormal_values = [];

  setChartSpeed(speed : Number){
    this.chart_speed.next(Number(speed));
  }
  getChartSpeed(): Observable<Number>{
    return this.chart_speed.asObservable();
  }

  setChartOff(){
    this.ChartSubject._isScalar = false;
    this.ChartSubject.next(false);
    this.chartState = false;
  }
  setChartOn(){
    this.ChartSubject._isScalar = true;
    this.ChartSubject.next(true);
    this.chartState = true;
  }
  getChartOn(){
    return this.ChartSubject.asObservable();
  }

  setAbnormal_value(topic: String, time: Number, observed_rate: number){
    this.abnormal_values.push({'topic': topic, 'observed_rate' : observed_rate, 'time' : time});
    this.abnormal_values_subject.next(this.abnormal_values);
    this.getAbnormalValue().subscribe(d => {console.log(d)});
  }

  getAbnormalValue(): Observable<any[]>{
    return this.abnormal_values_subject.asObservable();
  }

  constructor() { }
}
