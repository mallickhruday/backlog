﻿import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { LoginComponent } from "./login.component";
import { LoginMasterPageComponent } from "./login-master-page.component";

const declarables = [
    LoginComponent,
    LoginMasterPageComponent
];

const providers = [];

const ROUTES: Array<any> = [
    {
        path: '',
        component: LoginMasterPageComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        RouterModule.forChild(ROUTES),
        SharedModule
    ],
    exports: [declarables],
    declarations: [declarables],
    providers: providers
})
export class LoginModule { }
