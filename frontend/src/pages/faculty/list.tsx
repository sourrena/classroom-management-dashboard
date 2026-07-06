import { List, ShowButton, useTable } from "@refinedev/antd";
import type { HttpError } from "@refinedev/core";
import { Avatar, Button, Form, Input, Space, Table } from "antd";

type FacultyMember = {
  id: string;
  fullName: string;
  email: string;
  role: "teacher";
  avatarUrl: string | null;
  createdAt: string;
};

type FacultySearchValues = {
  search?: string;
};

export const FacultyList = () => {
  const { tableProps, searchFormProps } = useTable<
    FacultyMember,
    HttpError,
    FacultySearchValues
  >({
    resource: "faculty",
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
    <List canCreate={false}>
      <Form
        {...searchFormProps}
        layout="inline"
        style={{ marginBottom: 16 }}
      >
        <Form.Item name="search">
          <Input
            allowClear
            placeholder="Search faculty..."
            style={{ width: 280 }}
          />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Search
        </Button>
      </Form>

      <Table {...tableProps} rowKey="id">
        <Table.Column<FacultyMember>
          title="Avatar"
          render={(_, record) => (
            <Avatar src={record.avatarUrl}>{record.fullName[0]}</Avatar>
          )}
        />

        <Table.Column<FacultyMember> dataIndex="fullName" title="Full Name" />
        <Table.Column<FacultyMember> dataIndex="email" title="Email" />
        <Table.Column<FacultyMember> dataIndex="role" title="Role" />

        <Table.Column<FacultyMember>
          title="Actions"
          render={(_, record) => (
            <Space>
              <ShowButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};