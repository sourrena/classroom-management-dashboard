import { EditButton, List, ShowButton, useTable } from "@refinedev/antd";
import type { HttpError } from "@refinedev/core";
import { Button, Form, Input, Space, Table, Tag } from "antd";
import { isTeacher } from "../../lib/current-user";

type Department = {
  id: string;
  name: string;
  code: string;
  description: string | null;
  status: "active" | "inactive";
  createdAt: string;
};

type DepartmentSearchValues = {
  search?: string;
};

export const DepartmentList = () => {
  const canManageDepartments = isTeacher();

  const { tableProps, searchFormProps } = useTable<
    Department,
    HttpError,
    DepartmentSearchValues
  >({
    resource: "departments",
    onSearch: async (values) => {
      return [
        {
          field: "search",
          operator: "contains",
          value: values.search,
        },
      ];
    },
  });

  return (
    <List canCreate={canManageDepartments}>
      <Form
        {...searchFormProps}
        layout="inline"
        style={{ marginBottom: 16 }}
      >
        <Form.Item name="search">
          <Input
            allowClear
            placeholder="Search departments..."
            style={{ width: 280 }}
          />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Search
        </Button>
      </Form>

      <Table {...tableProps} rowKey="id">
        <Table.Column<Department> dataIndex="name" title="Name" />
        <Table.Column<Department> dataIndex="code" title="Code" />

        <Table.Column<Department>
          dataIndex="status"
          title="Status"
          render={(value) => (
            <Tag color={value === "active" ? "green" : "red"}>{value}</Tag>
          )}
        />

        <Table.Column<Department>
          dataIndex="description"
          title="Description"
        />

        <Table.Column<Department>
          title="Actions"
          render={(_, record) => (
            <Space>
              <ShowButton hideText size="small" recordItemId={record.id} />

              {canManageDepartments && (
                <EditButton hideText size="small" recordItemId={record.id} />
              )}
            </Space>
          )}
        />
      </Table>
    </List>
  );
};