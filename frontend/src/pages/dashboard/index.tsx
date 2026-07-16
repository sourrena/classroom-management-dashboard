import {
  AppstoreOutlined,
  BookOutlined,
  ReadOutlined,
  SolutionOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Row,
  Space,
  Spin,
  Statistic,
  Typography,
} from "antd";
import { useNavigate } from "react-router";
import { api } from "../../lib/api";
import { getCurrentUser, isStudent, isTeacher } from "../../lib/current-user";

const { Title, Paragraph, Text } = Typography;

type DashboardStats = {
  students: number;
  teachers: number;
  departments: number;
  subjects: number;
  classes: number;
  activeClasses: number;
  enrollments: number;
};

type StatCardProps = {
  title: string;
  value: number;
  path: string;
  icon: React.ReactNode;
};

const StatCard = ({ title, value, path, icon }: StatCardProps) => {
  const navigate = useNavigate();

  return (
    <Card hoverable className="stat-card" onClick={() => navigate(path)}>
      <div className="stat-card-icon">{icon}</div>
      <Statistic title={title} value={value} />
    </Card>
  );
};

export const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const user = getCurrentUser();
  const canManageAcademicData = isTeacher();
  const canEnroll = isStudent();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/dashboard/stats");
        setStats(response.data.data);
      } catch {
        setErrorMessage("Failed to load dashboard stats.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return <Spin />;
  }

  if (errorMessage) {
    return <Alert type="error" message={errorMessage} />;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-hero">
        <div>
          <Title level={2} className="dashboard-title">
            Dashboard
          </Title>

          <Paragraph className="dashboard-subtitle">
            Welcome back, <Text strong>{user?.fullName || "User"}</Text>. You
            are logged in as <Text strong>{user?.role}</Text>.
          </Paragraph>
        </div>

        <Space wrap>
          <Button onClick={() => navigate("/classes")}>Browse Classes</Button>

          {canManageAcademicData && (
            <Button type="primary" onClick={() => navigate("/classes/create")}>
              New Class
            </Button>
          )}

          {canEnroll && (
            <Button
              type="primary"
              onClick={() => navigate("/enrollments/create")}
            >
              Enroll in Class
            </Button>
          )}
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} xl={6}>
          <StatCard
            title="Students"
            value={stats?.students ?? 0}
            path="/enrollments"
            icon={<UsergroupAddOutlined />}
          />
        </Col>

        <Col xs={24} sm={12} xl={6}>
          <StatCard
            title="Teachers"
            value={stats?.teachers ?? 0}
            path="/faculty"
            icon={<TeamOutlined />}
          />
        </Col>

        <Col xs={24} sm={12} xl={6}>
          <StatCard
            title="Departments"
            value={stats?.departments ?? 0}
            path="/departments"
            icon={<AppstoreOutlined />}
          />
        </Col>

        <Col xs={24} sm={12} xl={6}>
          <StatCard
            title="Subjects"
            value={stats?.subjects ?? 0}
            path="/subjects"
            icon={<BookOutlined />}
          />
        </Col>

        <Col xs={24} sm={12} xl={6}>
          <StatCard
            title="Classes"
            value={stats?.classes ?? 0}
            path="/classes"
            icon={<ReadOutlined />}
          />
        </Col>

        <Col xs={24} sm={12} xl={6}>
          <StatCard
            title="Active Classes"
            value={stats?.activeClasses ?? 0}
            path="/classes"
            icon={<ReadOutlined />}
          />
        </Col>

        <Col xs={24} sm={12} xl={6}>
          <StatCard
            title="Enrollments"
            value={stats?.enrollments ?? 0}
            path="/enrollments"
            icon={<SolutionOutlined />}
          />
        </Col>
      </Row>

      <Card title="Quick actions" className="quick-actions-card" style={{ marginTop: 24 }}>
        <Space wrap>
          <Button onClick={() => navigate("/subjects")}>View Subjects</Button>
          <Button onClick={() => navigate("/faculty")}>View Faculty</Button>
          <Button onClick={() => navigate("/classes")}>View Classes</Button>

          {canManageAcademicData && (
            <>
              <Button onClick={() => navigate("/departments/create")}>
                New Department
              </Button>

              <Button onClick={() => navigate("/subjects/create")}>
                New Subject
              </Button>
            </>
          )}
        </Space>
      </Card>
    </div>
  );
};