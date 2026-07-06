import { Edit, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, InputNumber, Select } from "antd";

type ClassFormValues = {
  title: string;
  description?: string;
  subjectId: string;
  teacherId: string;
  capacity: number;
  bannerImageUrl?: string;
  status?: "active" | "inactive";
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

export const ClassEdit = () => {
  const { formProps, saveButtonProps } = useForm<ClassFormValues>({
    resource: "classes",
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
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Title"
          name="title"
          rules={[
            {
              required: true,
              message: "Class title is required",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Subject"
          name="subjectId"
          rules={[
            {
              required: true,
              message: "Subject is required",
            },
          ]}
        >
          <Select {...subjectSelectProps} />
        </Form.Item>

        <Form.Item
          label="Teacher"
          name="teacherId"
          rules={[
            {
              required: true,
              message: "Teacher is required",
            },
          ]}
        >
          <Select {...teacherSelectProps} />
        </Form.Item>

        <Form.Item
          label="Capacity"
          name="capacity"
          rules={[
            {
              required: true,
              message: "Capacity is required",
            },
          ]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>
          
          <Form.Item
  label="Banner Image URL"
  name="bannerImageUrl"
  rules={[
    {
      type: "url",
      message: "Please enter a valid image URL",
    },
  ]}
>
  <Input />
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