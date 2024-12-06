import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import uk from '@angular/common/locales/uk';
import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';

import { provideNzI18n, uk_UA } from 'ng-zorro-antd/i18n';

import { routes } from './app.routes';

registerLocaleData(uk);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideNzI18n(uk_UA),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideHttpClient(),
  ],
};
