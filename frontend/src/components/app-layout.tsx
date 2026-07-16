import {
  AppstoreOutlined,
  BookOutlined,
  DashboardOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoonOutlined,
  ReadOutlined,
  SolutionOutlined,
  SunOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useLogout } from "@refinedev/core";
import { Avatar, Button, Grid, Layout, Menu, Space, Tag, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { ColorModeContext } from "../contexts/color-mode";
import { getCurrentUser } from "../lib/current-user";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export const AppLayout = () => {
  const location = useLocation();
  const screens = Grid.useBreakpoint();
  const { mutate: logout } = useLogout();
  const { mode, setMode } = useContext(ColorModeContext);
  const user = getCurrentUser();

  const [collapsed, setCollapsed] = useState(false);

  const isDesktop = Boolean(screens.lg);

  useEffect(() => {
    if (!isDesktop) {
      setCollapsed(true);
    }
  }, [isDesktop]);

  const firstPathSegment = location.pathname.split("/")[1];
  const selectedKey = firstPathSegment ? `/${firstPathSegment}` : "/";

  const toggleTheme = () => {
    setMode(mode === "dark" ? "light" : "dark");
  };

  return (
    <Layout className="app-shell">
      <Sider
        className="app-sider"
        width={260}
        collapsedWidth={isDesktop ? 80 : 0}
        collapsed={collapsed}
        trigger={null}
        breakpoint="lg"
      >
        <div className="app-logo">
          {collapsed ? "CMD" : "Classroom Dashboard"}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={[
            {
              key: "/",
              icon: <DashboardOutlined />,
              label: <Link to="/">Dashboard</Link>,
            },
            {
              key: "/departments",
              icon: <AppstoreOutlined />,
              label: <Link to="/departments">Departments</Link>,
            },
            {
              key: "/subjects",
              icon: <BookOutlined />,
              label: <Link to="/subjects">Subjects</Link>,
            },
            {
              key: "/faculty",
              icon: <TeamOutlined />,
              label: <Link to="/faculty">Faculty</Link>,
            },
            {
              key: "/classes",
              icon: <ReadOutlined />,
              label: <Link to="/classes">Classes</Link>,
            },
            {
              key: "/enrollments",
              icon: <SolutionOutlined />,
              label: <Link to="/enrollments">Enrollments</Link>,
            },
          ]}
        />
      </Sider>

      <Layout>
        <Header className="app-header">
          <div className="app-header-left">
  <Button
    type="text"
    className="app-menu-button"
    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
    onClick={() => setCollapsed((value) => !value)}
  />

  <div className="app-header-title">
  <span className="app-header-title-full">
    University Classroom Management
  </span>

  <span className="app-header-title-short">
    Dashboard
  </span>
</div>
</div>

          <div className="app-header-right">
  <Button
    className="theme-toggle-button"
    shape="circle"
    icon={mode === "dark" ? <SunOutlined /> : <MoonOutlined />}
    onClick={toggleTheme}
  />

  <div className="app-user-block">
    <Avatar
      className="app-user-avatar"
      src={user?.avatarUrl}
      icon={<UserOutlined />}
    >
      {user?.fullName?.[0]}
    </Avatar>

    <div className="app-user-text">
      <div>
        <Text strong>{user?.fullName || "User"}</Text>
      </div>

      <Tag color={user?.role === "teacher" ? "blue" : "green"}>
        {user?.role || "guest"}
      </Tag>
    </div>
  </div>

  <Button
  className="logout-button"
  icon={<LogoutOutlined />}
  onClick={() => logout()}
>
  <span className="logout-text">Logout</span>
</Button>
</div>
        </Header>

        <Content className="app-content-wrap">
          <div className="app-content">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};