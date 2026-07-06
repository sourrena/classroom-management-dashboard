import type { AuthProvider } from "@refinedev/core";
import { api } from "../lib/api";

type UserRole = "teacher" | "student";

type LoginResponse = {
  success: boolean;
  data: {
    user: {
      id: string;
      fullName: string;
      email: string;
      role: UserRole;
      avatarUrl: string | null;
    };
    token: string;
  };
};

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const response = await api.post<LoginResponse>("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data.data;

      localStorage.setItem("classroom_token", token);
      localStorage.setItem("classroom_user", JSON.stringify(user));

      return {
        success: true,
        redirectTo: "/",
      };
    } catch {
      return {
        success: false,
        error: {
          name: "Login failed",
          message: "Invalid email or password",
        },
      };
    }
  },

  logout: async () => {
    localStorage.removeItem("classroom_token");
    localStorage.removeItem("classroom_user");

    return {
      success: true,
      redirectTo: "/login",
    };
  },

  check: async () => {
    const token = localStorage.getItem("classroom_token");

    if (!token) {
      return {
        authenticated: false,
        redirectTo: "/login",
      };
    }

    try {
      await api.get("/auth/me");

      return {
        authenticated: true,
      };
    } catch {
      localStorage.removeItem("classroom_token");
      localStorage.removeItem("classroom_user");

      return {
        authenticated: false,
        redirectTo: "/login",
      };
    }
  },

  getIdentity: async () => {
    const storedUser = localStorage.getItem("classroom_user");

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser);
  },

  getPermissions: async () => {
    const storedUser = localStorage.getItem("classroom_user");

    if (!storedUser) {
      return null;
    }

    const user = JSON.parse(storedUser);

    return user.role;
  },

  onError: async (error) => {
    if (error?.response?.status === 401) {
      return {
        logout: true,
        redirectTo: "/login",
      };
    }

    return {};
  },
};