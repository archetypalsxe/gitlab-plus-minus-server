import { Injectable } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpRequest, HttpEvent } from '@angular/common/http';
import {TokenStorage} from './token.storage';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(public tokenStorage: TokenStorage) {}

  intercept (request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      console.log("Token: " + this.tokenStorage.getToken());
      return next.handle(request);
    }
}
