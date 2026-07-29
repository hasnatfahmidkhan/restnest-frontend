import { create } from "zustand";
import { IUser } from "@/app/(auth)/_types/auth.types";

interface AuthState {
  user: IUser | null;
  setUser: (user: IUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));