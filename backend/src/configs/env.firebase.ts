export interface EnvFirebaseConfig {
  readonly firebase: {
    readonly serviceAccountPath?: string;
  };
}

export default function envFirebase(): EnvFirebaseConfig {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

  return {
    firebase: {
      serviceAccountPath: serviceAccountPath || undefined,
    },
  };
}
