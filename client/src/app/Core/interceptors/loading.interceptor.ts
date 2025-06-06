import { HttpInterceptorFn } from '@angular/common/http';
import {delay, finalize} from 'rxjs';
import {inject} from '@angular/core';
import {BusyService} from '../services/busy.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {

let busyService=inject(BusyService);
busyService.busy();
  return next(req).pipe(
    delay(1000),
    finalize(()=>busyService.idle())
  );
};
