import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }
    //works like middleware
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const authToken = this.authService.getToken(); //we need to inject auth service to get the token in this service
        //clone the request before modifying
        const authRequest = req.clone({
            headers: req.headers.set('Authorization', "Bearer " + authToken)//add new headers to existing one
        });
        return next.handle(authRequest);
    }
}