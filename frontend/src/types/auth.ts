export type LoginRequest = {
  email: string;
  password: string;
};

export type Token = {
  access_token: string;
  token_type: string;
};
