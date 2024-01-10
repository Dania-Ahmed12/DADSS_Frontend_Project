import { Form, Input, Select } from "antd";
import React from "react";
const { Option } = Select;



const SelectBox = (props) => {
  return (
    <Form.Item
      label={props.label}
      name={props.name}
      rules={props.rules}
    >
      <Select
        className="border-black text-md"
        {...props}
      >
        {props.options.map((option) => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );
};
export default SelectBox;
