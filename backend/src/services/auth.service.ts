import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { AppError } from "../utils/AppError.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { generateToken } from "../utils/token.js";
import type { LoginInput, RegisterInput } from "../validators/auth.validator.js";
import type { AuthUser, UserRole } from "../types/auth.js";

const toAuthUser = (user: {
  id: string;
  fullName: string;
  email: string;
  role: string;
  avatarUrl: string | null;
}): AuthUser => {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role as UserRole,
    avatarUrl: user.avatarUrl,
  };
};

export const registerUser = async (input: RegisterInput) => {
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, input.email))
    .limit(1);

  if (existingUser.length > 0) {
    throw new AppError("Email is already registered", 409);
  }

  const passwordHash = await hashPassword(input.password);

  const [newUser] = await db
    .insert(users)
    .values({
      fullName: input.fullName,
      email: input.email,
      passwordHash,
      role: input.role,
    })
    .returning({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      role: users.role,
      avatarUrl: users.avatarUrl,
    });

  const authUser = toAuthUser(newUser);

  const token = generateToken({
    userId: authUser.id,
    role: authUser.role,
  });

  return {
    user: authUser,
    token,
  };
};

export const loginUser = async (input: LoginInput) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, input.email))
    .limit(1);

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const passwordIsValid = await comparePassword(
    input.password,
    user.passwordHash
  );

  if (!passwordIsValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const authUser = toAuthUser(user);

  const token = generateToken({
    userId: authUser.id,
    role: authUser.role,
  });

  return {
    user: authUser,
    token,
  };
};