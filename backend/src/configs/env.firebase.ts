import type { ServiceAccount } from "firebase-admin/app";

export interface EnvFirebaseConfig {
  readonly firebase: {
    readonly serviceAccountJson?: ServiceAccount;
  };
}

export default function envFirebase(): EnvFirebaseConfig {
  const serviceAccountJsonRaw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  let serviceAccountJson: ServiceAccount | undefined;

  if (serviceAccountJsonRaw) {
    try {
      serviceAccountJson = JSON.parse(serviceAccountJsonRaw) as ServiceAccount;
    } catch (error) {
      throw new Error(
        `Failed to parse Firebase service account JSON: ${serviceAccountJsonRaw}. Error: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  return {
    firebase: {
      serviceAccountJson,
    },
  };
}
