import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";

import { PostCreateComponent } from './post-create/post-create.component';
import { AngularMaterialModule } from "../angular-material.module";
import { PostListComponent } from "./post-list/post-list.component";


//declare all the components used in the post related feature
@NgModule({
    declarations: [PostCreateComponent, PostListComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AngularMaterialModule,
        RouterModule
    ]
})
export class PostModule { }