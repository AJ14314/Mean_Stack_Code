import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";

import { AuthData } from "./auth-data.model";
import { LoginData } from "./login-data.model";

@Injectable({ providedIn: 'root' })
export class AuthService {
    private isAuthenticated = false;
    private token: string;
    private tokenTimer: any;
    private authStatusListener = new Subject<boolean>();

    constructor(private httpClient: HttpClient, private router: Router) { }

    getToken() {
        return this.token;
    }

    //return only observable part of the listener so that we cannot emit new values from other components
    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    getIsAuth() {
        return this.isAuthenticated;
    }

    createUser(email: string, password: string, username: string) {
        const authData: AuthData = {
            username: username, email: email, password: password
        }
        this.httpClient.post("http://localhost:3000/api/user/signup", authData).subscribe(response => {
            console.log(`response signup`);
            console.log(response);
        })
    }

    login(email: string, password: string) {
        const loginData: LoginData = {
            email: email, password: password
        }
        this.httpClient.post<{ token: string, expiresIn: number }>("http://localhost:3000/api/user/login", loginData).subscribe(response => {
            console.log(response.token);

            const token = response.token;
            this.token = token;
            if (token) {
                const expiresInDuration = response.expiresIn; //seconds
                this.setAuthTimer(expiresInDuration);
                this.isAuthenticated = true;
                this.authStatusListener.next(true);
                const now = new Date();
                const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                console.log(expirationDate);
                this.saveAuthData(token, expirationDate);
                this.router.navigate(['/']);
            }

        });
    }

    //app component is the great place to run this method because that component will load initially
    autoAuthUser() {
        const authInformation = this.getAuthData();
        // console.log(authInformation, authInformation.expirationDate.getTime() - now.getTime());
        if (authInformation) {
            const now = new Date();
            const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
            if (expiresIn > 0) {//date is in the future
                this.token = authInformation.token;
                this.isAuthenticated = true;
                this.setAuthTimer(expiresIn / 1000);
                this.authStatusListener.next(true);
            }
        }
    }

    logout() {

        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer); //clearing the timeout
        this.clearAuthData();
        this.router.navigate(['/']);
    }

    private setAuthTimer(duration: number) {
        console.log(`setting timer ${duration}`);
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000); //argument milliseconds
    }

    private saveAuthData(token: string, expirationDate: Date) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
    }

    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
    }

    private getAuthData() {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        if (!token || !expirationDate) {
            return;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate)
        }
    }
}