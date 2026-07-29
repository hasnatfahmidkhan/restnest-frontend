export type UserRole = "TENANT" | "LANDLORD" | "ADMIN";
export type UserStatus = "ACTIVE" | "BAN";

export interface IUser {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  status: UserStatus;
  role: UserRole;
  profile?: {
    profilePhoto: string | null;
    bio?: string | null;
  };
}

export interface ILoginResponse {
  success: boolean;
  message: string;
  data: {
    userData: IUser;
  };
}
