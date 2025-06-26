export interface User {
  id: number;
  email: string;
  username?: string;
  password?: string;
}

export interface Chat {
  id: number;
  user_id: number;
  name?: string;
  create_at: string;
}
