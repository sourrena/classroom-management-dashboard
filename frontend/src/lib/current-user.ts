export type UserRole = "teacher" | "student";

export type StoredUser = {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatarUrl: string | null;
};

export const getCurrentUser = (): StoredUser | null => {
  const storedUser = localStorage.getItem("classroom_user");

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
};

export const isTeacher = () => getCurrentUser()?.role === "teacher";

export const isStudent = () => getCurrentUser()?.role === "student";