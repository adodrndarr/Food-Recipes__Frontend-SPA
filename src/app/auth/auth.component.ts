import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';


@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {
    constructor(private fb: FormBuilder, private authService: AuthService,
        private router: Router, private componentFactoryResolver: ComponentFactoryResolver
    ) { }


    @ViewChild(PlaceholderDirective, { static: false }) alertHost: PlaceholderDirective;
    private closeAlertSub: Subscription;

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
        if (!this.authForm.valid) {
            return;
        }

        const { email, password } = this.authForm.value;
        this.isLoading = true;
        let authObs: Observable<AuthResponseData>;

        if (this.isLoginMode) {
            authObs = this.authService.login(email, password);
        }
        else {
            authObs = this.authService.signUp(email, password);
        }

        authObs.subscribe(
            (responseData) => {
                console.log(`A new user has been logged in or signed up! \nAuthResponseData: `);
                console.log(responseData);

                this.isLoading = false;
                this.error = null;

                this.router.navigate(['/recipes']);
                this.authForm.reset();
            },
            errorMessage => {
                console.log(errorMessage);

                this.error = errorMessage;
                this.isLoading = false;
                // this.showErrorAlert();
            }
        );
    }

    onHandleError(): void {
        this.error = null;
    }

    private showErrorAlert(): void {
        // const alertComponent = new AlertComponent(); not the way to create programmatically a component
        const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);

        const hostViewContainerRef = this.alertHost.viewContainerRef;
        hostViewContainerRef.clear();

        const alertComponentRef = hostViewContainerRef.createComponent(alertComponentFactory);
        alertComponentRef.instance.message = this.error;
        this.closeAlertSub = alertComponentRef.instance.closeAlert.subscribe(
            () => {
                this.closeAlertSub.unsubscribe();
                hostViewContainerRef.clear();
            }
        );
    }

    ngOnDestroy(): void {
        if (this.closeAlertSub) {
            this.closeAlertSub.unsubscribe();
        }
    }
}
