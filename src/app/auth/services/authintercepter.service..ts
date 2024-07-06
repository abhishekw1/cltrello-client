import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

// export class AuthIntercepter implements HttpInterceptor {
//   intercept(
//     req: HttpRequest<any>,
//     next: HttpHandler
//   ): Observable<HttpEvent<any>> {
//     const token = localStorage.getItem('token');
//     req = req.clone({
//       setHeaders: {
//         Authorization: token ?? '[]',
//       },
//     });

//     return next.handle(req);
//   }
// }

export function authIntercepter(
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const token = localStorage.getItem('token');
  req = req.clone({
    setHeaders: {
      Authorization: token ?? '[]',
    },
  });

  return next(req);
}
