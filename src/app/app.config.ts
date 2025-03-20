import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import routes from './app.routes';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideExperimentalZonelessChangeDetection(),
    provideNativeDateAdapter(),
    [{provide: MAT_DATE_LOCALE, useValue: 'ru-RU'}]
  ]
};
