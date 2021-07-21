import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { baseurl } from './shared/baseurl';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { ChartComponent } from './chart/chart.component';
import { AbnormalHistoryComponent } from './abnormal-history/abnormal-history.component';
import { PatientslistComponent } from './patientslist/patientslist.component';
import { AppRoutingModule } from './app-routing.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { MatTableExporterModule } from 'mat-table-exporter';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { ChartsModule } from 'ng2-charts';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { from } from 'rxjs';

const config: SocketIoConfig = { url: 'http://192.168.1.18:9002', options: {} };

@NgModule(
  {declarations: [AppComponent, ChartComponent, AbnormalHistoryComponent, PatientslistComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    MatTableExporterModule,
    MatTableModule,
    ChartsModule,
    FlexLayoutModule,
    ScrollingModule,
    ScrollingModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatDialogModule,
  ],
  exports: [
    ChartsModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  {provide: 'BaseURL', useValue: baseurl}],
  bootstrap: [AppComponent],
})
export class AppModule {}
