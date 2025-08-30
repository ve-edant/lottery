export {}

// Create a type for the roles
export type Roles = 'ADMIN'

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }
}

export interface User {
  id: string;
  clerkId: string;
  email: string;
  username: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;

  // Relations (optional or array, depending on the relation)
  wallet?: Wallet | null;
  bets?: Bet[];
  transactions?: Transaction[];
}

export interface ClerkUserPayload {
  id: string;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  email_addresses: Array<{
    id: string;
    email_address: string;
    verification: {
      status: 'verified' | 'unverified';
      strategy: string;
    };
  }>;
  image_url: string;
  created_at: number; // Unix timestamp
  updated_at: number; // Unix timestamp
}

