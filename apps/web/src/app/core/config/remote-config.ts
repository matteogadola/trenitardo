import { inject } from '@angular/core';
import { fetchAndActivate, RemoteConfig, getValue, type Value } from '@angular/fire/remote-config';

export class RemoteConfigService {
  private readonly remoteConfig = inject(RemoteConfig);
  private activated = false;

  constructor() {
    fetchAndActivate(this.remoteConfig).then(() => (this.activated = true));
  }

  getRemoteConfig(key: string): Value {
    return getValue(this.remoteConfig, key);
  }
}
