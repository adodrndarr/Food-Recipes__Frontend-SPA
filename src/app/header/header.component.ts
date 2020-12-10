import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

import { DataStorageService } from '../shared/data-storage.service';


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy {
    constructor(private dataStorageService: DataStorageService,
                private authService: AuthService) { }


    userSub: Subscription;
    isAuthenticated = false;

    ngOnInit(): void {
        this.userSub = this.authService.user.subscribe(
            (user) => {
                // this.isAuthenticated = !user ? false : true;
                this.isAuthenticated = !!user; // same as the above
            }
        );
    }

    onSaveData(): void {
        this.dataStorageService.storeRecipes();
    }

    onFetchData(): void {
        this.dataStorageService.fetchRecipes().subscribe();
    }

    onLogout(): void {
        this.authService.logout();
    }

    ngOnDestroy(): void {
        this.userSub.unsubscribe();
    }
}
