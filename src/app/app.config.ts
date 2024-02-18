import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@auth0/angular-jwt';
import { AlertService } from './services/alert.service';
import { ConfirmationService, MessageService } from 'primeng/api';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: ['api.escuelajs.co'],
        },
      }),
    ),
    provideHttpClient(),
    provideRouter(routes),
    provideAnimations(),
    AuthService,
    AlertService,
    ConfirmationService,
    MessageService,
  ],
};
