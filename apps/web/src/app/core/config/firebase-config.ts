import {
  EnvironmentInjector,
  inject,
  InjectionToken,
  makeStateKey,
  runInInjectionContext,
  TransferState,
} from '@angular/core';
import type { FirebaseOptions } from '@angular/fire/app';
import { environment } from '@env/environment';

export const FIREBASE_CONFIG_TOKEN = new InjectionToken<FirebaseOptions>('FIREBASE_CONFIG_TOKEN');
const FIREBASE_STATE_KEY = makeStateKey<FirebaseOptions>('firebase_config_state');

export const firebaseConfigFactory = (transferState: TransferState): FirebaseOptions => {
  const isServer = typeof process !== 'undefined' && !!process.env;

  if (isServer) {
    // SSR: leggo da process.env
    const firebaseStr = process.env['FIREBASE_CONFIG'];
    const config: FirebaseOptions = firebaseStr ? JSON.parse(firebaseStr) : {};
    transferState.set(FIREBASE_STATE_KEY, config);
    return config;
  }

  // CSR: recupero da TransferState o fallback development (ng serve)
  return transferState.get(FIREBASE_STATE_KEY, environment.firebaseConfig);
};

export const provideFirebaseConfig = {
  provide: FIREBASE_CONFIG_TOKEN,
  deps: [TransferState],
  useFactory: firebaseConfigFactory,
};

export function getFirebaseConfig(injector: EnvironmentInjector) {
  return runInInjectionContext(injector, () => inject(FIREBASE_CONFIG_TOKEN));
}
