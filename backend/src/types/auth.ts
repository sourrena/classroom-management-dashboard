export type UserRole = "student" | "teacher";

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatarUrl: string | null;
};