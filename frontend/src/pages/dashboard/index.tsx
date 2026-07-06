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
};

const StatCard = ({ title, value, path }: StatCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      hoverable
      onClick={() => navigate(path)}
      style={{ height: "100%" }}
    >
      <Statistic title={title} value={value} />
    </Card>
  );
};

export const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

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
    return (
      <div style={{ padding: 24 }}>
        <Spin />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div style={{ padding: 24 }}>
        <Alert type="error" message={errorMessage} />
      </div>
    );
  }

  return (
    <div>
      <Space direction="vertical" size={24} style={{ width: "100%" }}>
        <div>
          <Title level={2} style={{ marginBottom: 4 }}>
            Dashboard
          </Title>

          <Paragraph type="secondary" style={{ marginBottom: 0 }}>
            Welcome back,{" "}
            <Text strong>{user?.fullName || "User"}</Text>. You are logged in as{" "}
            <Text strong>{user?.role}</Text>.
          </Paragraph>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <StatCard
              title="Students"
              value={stats?.students ?? 0}
              path="/enrollments"
            />
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <StatCard
              title="Teachers"
              value={stats?.teachers ?? 0}
              path="/faculty"
            />
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <StatCard
              title="Departments"
              value={stats?.departments ?? 0}
              path="/departments"
            />
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <StatCard
              title="Subjects"
              value={stats?.subjects ?? 0}
              path="/subjects"
            />
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <StatCard
              title="Classes"
              value={stats?.classes ?? 0}
              path="/classes"
            />
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <StatCard
              title="Active Classes"
              value={stats?.activeClasses ?? 0}
              path="/classes"
            />
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <StatCard
              title="Enrollments"
              value={stats?.enrollments ?? 0}
              path="/enrollments"
            />
          </Col>
        </Row>

        <Card title="Quick actions">
          <Space wrap>
            <Button onClick={() => window.location.assign("/classes")}>
              Browse Classes
            </Button>

            <Button onClick={() => window.location.assign("/subjects")}>
              View Subjects
            </Button>

            <Button onClick={() => window.location.assign("/faculty")}>
              View Faculty
            </Button>

            {canManageAcademicData && (
              <>
                <Button
                  type="primary"
                  onClick={() => window.location.assign("/departments/create")}
                >
                  New Department
                </Button>

                <Button
                  type="primary"
                  onClick={() => window.location.assign("/classes/create")}
                >
                  New Class
                </Button>
              </>
            )}

            {canEnroll && (
              <Button
                type="primary"
                onClick={() => window.location.assign("/enrollments/create")}
              >
                Enroll in Class
              </Button>
            )}
          </Space>
        </Card>
      </Space>
    </div>
  );
};