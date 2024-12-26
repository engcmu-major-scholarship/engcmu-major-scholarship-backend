import { Role } from './Role';

export type TokenPayload = {
  sub: string;
  googleAccount: string;
  roles: Role[];
  iat?: number;
  exp?: number;
  iss?: string;
};
