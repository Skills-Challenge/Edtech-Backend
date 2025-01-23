

export type User = {
    name: string;
    email: string;
    password: string;
    role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}