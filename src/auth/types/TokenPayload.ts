import { Role } from './Role';

export class TokenPayload {
  sub: string;
  CMUAccount: string;
  roles: Role[];
  iat?: number;
  exp?: number;
  iss?: string;
}
