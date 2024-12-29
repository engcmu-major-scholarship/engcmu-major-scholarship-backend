import { Role } from './Role';

export type TokenPayload = {
  sub: string;
  CMUAccount: string;
  roles: Role[];
  iat?: number;
  exp?: number;
  iss?: string;
};
