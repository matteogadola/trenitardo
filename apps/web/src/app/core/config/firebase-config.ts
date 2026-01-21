import { isPlatformServer } from '@angular/common';
import { inject, InjectionToken, makeStateKey, PLATFORM_ID, TransferState } from '@angular/core';
import type { FirebaseOptions } from '@angular/fire/app';

export const FIREBASE_CONFIG_TOKEN = new InjectionToken<FirebaseOptions>('FIREBASE_CONFIG_TOKEN');
export const FIREBASE_STATE_KEY = makeStateKey<FirebaseOptions>('firebase_config_state');

export const getFirebaseConfig = (): FirebaseOptions => {
  const platformId = inject(PLATFORM_ID);
  const transferState = inject(TransferState);

  const serverConfig = inject(FIREBASE_CONFIG_TOKEN, { optional: true });

  if (isPlatformServer(platformId) && serverConfig) {
    transferState.set(FIREBASE_STATE_KEY, serverConfig);
    return serverConfig;
  } else {
    const clientConfig = transferState.get(FIREBASE_STATE_KEY, null);
    if (!clientConfig) {
      throw new Error('FIREBASE_CONFIG not found');
    }
    return clientConfig;
  }
  // JSON.parse(configStr)
};
