export interface MessageResponse {
  message: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenBody {
  refreshToken: string;
}
