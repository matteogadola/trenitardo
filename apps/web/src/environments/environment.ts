const env = (window as any)['env'];

export const environment = {
  production: false,
  deployStage: env['deploy_stage'],
  firebaseConfig: {},
};
