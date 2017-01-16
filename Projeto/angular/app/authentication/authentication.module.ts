import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AuthenticationComponent}  from './authentication.component';
import {FormsModule, ReactiveFormsModule}   from '@angular/forms';
import {RouterModule} from "@angular/router";

@NgModule({
    imports: [BrowserModule, FormsModule, ReactiveFormsModule, RouterModule],
    declarations: [AuthenticationComponent],
    exports: [AuthenticationComponent]
})
export class AuthenticationModule {
}