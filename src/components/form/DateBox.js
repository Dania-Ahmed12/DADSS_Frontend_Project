import { DatePicker, Form } from "antd";
import React from "react";

function DateBox(props) {
  return (
    <Form.Item label={props.label} name={props.name} rules={props.rules}>
      <DatePicker {...props} />
    </Form.Item>
  );
}

export default DateBox;
