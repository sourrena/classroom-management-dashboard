import { Create, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, Select } from "antd";

type SubjectFormValues = {
  name: string;
  code: string;
  description?: string;
  departmentId: string;
  status?: "active" | "inactive";
};

type Department = {
  id: string;
  name: string;
  code: string;
};

export const SubjectCreate = () => {
  const { formProps, saveButtonProps } = useForm<SubjectFormValues>({
    resource: "subjects",
  });

  const { selectProps: departmentSelectProps } = useSelect<Department>({
    resource: "departments",
    optionLabel: "name",
    optionValue: "id",
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
              message: "Subject name is required",
            },
          ]}
        >
          <Input placeholder="Web Development" />
        </Form.Item>

        <Form.Item
          label="Code"
          name="code"
          rules={[
            {
              required: true,
              message: "Subject code is required",
            },
          ]}
        >
          <Input placeholder="WEB101" />
        </Form.Item>

        <Form.Item
          label="Department"
          name="departmentId"
          rules={[
            {
              required: true,
              message: "Department is required",
            },
          ]}
        >
          <Select
            {...departmentSelectProps}
            placeholder="Select department"
          />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea
            rows={4}
            placeholder="Frontend, backend, APIs, and database-driven web apps."
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