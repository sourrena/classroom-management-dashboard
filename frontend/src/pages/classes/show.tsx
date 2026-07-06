import { useShow } from "@refinedev/core";
import { Show } from "@refinedev/antd";
import { Image, Tag, Typography } from "antd";
import { formatDateTime } from "../../lib/format";

const { Title, Text, Paragraph } = Typography;

type ClassItem = {
  id: string;
  title: string;
  description: string | null;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  capacity: number;
  bannerImageUrl: string | null;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
};

export const ClassShow = () => {
  const { query } = useShow<ClassItem>({
    resource: "classes",
  });

  const { data, isLoading } = query;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      {record?.bannerImageUrl && (
        <Image
          src={record.bannerImageUrl}
          alt={record.title}
          width={400}
          style={{ marginBottom: 16 }}
        />
      )}

      <Title level={4}>{record?.title}</Title>

      <Paragraph>
        <Text strong>Subject: </Text>
        {record?.subjectName} ({record?.subjectCode})
      </Paragraph>

      <Paragraph>
        <Text strong>Teacher: </Text>
        {record?.teacherName} — {record?.teacherEmail}
      </Paragraph>

      <Paragraph>
        <Text strong>Capacity: </Text>
        {record?.capacity}
      </Paragraph>

      <Paragraph>
        <Text strong>Status: </Text>
        <Tag color={record?.status === "active" ? "green" : "red"}>
          {record?.status}
        </Tag>
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