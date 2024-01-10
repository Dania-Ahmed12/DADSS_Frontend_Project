import { Form, Input } from "antd";
import React from "react";

const InputBox = (props) => {
  return (
    <Form.Item label={props.label} name={props.name} rules={props.rules}>
      <Input {...props} />
    </Form.Item>
  );
};
export default InputBox;
