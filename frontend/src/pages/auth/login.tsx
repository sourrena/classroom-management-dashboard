import { useState } from "react";
import { Alert, Button, Card, Form, Input, Typography } from "antd";
import { Link, useNavigate } from "react-router";
import { api } from "../../lib/api";

const { Title, Paragraph, Text } = Typography;

type LoginFormValues = {
  email: string;
  password: string;
};

type LoginResponse = {
  success: boolean;
  data: {
    user: {
      id: string;
      fullName: string;
      email: string;
      role: "teacher" | "student";
      avatarUrl: string | null;
    };
    token: string;
  };
};

export const LoginPage = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (values: LoginFormValues) => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await api.post<LoginResponse>("/auth/login", values);

      const { token, user } = response.data.data;

      localStorage.setItem("classroom_token", token);
      localStorage.setItem("classroom_user", JSON.stringify(user));

      navigate("/");
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message || "Invalid email or password."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Card className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo">CMD</div>

          <Title level={2} className="auth-title">
            Welcome back
          </Title>

          <Paragraph className="auth-subtitle">
            Sign in to manage departments, subjects, classes, and enrollments.
          </Paragraph>
        </div>

        <div className="auth-demo-box">
          <Text strong>Demo teacher:</Text> alice.teacher@test.com / password123
          <br />
          <Text strong>Demo student:</Text> sofia.student@test.com / password123
        </div>

        {errorMessage && (
          <Alert
            type="error"
            message={errorMessage}
            style={{ marginBottom: 16 }}
          />
        )}

        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input placeholder="alice.teacher@test.com" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password placeholder="password123" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={isLoading}>
            Login
          </Button>
        </Form>

        <div className="auth-footer">
          <Text>Don&apos;t have an account? </Text>
          <Link to="/register">Create one</Link>
        </div>
      </Card>
    </div>
  );
};