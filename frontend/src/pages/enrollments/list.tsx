import { DeleteButton, List, useSelect, useTable } from "@refinedev/antd";
import type { HttpError } from "@refinedev/core";
import { Button, Form, Input, Select, Space, Table } from "antd";
import { isStudent } from "../../lib/current-user";
import { formatDateTime } from "../../lib/format";

type Enrollment = {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  classId: string;
  classTitle: string;
  subjectId: string;
  subjectName: string;
  enrolledAt: string;
};

type ClassItem = {
  id: string;
  title: string;
  subjectName: string;
  teacherName: string;
};

type EnrollmentSearchValues = {
  search?: string;
  classId?: string;
};

export const EnrollmentList = () => {
  const canCreateEnrollment = isStudent();

  const { tableProps, searchFormProps } = useTable<
    Enrollment,
    HttpError,
    EnrollmentSearchValues
  >({
    resource: "enrollments",
    onSearch: async (values) => {
      return [
        {
          field: "search",
          operator: "contains",
          value: values.search,
        },
        {
          field: "classId",
          operator: "eq",
          value: values.classId,
        },
      ];
    },
  });

  const { selectProps: classSelectProps } = useSelect<ClassItem>({
    resource: "classes",
    optionLabel: "title",
    optionValue: "id",
  });

  return (
    <List canCreate={canCreateEnrollment}>
      <Form
        {...searchFormProps}
        layout="inline"
        style={{ marginBottom: 16 }}
      >
        <Form.Item name="search">
          <Input
            allowClear
            placeholder="Search enrollments..."
            style={{ width: 260 }}
          />
        </Form.Item>

        <Form.Item name="classId">
          <Select
            {...classSelectProps}
            allowClear
            placeholder="Filter by class"
            style={{ width: 280 }}
          />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Search
        </Button>
      </Form>

      <Table {...tableProps} rowKey="id">
        <Table.Column<Enrollment> dataIndex="studentName" title="Student" />

        <Table.Column<Enrollment>
          dataIndex="studentEmail"
          title="Student Email"
        />

        <Table.Column<Enrollment> dataIndex="classTitle" title="Class" />

        <Table.Column<Enrollment> dataIndex="subjectName" title="Subject" />

        <Table.Column<Enrollment>
          dataIndex="enrolledAt"
          title="Enrolled At"
          render={(value) => formatDateTime(value)}
        />

        <Table.Column<Enrollment>
          title="Actions"
          render={(_, record) => (
            <Space>
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};