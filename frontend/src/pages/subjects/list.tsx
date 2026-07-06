import { EditButton, List, ShowButton, useSelect, useTable } from "@refinedev/antd";
import type { HttpError } from "@refinedev/core";
import { Button, Form, Input, Select, Space, Table, Tag } from "antd";
import { isTeacher } from "../../lib/current-user";

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
};

type Department = {
  id: string;
  name: string;
  code: string;
};

type SubjectSearchValues = {
  search?: string;
  departmentId?: string;
};

export const SubjectList = () => {
  const canManageSubjects = isTeacher();

  const { tableProps, searchFormProps } = useTable<
    Subject,
    HttpError,
    SubjectSearchValues
  >({
    resource: "subjects",
    onSearch: async (values) => {
      return [
        {
          field: "search",
          operator: "contains",
          value: values.search,
        },
        {
          field: "departmentId",
          operator: "eq",
          value: values.departmentId,
        },
      ];
    },
  });

  const { selectProps: departmentSelectProps } = useSelect<Department>({
    resource: "departments",
    optionLabel: "name",
    optionValue: "id",
  });

  return (
    <List canCreate={canManageSubjects}>
      <Form
        {...searchFormProps}
        layout="inline"
        style={{ marginBottom: 16 }}
      >
        <Form.Item name="search">
          <Input
            allowClear
            placeholder="Search subjects..."
            style={{ width: 260 }}
          />
        </Form.Item>

        <Form.Item name="departmentId">
          <Select
            {...departmentSelectProps}
            allowClear
            placeholder="Filter by department"
            style={{ width: 260 }}
          />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Search
        </Button>
      </Form>

      <Table {...tableProps} rowKey="id">
        <Table.Column<Subject> dataIndex="name" title="Name" />
        <Table.Column<Subject> dataIndex="code" title="Code" />
        <Table.Column<Subject>
  title="Department"
  render={(_, record) =>
    record.departmentName
      ? `${record.departmentName} (${record.departmentCode})`
      : "No department"
  }
/>

        <Table.Column<Subject>
          dataIndex="status"
          title="Status"
          render={(value) => (
            <Tag color={value === "active" ? "green" : "red"}>{value}</Tag>
          )}
        />

        <Table.Column<Subject>
          dataIndex="description"
          title="Description"
        />

        <Table.Column<Subject>
          title="Actions"
          render={(_, record) => (
            <Space>
              <ShowButton hideText size="small" recordItemId={record.id} />

              {canManageSubjects && (
                <EditButton hideText size="small" recordItemId={record.id} />
              )}
            </Space>
          )}
        />
      </Table>
    </List>
  );
};