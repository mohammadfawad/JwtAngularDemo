import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  // Always read token from service only
  const token = auth.getToken();

  // Prevent attaching token on login and register requests
  if (req.url.includes('/auth/login') || req.url.includes('/register')) {
    return next(req);
  }

  // Attach token only if exists AND user is not logging in
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        console.warn('⚠ Token expired → Auto logout');

        auth.logout(); // remove token

        // Avoid infinite reload loop
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
      return throwError(() => error);
    })
  );
};

export const JwtInterceptor = jwtInterceptor;
