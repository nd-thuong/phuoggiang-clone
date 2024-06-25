export interface TokenPayload {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface RefreshTokenPayload {
  userId: string;
}
