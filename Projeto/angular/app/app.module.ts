import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }   from './app.component';
import {AuthenticationModule} from "./authentication/authentication.module";
import {AppRoutingModule} from "./app.routing.module";

@NgModule({
  imports:      [ BrowserModule, AuthenticationModule, AppRoutingModule],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }