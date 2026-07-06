import { useState } from "react";
import { Button, Card, Form, Input, Select, Typography, Alert } from "antd";
import { Link, useNavigate } from "react-router";
import { api } from "../../lib/api";

const { Title, Text } = Typography;

type RegisterFormValues = {
  fullName: string;
  email: string;
  password: string;
  role: "teacher" | "student";
  avatarUrl?: string;
};

type RegisterResponse = {
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

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async (values: RegisterFormValues) => {
    try {
      setErrorMessage("");

      const response = await api.post<RegisterResponse>("/auth/register", values);

      const { token, user } = response.data.data;

      localStorage.setItem("classroom_token", token);
      localStorage.setItem("classroom_user", JSON.stringify(user));

      navigate("/");
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
        padding: 24,
      }}
    >
      <Card style={{ width: 420 }}>
        <Title level={3}>Create account</Title>

        {errorMessage && (
          <Alert
            type="error"
            message={errorMessage}
            style={{ marginBottom: 16 }}
          />
        )}

        <Form
          layout="vertical"
          onFinish={handleRegister}
          initialValues={{
            role: "student",
          }}
        >
          <Form.Item
            label="Full name"
            name="fullName"
            rules={[
              {
                required: true,
                message: "Full name is required",
              },
            ]}
          >
            <Input placeholder="Sofia Bianchi" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Email is required",
              },
              {
                type: "email",
                message: "Please enter a valid email",
              },
            ]}
          >
            <Input placeholder="sofia@student.com" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Password is required",
              },
              {
                min: 6,
                message: "Password must be at least 6 characters",
              },
            ]}
          >
            <Input.Password placeholder="password123" />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[
              {
                required: true,
                message: "Role is required",
              },
            ]}
          >
            <Select
              options={[
                { label: "Student", value: "student" },
                { label: "Teacher", value: "teacher" },
              ]}
            />
          </Form.Item>

          <Form.Item label="Avatar URL" name="avatarUrl">
            <Input placeholder="https://example.com/avatar.png" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Register
          </Button>
        </Form>

        <div style={{ marginTop: 16 }}>
          <Text>Already have an account? </Text>
          <Link to="/login">Login</Link>
        </div>
      </Card>
    </div>
  );
};