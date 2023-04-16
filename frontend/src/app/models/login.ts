export interface Login {
  name: string,
  password: string,
  id: number | undefined,
  token: string | undefined,
  token_expiry: string | undefined
};
