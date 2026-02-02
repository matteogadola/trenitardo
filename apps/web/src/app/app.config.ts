import { ApplicationConfig, inject, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import {
  provideRemoteConfig,
  getRemoteConfig,
  fetchAndActivate,
} from '@angular/fire/remote-config';
import { provideAnalytics, getAnalytics } from '@angular/fire/analytics';
import { routes } from './app.routes';
import { provideFirebaseConfig, FIREBASE_CONFIG_TOKEN } from './core/config/firebase-config';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DayjsDateAdapter, MAT_DAYJS_FORMATS } from './core/utils/date-dayjs-adapter';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: MAT_DATE_LOCALE, useFactory: () => navigator.language },
    { provide: DateAdapter, useClass: DayjsDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_DAYJS_FORMATS },
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    provideFirebaseConfig,
    provideFirebaseApp(() => initializeApp(inject(FIREBASE_CONFIG_TOKEN))),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideRemoteConfig(() => getRemoteConfig()),
    provideAnalytics(() => getAnalytics()),
  ],
};
