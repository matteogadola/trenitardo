import {
  ApplicationConfig,
  inject,
  PLATFORM_ID,
  provideBrowserGlobalErrorListeners,
  TransferState,
} from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideRemoteConfig, getRemoteConfig } from '@angular/fire/remote-config';
import { provideAnalytics, getAnalytics } from '@angular/fire/analytics';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { routes } from './app.routes';

import { getFirebaseConfig } from '@app/core/config/firebase-config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    //provideFirebaseApp(() => initializeApp()),
    provideFirebaseApp(() => initializeApp(getFirebaseConfig())),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideRemoteConfig(() => getRemoteConfig()),
    provideAnalytics(() => getAnalytics()),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
  ],
};
