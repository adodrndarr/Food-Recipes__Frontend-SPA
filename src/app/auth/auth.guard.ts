import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        boolean |
        UrlTree |
        Observable<boolean | UrlTree> |
        Promise<boolean | UrlTree> {
        return this.authService.user
            .pipe(
                take(1), // Take latest user value and unsubscribe
                map(user => {
                    const isAuthenticated = !!user;
                    if (!isAuthenticated) {
                        return this.router.createUrlTree(['/auth']);
                    }

                    return true;
                })
                // tap(isAuth => { -- Older approach
                //     if (!isAuth) {
                //         this.router.navigate(['/auth']);
                //     }
                // })
            );
    }


}
