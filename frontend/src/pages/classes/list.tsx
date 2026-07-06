import {
  EditButton,
  List,
  ShowButton,
  useSelect,
  useTable,
} from "@refinedev/antd";
import type { HttpError } from "@refinedev/core";
import { Button, Form, Image, Input, Select, Space, Table, Tag } from "antd";
import { isTeacher } from "../../lib/current-user";

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
};

type Subject = {
  id: string;
  name: string;
  code: string;
};

type FacultyMember = {
  id: string;
  fullName: string;
  email: string;
};

type ClassSearchValues = {
  search?: string;
  subjectId?: string;
  teacherId?: string;
  status?: "active" | "inactive";
};

export const ClassList = () => {
  const canManageClasses = isTeacher();

  const { tableProps, searchFormProps } = useTable<
    ClassItem,
    HttpError,
    ClassSearchValues
  >({
    resource: "classes",
    onSearch: async (values) => {
      return [
        {
          field: "search",
          operator: "contains",
          value: values.search,
        },
        {
          field: "subjectId",
          operator: "eq",
          value: values.subjectId,
        },
        {
          field: "teacherId",
          operator: "eq",
          value: values.teacherId,
        },
        {
          field: "status",
          operator: "eq",
          value: values.status,
        },
      ];
    },
  });

  const { selectProps: subjectSelectProps } = useSelect<Subject>({
    resource: "subjects",
    optionLabel: "name",
    optionValue: "id",
  });

  const { selectProps: teacherSelectProps } = useSelect<FacultyMember>({
    resource: "faculty",
    optionLabel: "fullName",
    optionValue: "id",
  });

  return (
    <List canCreate={canManageClasses}>
      <Form
        {...searchFormProps}
        layout="inline"
        style={{ marginBottom: 16 }}
      >
        <Form.Item name="search">
          <Input
            allowClear
            placeholder="Search classes..."
            style={{ width: 220 }}
          />
        </Form.Item>

        <Form.Item name="subjectId">
          <Select
            {...subjectSelectProps}
            allowClear
            placeholder="Filter by subject"
            style={{ width: 220 }}
          />
        </Form.Item>

        <Form.Item name="teacherId">
          <Select
            {...teacherSelectProps}
            allowClear
            placeholder="Filter by teacher"
            style={{ width: 220 }}
          />
        </Form.Item>

        <Form.Item name="status">
          <Select
            allowClear
            placeholder="Filter by status"
            style={{ width: 180 }}
            options={[
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ]}
          />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Search
        </Button>
      </Form>

      <Table {...tableProps} rowKey="id">
        <Table.Column<ClassItem>
  title="Banner"
  render={(_, record) =>
    record.bannerImageUrl ? (
      <Image
        src={record.bannerImageUrl}
        alt={record.title}
        width={72}
        height={44}
        style={{ objectFit: "cover", borderRadius: 6 }}
      />
    ) : (
      "-"
    )
  }
/>
        <Table.Column<ClassItem> dataIndex="title" title="Title" />
        <Table.Column<ClassItem> dataIndex="subjectName" title="Subject" />
        <Table.Column<ClassItem> dataIndex="teacherName" title="Teacher" />
        <Table.Column<ClassItem> dataIndex="capacity" title="Capacity" />

        <Table.Column<ClassItem>
          dataIndex="status"
          title="Status"
          render={(value) => (
            <Tag color={value === "active" ? "green" : "red"}>{value}</Tag>
          )}
        />

        <Table.Column<ClassItem>
          title="Actions"
          render={(_, record) => (
            <Space>
              <ShowButton hideText size="small" recordItemId={record.id} />

              {canManageClasses && (
                <EditButton hideText size="small" recordItemId={record.id} />
              )}
            </Space>
          )}
        />
      </Table>
    </List>
  );
};