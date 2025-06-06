import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {catchError, throwError} from 'rxjs';
import {inject} from '@angular/core';
import {NavigationExtras, Router} from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
 const router=inject(Router);
  return next(req).pipe(
    catchError((err:HttpErrorResponse) => {
      if(err.status===400)
      {
       if( err.error.errors){
         let modelStateErrors=[];
         for(let key in err.error.errors)
         {
           if(err.error.errors[key])
           modelStateErrors.push(err.error.errors[key]);
         }
         return throwError(()=>modelStateErrors.flat());

       }
       else return throwError(()=>err.error.title||err.error);
    }

      if(err.status===404)
       router.navigateByUrl('/not-found');
      if(err.status===500){
        let navigationExtras:NavigationExtras={state:{error:err.error}};
          router.navigateByUrl('/server-error',navigationExtras);
      }
      return throwError(()=>err);

    })

  )


};
