import { Injectable, Inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpResponse,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { of } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { APP_CONFIG, AppConfig } from '@app/config/app.config';

@Injectable({
  providedIn: 'root'
})
export class NetService implements HttpInterceptor {
  private _baseURL: string;

  constructor(@Inject(APP_CONFIG) private _config: AppConfig) {
    this._baseURL = _config.http;
  }

  private _headers(): HttpHeaders {
    return new HttpHeaders({
      // Authorization: `Bearer ' ${localStorage.getItem(TokenField) || ''}`
    });
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let url = req.url;
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
      url = this._baseURL + url;
    }

    const newReq = req.clone({
      url,
      withCredentials: true
      // headers: this._headers()
    });
    return next.handle(newReq).pipe(
      mergeMap((event: any) => {
        if (event instanceof HttpResponse && event.status === 200) {
          return of(event);
        }

        return of(event);
      })
    );
  }
}
