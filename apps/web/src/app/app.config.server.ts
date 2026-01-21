import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { FIREBASE_CONFIG_TOKEN } from './core/config/firebase-config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    /*{
      provide: FIREBASE_CONFIG_TOKEN,
      useFactory: () => {
        const configString = process.env['FIREBASE_CONFIG'];

        if (!configString) {
          console.error('CRITICAL: FIREBASE_CONFIG not found in environment variables');
          return {};
        }

        try {
          return JSON.parse(configString);
        } catch (e) {
          console.error('CRITICAL: Failed to parse FIREBASE_CONFIG', e);
          return {};
        }
      },
    },*/
    {
      provide: FIREBASE_CONFIG_TOKEN,
      // Leggiamo la variabile d'ambiente SOLO qui
      useFactory: () => {
        const configStr = process.env['FIREBASE_CONFIG'];
        return configStr ? JSON.parse(configStr) : {};
      },
    },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
