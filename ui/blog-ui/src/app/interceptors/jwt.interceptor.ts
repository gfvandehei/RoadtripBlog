import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {map, filter, tap} from "rxjs/operators";
import {JwtService} from "../services/auth/jwt.service";
@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private jwtService: JwtService,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let jwt = this.jwtService.getJWT();
    if(jwt !== null){
      request = request.clone({headers: request.headers.set("x-access-token", jwt)});
    }
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if(event instanceof HttpResponse){
          if(event.headers.get("refresh-token") != null){
            this.jwtService.storeJWT(event.headers.get('refresh-token')!);
          }
        }
        return event;
      })
    );
  }
}
