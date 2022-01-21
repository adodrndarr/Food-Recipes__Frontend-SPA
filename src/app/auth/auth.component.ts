import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { AuthResponseData } from '../models/auth-response-data.model';


@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit {
    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) { }


    authForm: FormGroup;
    isLoginMode = true;
    isLoading = false;
    error: string = null;

    ngOnInit(): void {
        this.authForm = this.fb.group({
            'email': [null, Validators.required],
            'password': [null, Validators.compose([Validators.required, Validators.minLength(6)])]
        });
    }

    onSwitchMode(): void {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(): void {
        if (!this.authForm.valid)
            return;

        const { email, password } = this.authForm.value;
        this.isLoading = true;
        let authObs: Observable<AuthResponseData>;

        if (this.isLoginMode)
            authObs = this.authService.login(email, password);
        else
            authObs = this.authService.signUp(email, password);

        this.handleAuthResponse(authObs);
    }

    private handleAuthResponse(authObs: Observable<AuthResponseData>) {
        authObs.subscribe(
            (responseData) => {
                console.log(`A new user has been logged in or signed up! \nAuthResponseData: `);
                console.log(responseData);

                this.isLoading = false;
                this.error = null;

                this.router.navigate(['/recipes']);
                this.authForm.reset();
            },
            error => {
                console.log(error);

                this.error = error;
                this.isLoading = false;
            }
        );
    }
}
