import { UserRole } from "../enums/user.enum";

export interface UserInterface {
  id: number;
  name: string;
  role: UserRole;
  email: string;
  password: string;
  avatar: string;
}
