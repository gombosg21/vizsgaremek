export class UserLogin {
  constructor(
    public name: string,
    public password: string,
    public id: number | undefined,
    public token: string | undefined,
    public token_expiry: string | undefined
    ) {};
};
