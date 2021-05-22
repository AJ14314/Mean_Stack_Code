import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { CommonModule } from "@angular/common";

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AngularMaterialModule } from "../angular-material.module";
import { AuthRoutingModule } from "./auth-routing.module";
import { ProfileComponent } from "./profile/profile.component";


@NgModule({
    declarations: [
        LoginComponent,
        SignupComponent,
        ProfileComponent
    ],
    imports: [
        CommonModule,
        AngularMaterialModule,
        RouterModule,
        FormsModule,
        AuthRoutingModule
    ]
})
export class AuthModule {

}