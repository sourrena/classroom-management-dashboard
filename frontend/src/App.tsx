import {
  Authenticated,
  Refine,
} from "@refinedev/core";
import { DashboardPage } from "./pages/dashboard";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import { useNotificationProvider } from "@refinedev/antd";
import { LoginPage } from "./pages/auth/login";
import "@refinedev/antd/dist/reset.css";
import "./styles/theme.css";
import "./styles/auth.css";

import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { App as AntdApp } from "antd";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { authProvider } from "./providers/auth";
import { dataProvider } from "./providers/data";
import { DepartmentList } from "./pages/departments/list";
import { DepartmentCreate } from "./pages/departments/create";
import { DepartmentEdit } from "./pages/departments/edit";
import { DepartmentShow } from "./pages/departments/show";
import { SubjectList } from "./pages/subjects/list";
import { SubjectCreate } from "./pages/subjects/create";
import { SubjectEdit } from "./pages/subjects/edit";
import { SubjectShow } from "./pages/subjects/show";
import { FacultyList } from "./pages/faculty/list";
import { FacultyShow } from "./pages/faculty/show";
import { ClassList } from "./pages/classes/list";
import { ClassCreate } from "./pages/classes/create";
import { ClassEdit } from "./pages/classes/edit";
import { ClassShow } from "./pages/classes/show";
import { EnrollmentList } from "./pages/enrollments/list";
import { EnrollmentCreate } from "./pages/enrollments/create";
import { AppLayout } from "./components/app-layout";
import { RoleGuard } from "./components/role-guard";
import { RegisterPage } from "./pages/auth/register";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <AntdApp>
              <Refine
                dataProvider={dataProvider}
                notificationProvider={useNotificationProvider}
                routerProvider={routerProvider}
                authProvider={authProvider}
                resources={[
    {
      name: "departments",
      list: "/departments",
      create: "/departments/create",
      edit: "/departments/edit/:id",
      show: "/departments/show/:id",
    },
    {
      name: "subjects",
      list: "/subjects",
      create: "/subjects/create",
      edit: "/subjects/edit/:id",
      show: "/subjects/show/:id",
    },
    {
      name: "faculty",
      list: "/faculty",
      show: "/faculty/show/:id",
    },
    {
      name: "classes",
      list: "/classes",
      create: "/classes/create",
      edit: "/classes/edit/:id",
      show: "/classes/show/:id",
    },
    {
      name: "enrollments",
      list: "/enrollments",
      create: "/enrollments/create",
    },
  ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  projectId: "6EzSlr-9REnzK-zxbKRM",
                }}
              >
                <Routes>
  <Route path="/login" element={<LoginPage />} />
<Route path="/register" element={<RegisterPage />} />

  <Route
    element={
      <Authenticated
        key="authenticated-layout"
        fallback={<Navigate to="/login" replace />}
      >
        <AppLayout />
      </Authenticated>
    }
  >
    <Route index element={<DashboardPage />} />

    <Route path="/departments" element={<DepartmentList />} />
    <Route
  path="/departments/create"
  element={
    <RoleGuard allowedRoles={["teacher"]}>
      <DepartmentCreate />
    </RoleGuard>
  }
/>
    <Route path="/departments/edit/:id" element={<RoleGuard allowedRoles={["teacher"]}><DepartmentEdit /></RoleGuard>} />
    <Route path="/departments/show/:id" element={<DepartmentShow />} />

    <Route path="/subjects" element={<SubjectList />} />
    <Route
  path="/subjects/create"
  element={
    <RoleGuard allowedRoles={["teacher"]}>
      <SubjectCreate />
    </RoleGuard>
  }
/>

<Route
  path="/subjects/edit/:id"
  element={
    <RoleGuard allowedRoles={["teacher"]}>
      <SubjectEdit />
    </RoleGuard>
  }
/>
    <Route path="/subjects/show/:id" element={<SubjectShow />} />

    <Route path="/faculty" element={<FacultyList />} />
    <Route path="/faculty/show/:id" element={<FacultyShow />} />

    <Route path="/classes" element={<ClassList />} />
    <Route
  path="/classes/create"
  element={
    <RoleGuard allowedRoles={["teacher"]}>
      <ClassCreate />
    </RoleGuard>
  }
/>

<Route
  path="/classes/edit/:id"
  element={
    <RoleGuard allowedRoles={["teacher"]}>
      <ClassEdit />
    </RoleGuard>
  }
/>
    <Route path="/classes/show/:id" element={<ClassShow />} />

    <Route path="/enrollments" element={<EnrollmentList />} />
    <Route
  path="/enrollments/create"
  element={
    <RoleGuard allowedRoles={["student"]}>
      <EnrollmentCreate />
    </RoleGuard>
  }
/>
  </Route>
</Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
          </AntdApp>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;