import {
  AppstoreOutlined,
  BookOutlined,
  DashboardOutlined,
  LogoutOutlined,
  ReadOutlined,
  SolutionOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useLogout } from "@refinedev/core";
import { Avatar, Button, Layout, Menu, Space, Tag, Typography } from "antd";
import { Link, Outlet, useLocation } from "react-router";
import { getCurrentUser } from "../lib/current-user";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export const AppLayout = () => {
  const location = useLocation();
  const { mutate: logout } = useLogout();
  const user = getCurrentUser();

  const firstPathSegment = location.pathname.split("/")[1];
  const selectedKey = firstPathSegment ? `/${firstPathSegment}` : "/";

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={250}>
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            color: "white",
            fontWeight: 700,
            fontSize: 18,
            borderBottom: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          Classroom Dashboard
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
        <Header
          style={{
            background: "white",
            padding: "0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <div>
            <Text strong>University Classroom Management</Text>
          </div>

          <Space size="middle">
            <Space>
              <Avatar src={user?.avatarUrl} icon={<UserOutlined />}>
                {user?.fullName?.[0]}
              </Avatar>

              <div style={{ lineHeight: 1.2 }}>
                <div>
                  <Text strong>{user?.fullName || "User"}</Text>
                </div>

                <Tag color={user?.role === "teacher" ? "blue" : "green"}>
                  {user?.role || "guest"}
                </Tag>
              </div>
            </Space>

            <Button
              icon={<LogoutOutlined />}
              onClick={() => logout()}
            >
              Logout
            </Button>
          </Space>
        </Header>

        <Content
          style={{
            margin: 24,
            padding: 24,
            background: "white",
            minHeight: 280,
            borderRadius: 8,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};