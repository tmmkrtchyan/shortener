export interface JwtPayload {
  sub: string;
  username: string;
  iat?: number; // issued at
  exp?: number; // expiration
}

export interface UserInfo {
  id: string;
  username: string;
  isNew?: boolean;
}
