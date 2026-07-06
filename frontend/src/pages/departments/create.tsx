import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select } from "antd";

type DepartmentFormValues = {
  name: string;
  code: string;
  description?: string;
  status?: "active" | "inactive";
};

export const DepartmentCreate = () => {
  const { formProps, saveButtonProps } = useForm<DepartmentFormValues>({
    resource: "departments",
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form
        {...formProps}
        layout="vertical"
        initialValues={{
          status: "active",
        }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Department name is required",
            },
          ]}
        >
          <Input placeholder="Computer Engineering" />
        </Form.Item>

        <Form.Item
          label="Code"
          name="code"
          rules={[
            {
              required: true,
              message: "Department code is required",
            },
          ]}
        >
          <Input placeholder="CE" />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea
            rows={4}
            placeholder="Department focused on software, systems, and computing."
          />
        </Form.Item>

        <Form.Item label="Status" name="status">
          <Select
            options={[
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ]}
          />
        </Form.Item>
      </Form>
    </Create>
  );
};