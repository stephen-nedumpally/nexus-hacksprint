import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      verified: boolean;
    } & DefaultSession['user'];
  }

  interface User {
    verified: boolean;
  }
}
