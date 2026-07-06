import { Create, useForm, useSelect } from "@refinedev/antd";
import { Form, Select } from "antd";

type EnrollmentFormValues = {
  classId: string;
};

type ClassItem = {
  id: string;
  title: string;
  subjectName: string;
  teacherName: string;
};

export const EnrollmentCreate = () => {
  const { formProps, saveButtonProps } = useForm<EnrollmentFormValues>({
    resource: "enrollments",
  });

  const { selectProps: classSelectProps } = useSelect<ClassItem>({
    resource: "classes",
    optionLabel: "title",
    optionValue: "id",
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Class"
          name="classId"
          rules={[
            {
              required: true,
              message: "Class is required",
            },
          ]}
        >
          <Select {...classSelectProps} placeholder="Select class" />
        </Form.Item>
      </Form>
    </Create>
  );
};