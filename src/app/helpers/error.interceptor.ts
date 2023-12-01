import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';

import { Location } from '@angular/common';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService, GenericService } from '../shared/services';
import { BadRequestException } from '../shared/exceptions/BadRequestException';
import { UnexpectedException } from '../shared/exceptions/UnexpectedException';
import { ConflictException } from '../shared/exceptions/ConfictException';
import { NotFoundException } from '../shared/exceptions/NotFoundException';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthenticationService,
    private genk: GenericService,
    private locate: Location,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      // retry(2),
      catchError((err: unknown) => {
        // if (err.status === 401 || err.status === 403) {
        //   // auto logout if 401 response returned from api
        //   this.authenticationService.logout();
        //   let returl = this.router.routerState.snapshot.url;
        //   //this.locate.replaceState('/' + this.genk.auth + '/login' + '?returnUrl=' + returl);
        //   this.router.navigate(['/' + 'login'], {
        //     queryParams: { returnUrl: returl },
        //   });
        //   //window.location.reload();
        // }
        if (err.status === 400) {
          return throwError(() => new BadRequestException());
        } else if (err.status === 409) {
          return throwError(
            () =>
              new ConflictException(
                err.message ? err?.error.data.message : null
              )
          );
        } else if (err.status === 404) {
          return throwError(() => new NotFoundException());
        }
        return throwError(() => new UnexpectedException());
      })
    );
  }
}
