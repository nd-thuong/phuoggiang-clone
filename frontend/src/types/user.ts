export interface TypeResMe {
  username: string | null;
  role: string | null;
}

export interface TypeLogin {
  username: string;
  password: string;
}

export interface TypeRegister {
  username: string;
  password: string;
  email: string;
}

export interface ValueTypeLogout {
  'refresh-token': string;
}

export interface ValueInfoUser {
  username: string;
  fullName: string;
  gender: string;
  phone: string;
  email: string;
}
