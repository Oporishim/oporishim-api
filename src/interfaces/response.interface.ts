export interface ServiceErrorInterface {
  statusCode?: number;
  message?: string;
  [key: string]: unknown;
}
