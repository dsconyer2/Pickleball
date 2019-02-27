import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HelpComponent } from './components/help/help.component';
import { HomeComponent } from './components/home/home.component';
import { SchedulerModule } from './features/scheduler/scheduler.module';
import { reducers } from './reducers';

@NgModule({
  declarations: [
    AppComponent,
    HelpComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatMenuModule,
    MatIconModule,
    BrowserAnimationsModule,
    FormsModule,
    SchedulerModule,
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument(),
    EffectsModule.forRoot([])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
