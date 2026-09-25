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

/**
 * Config SSR: usa `FIREBASE_CONFIG` se presente e valida, altrimenti la config
 * di build. Così in dev/SSR (dove la env var può mancare) non si finisce con una
 * config vuota che fa fallire `initializeApp` (`projectId`/`apiKey`).
 */
export function parseServerConfig(firebaseStr: string | undefined): FirebaseOptions {
  if (firebaseStr) {
    try {
      const parsed = JSON.parse(firebaseStr) as FirebaseOptions;
      if (parsed.apiKey) {
        return parsed;
      }
    } catch {
      // config malformata: si prosegue col fallback
    }
  }

  return environment.firebaseConfig;
}

export const firebaseConfigFactory = (transferState: TransferState): FirebaseOptions => {
  const isServer = typeof process !== 'undefined' && !!process.env;

  if (isServer) {
    // SSR: priorità a process.env, altrimenti fallback alla config di build
    // (in dev `environment.dev.ts` ha la config; in prod App Hosting imposta FIREBASE_CONFIG).
    const config = parseServerConfig(process.env['FIREBASE_CONFIG']);
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

export function getFirebaseConfig(injector: EnvironmentInjector): FirebaseOptions {
  return runInInjectionContext(injector, () => inject(FIREBASE_CONFIG_TOKEN));
}
