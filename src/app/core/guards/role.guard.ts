import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guards a route so only users with the specified role can access it.
 * Usage: canActivate: [authGuard, roleGuard('Admin')]
 */
export const roleGuard = (requiredRole: 'Admin' | 'Staff'): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const user = auth.getCurrentUser();

    if (user?.role === requiredRole || user?.role === 'Admin') {
      return true;
    }

    return router.createUrlTree(['/dashboard']);
  };
};
