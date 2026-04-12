import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { authReducer } from './store/auth/auth.reducer';
import * as authEffects from './store/auth/auth.effects';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { clientReducer } from './store/client/client.reducer';
import * as clientEffects from './store/client/client.effects';
import { serviceReducer } from './store/service/service.reducer';
import * as serviceEffects from './store/service/service.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideStore({ auth: authReducer, client: clientReducer, service: serviceReducer }),
    provideEffects(authEffects, clientEffects, serviceEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
  ]
};
