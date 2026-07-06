import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select } from "antd";

type DepartmentFormValues = {
  name: string;
  code: string;
  description?: string;
  status?: "active" | "inactive";
};

export const DepartmentEdit = () => {
  const { formProps, saveButtonProps } = useForm<DepartmentFormValues>({
    resource: "departments",
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
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
          <Input />
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
          <Input />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea rows={4} />
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
    </Edit>
  );
};