import { inject, Injectable, signal } from '@angular/core';
import { RemoteConfig, fetchAndActivate, getValue } from '@angular/fire/remote-config';

@Injectable({ providedIn: 'root' })
export class RemoteConfigService {
  private readonly remoteConfig = inject(RemoteConfig);
  private readonly readyPromise: Promise<void>;

  readonly ready = signal(false);

  constructor() {
    this.readyPromise = fetchAndActivate(this.remoteConfig).then(() => {
      this.ready.set(true);
    });
  }

  async whenReady(): Promise<void> {
    return this.readyPromise;
  }

  getBoolean(key: string): boolean {
    return getValue(this.remoteConfig, key).asBoolean();
  }

  getString(key: string): string {
    return getValue(this.remoteConfig, key).asString();
  }
}
