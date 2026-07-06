import type { ReactNode } from "react";
import { Result } from "antd";
import { getCurrentUser, type UserRole } from "../lib/current-user";

type RoleGuardProps = {
  allowedRoles: UserRole[];
  children: ReactNode;
};

export const RoleGuard = ({ allowedRoles, children }: RoleGuardProps) => {
  const user = getCurrentUser();

  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <Result
        status="403"
        title="403"
        subTitle="You do not have permission to access this page."
      />
    );
  }

  return <>{children}</>;
};