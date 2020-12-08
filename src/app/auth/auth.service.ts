import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User, UserDTO } from './user.model';


export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor(private http: HttpClient) { }


    user = new BehaviorSubject<User>(null);


    apiKey = 'AIzaSyA_Aa8P3roWV_yOP4coP7y0cpsBN7k1Yhc';
    signUpUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`;
    signInUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`;

    signUp(email: string, password: string): Observable<AuthResponseData> {
        return this.http
            .post<AuthResponseData>(this.signUpUrl, new UserDTO(email, password, true))
            .pipe(
                catchError(this.handleError),
                tap(this.handleAuthentication.bind(this))
            );
    }

    login(email: string, password: string): Observable<AuthResponseData> {
        return this.http
            .post<AuthResponseData>(this.signInUrl, new UserDTO(email, password, true))
            .pipe(
                catchError(this.handleError),
                tap(this.handleAuthentication.bind(this))
            );
    }

    private handleAuthentication(resData: AuthResponseData): void {
        const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
        const user = new User(
            resData.localId,
            resData.email,
            resData.idToken,
            expirationDate
        );

        this.user.next(user);
    }

    private handleError(errorRes: HttpErrorResponse): Observable<never> {
        let errorMessage = 'An unknown error occurred.';
        if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
        }

        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This email already exists.';
                break;
            case 'EMAIL_NOT_FOUND':
            case 'INVALID_PASSWORD':
                errorMessage = 'Invalid email or password.';
                break;
        }

        return throwError(errorMessage);
    }
}
