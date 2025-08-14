export interface RequestWithUserInterface {
  headers: { authorization?: string };
  user?: {
    subscriberId: string | number;
    userId: string | number;
    appId: string | number;
    role?: string;
  };
}
