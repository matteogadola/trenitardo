import { environment } from '@env/environment';
import { parseServerConfig } from './firebase-config';

describe('parseServerConfig', () => {
  it('usa FIREBASE_CONFIG quando presente e valida', () => {
    expect(parseServerConfig('{"apiKey":"key","projectId":"proj"}')).toEqual({
      apiKey: 'key',
      projectId: 'proj',
    });
  });

  it('fa fallback sulla config di build se assente, vuota o malformata', () => {
    expect(parseServerConfig(undefined)).toEqual(environment.firebaseConfig);
    expect(parseServerConfig('')).toEqual(environment.firebaseConfig);
    expect(parseServerConfig('{}')).toEqual(environment.firebaseConfig);
    expect(parseServerConfig('not-json')).toEqual(environment.firebaseConfig);
  });
});
