export type LogDataMap = {
  CREATE: { resourceId: string };
  READ: { resourceId: string | null };
  UPDATE: { resourceId: string };
  DELETE: { resourceId: string };
  LOGIN: { ip: string };
  LOGOUT: null;
  ERROR: { endpoint?: string; errorMessage?: string };
};

export type LogAction = keyof LogDataMap;

export type CRUDResource = "users" | "sessions";
