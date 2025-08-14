export interface AuthVerifyResponseInterface {
  valid: boolean;
  subscriberId: string | number;
  userId: string;
  appId: string;
  role?: string;
}
