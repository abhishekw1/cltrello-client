import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  authService = inject(AuthService),
  router = inject(Router)
) => {
  return authService.isLogged$.pipe(
    map((isLoggedIn) => {
      if (isLoggedIn) {
        return true;
      }
      router.navigateByUrl('/');
      return false;
    })
  );
};
