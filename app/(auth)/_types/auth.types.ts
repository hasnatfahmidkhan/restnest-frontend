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

// Raw response from the backend (used only in server actions)
export interface ILoginResponseRaw {
  success: boolean;
  message: string;
  data: {
    userData: IUser;
    accessToken: string;
    refreshToken: string;
  };
}

// Safe response returned to the client (tokens stripped)
export interface ILoginResponse {
  success: boolean;
  message: string;
  data: {
    userData: IUser;
  };
}
