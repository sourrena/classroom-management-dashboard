import { useShow } from "@refinedev/core";
import { Show } from "@refinedev/antd";
import { Typography } from "antd";
import { formatDateTime } from "../../lib/format";

const { Title, Text, Paragraph } = Typography;

type Subject = {
  id: string;
  name: string;
  code: string;
  description: string | null;
  departmentId: string;
  departmentName: string;
  departmentCode: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
};

export const SubjectShow = () => {
  const { query } = useShow<Subject>({
    resource: "subjects",
  });

  const { data, isLoading } = query;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Title level={4}>{record?.name}</Title>

      <Paragraph>
        <Text strong>Code: </Text>
        {record?.code}
      </Paragraph>

      <Paragraph>
  <Text strong>Department: </Text>
  {record?.departmentName
    ? `${record.departmentName} (${record.departmentCode})`
    : "No department"}
</Paragraph>

      <Paragraph>
        <Text strong>Status: </Text>
        {record?.status}
      </Paragraph>

      <Paragraph>
        <Text strong>Description: </Text>
        {record?.description || "No description"}
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