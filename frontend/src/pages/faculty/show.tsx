import { useShow } from "@refinedev/core";
import { Show } from "@refinedev/antd";
import { Avatar, Typography } from "antd";
import { formatDateTime } from "../../lib/format";

const { Title, Text, Paragraph } = Typography;

type FacultyMember = {
  id: string;
  fullName: string;
  email: string;
  role: "teacher";
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export const FacultyShow = () => {
  const { query } = useShow<FacultyMember>({
    resource: "faculty",
  });

  const { data, isLoading } = query;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Avatar size={80} src={record?.avatarUrl}>
        {record?.fullName?.[0]}
      </Avatar>

      <Title level={4} style={{ marginTop: 16 }}>
        {record?.fullName}
      </Title>

      <Paragraph>
        <Text strong>Email: </Text>
        {record?.email}
      </Paragraph>

      <Paragraph>
        <Text strong>Role: </Text>
        {record?.role}
      </Paragraph>

      <Paragraph>
        <Text strong>Created At: </Text>
        {formatDateTime(record?.createdAt)}
      </Paragraph>

      <Paragraph>
        <Text strong>Updated At: </Text>
        {formatDateTime(record?.updatedAt)}
      </Paragraph>
    </Show>
  );
};