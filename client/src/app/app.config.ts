import {APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {errorInterceptor} from './Core/interceptors/error.interceptor';
import {loadingInterceptor} from './Core/interceptors/loading.interceptor';
import {InitService} from './Core/services/init.service';
import {lastValueFrom} from 'rxjs';

function InitializeApp(init:InitService) {
  return () =>lastValueFrom(init.init()).finally(()=>{
    const splash=window.document.getElementById('initial-splash');
    if(splash)
      splash.remove();
  })
}

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([errorInterceptor,loadingInterceptor])),
    {
      provide: APP_INITIALIZER,
      useFactory: InitializeApp,
      deps: [InitService],
      multi: true
    }
  ],

};
