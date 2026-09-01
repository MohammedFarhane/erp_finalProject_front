import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { LOGIN_URL } from '../api';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {

  const user = inject(AuthService).user();

  if (!user || req.url === LOGIN_URL) {
    return next(req);
  }

  return next(req.clone({
    setHeaders: {
      Authorization: `Bearer ${user.token}`
    }
  }));
};
