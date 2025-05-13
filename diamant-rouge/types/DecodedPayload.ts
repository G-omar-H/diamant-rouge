export type DecodedPayload = {
  id: string | number;
  email: string;
  name?: string;
  iat?: number;
  exp?: number;
}; 