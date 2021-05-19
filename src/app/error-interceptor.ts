import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ErrorComponent } from "./error/error.component";


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private dialog: MatDialog) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        //we can listen to the reponse I don't want to edit the request, want to listen to the response
        // handle gives us back the response observable stream and we can just hook into the stream and listen the events
        //useing pipe provided by rxjs to add an operator to the stream and catchError() provided by rxjs
        return next.handle(req).pipe(catchError((error: HttpErrorResponse) => {
            // we are adding something to the observable stream, handling it in the diff places of our app
            // return an observable inside of the catchError even if we have an error , can use throwError(), will generate a new observable to which we can pass error
            console.log(`HttpErrorResponse`);
            console.log(error);
            //alert(error.error.message);
            //we need to pass that message to the error component
            let errorMessage = "An unknown error occurred!";
            if (error.error.message) {
                errorMessage = error.error.message;
            }
            this.dialog.open(ErrorComponent, { data: { message: errorMessage } });
            return throwError(error);
        }));
    }
}