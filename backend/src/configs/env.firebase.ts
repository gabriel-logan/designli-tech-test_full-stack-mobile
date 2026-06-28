export interface EnvFirebaseConfig {
  readonly firebase: {
    readonly serviceAccountJson?: string;
    readonly serviceAccountPath?: string;
  };
}

export default function envFirebase(): EnvFirebaseConfig {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

  return {
    firebase: {
      serviceAccountJson: serviceAccountJson || undefined,
      serviceAccountPath: serviceAccountPath || undefined,
    },
  };
}
