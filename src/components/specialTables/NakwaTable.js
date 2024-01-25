import { useState } from "react";
import { Col, Row, Table, Input, Form, InputNumber, Modal } from "antd";
import Heading from "../title/Heading";
import SimpleButton from "../button/SimpleButton";
import styled from "styled-components";
import FilledButton from "../button/FilledButton";
import InputBox from "../form/InputBox";
import SelectBox from "../form/SelectBox";
import { useForm } from "antd/lib/form/Form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputNumBox from "../form/InputNumBox";
import PositionBox from "../form/PositionBox";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import React from "react";
import DateBox from "../form/DateBox";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import {
  action_list,
  country_list,
  ethnicity_list,
  movement_list,
  patrol_type_list,
  port_list,
} from "../../helper/dropdown";
import { Cascader, Select, Space } from "antd";
import {
  positiontoDMS,
  DMStodecimal,
  dtgToString,
} from "../../helper/position";
import AntdTable from "../table/AntdTable";

const StyledInput = styled.div`
  .ant-form-item-explain-error {
    font-size: 12px;
  }
`;

function FishingNakwaTable(props) {
  const { nakwaData, setNakwaData, showButtons } = props;
  const { nakwaDataEntered, setNakwaDataEntered } = props.nakwaDataState;
  const [nakwaForm] = useForm();
  const [showInputs, setShowInputs] = useState({
    nakwaColumns: false,
    // data_available: false,
    nakwa_editing: false,
  });
  const handleNakwaCancel = (event) => {
    event.preventDefault();
    Modal.confirm({
      title: `Are you sure, you want don't want to add data?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setShowInputs({ ...showInputs, nakwaColumns: false });
      },
    });
  };

  const nakwaDataEdited = () => {
    const editedValues = nakwaForm.getFieldValue();

    if (editedValues) {
      setNakwaData(editedValues);
    }
    setShowInputs({ ...showInputs, nakwa_editing: false });
  };

  const handleNakwaShowInput = () => {
    setShowInputs({ ...showInputs, nakwaColumns: true });
  };

  const onNakwaFinish = async () => {
    const validatedValues = await nakwaForm.validateFields();

    if (validatedValues) {
      setNakwaData({
        ...validatedValues,
      });
      toast.success(`Nakwa data added`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setShowInputs({ ...showInputs, nakwaColumns: false });
      setNakwaDataEntered(true);
      // nakwaForm.resetFields();
    }
  };

  const nakwaColumns = [
    {
      title: "Name",
      dataIndex: "src_name",
      render: (text, record) => {
        return showInputs.nakwaColumns | showInputs.nakwa_editing ? (
          <StyledInput>
            <InputBox
              placeholder="Enter Name"
              name="src_name"
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]}
            />
          </StyledInput>
        ) : (
          text
        );
      },
    },
    {
      title: "Nationality",
      dataIndex: "src_nationality",
      render: (text, record) => {
        return showInputs.nakwaColumns | showInputs.nakwa_editing ? (
          <StyledInput>
            <SelectBox
              placeholder="Nationality"
              name="src_nationality"
              options={country_list.map((item) => ({
                value: item,
                label: item,
              }))}
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]}
            />
          </StyledInput>
        ) : (
          text
        );
      },
    },
    {
      title: "Ethnicity",
      dataIndex: "src_ethnicity",
      render: (text, record) => {
        return showInputs.nakwaColumns | showInputs.nakwa_editing ? (
          <StyledInput>
            <SelectBox
              placeholder="Ethnicity"
              name="src_ethnicity"
              options={ethnicity_list.map((item) => ({
                value: item,
                label: item,
              }))}
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]}
            />
          </StyledInput>
        ) : (
          text
        );
      },
    },
    {
      title: "Cell Number",
      dataIndex: "src_cell",
      render: (text, record) => {
        return showInputs.nakwaColumns | showInputs.nakwa_editing ? (
          <StyledInput>
            <InputBox
              placeholder="0321-1234567"
              name="src_cell"
              // options={port_list.map((item) => ({value: item, label: item}))}
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]}
            />
          </StyledInput>
        ) : (
          text
        );
      },
    },
    {
      title: "",
      dataIndex: "action",
      render: (text, record, index) => {
        if (showButtons) {
          if (showInputs.nakwaColumns) {
            return (
              <Form.Item>
                <div style={{ display: "flex" }}>
                  <SimpleButton
                    onClick={handleNakwaCancel}
                    style={{
                      fontWeight: "bold",
                    }}
                    text="Cancel"
                  />
                  <SimpleButton
                    style={{
                      fontWeight: "bold",
                      color: "white",
                      backgroundColor: "#51AE3B",
                    }}
                    text="Save"
                    onClick={onNakwaFinish}
                  />
                </div>
              </Form.Item>
            );
          } else {
            if (showInputs.nakwa_editing) {
              return (
                <Form.Item>
                  <div style={{ display: "flex" }}>
                    <SimpleButton
                      onClick={() =>
                        setShowInputs({ ...showInputs, nakwa_editing: false })
                      }
                      style={{
                        fontWeight: "bold",
                      }}
                      text="Cancel"
                    />
                    <SimpleButton
                      onClick={() => nakwaDataEdited()}
                      style={{
                        fontWeight: "bold",
                        color: "white",
                        backgroundColor: "#ffbf00",
                      }}
                      text="Edit"
                    />
                  </div>
                </Form.Item>
              );
            } else {
              return nakwaDataEntered ? (
                <IconsStylingWrap>
                  <MdModeEditOutline
                    className="editIcon"
                    onClick={() => {
                      setShowInputs({ ...showInputs, nakwa_editing: true });
                      nakwaForm.setFieldsValue(record);
                    }}
                  />
                  {/* <MdDelete
                        onClick={() => handleNakwaDataDelete(record)}
                        className="deleteIcon"
                      /> */}
                </IconsStylingWrap>
              ) : (
                text
              );
            }
          }
        }
      },
    },
  ];

  return (
    // <Form form={nakwaForm} onFinish={onNakwaFinish} className="mb-8">
    //   <Row className="mb-5">
    //     <Col span={24} className="flex justify-between">
    //       <Heading level={5} text="Nakwa Details" />
    //       {/* {showButtons && (<FilledButton
    //           disabled={nakwaDataEntered}
    //           text="+Add Nakwa Details"
    //           className="rounded-full border-midnight bg-midnight text-white"
    //           onClick={handleNakwaShowInput}
    //         />)} */}
    //     </Col>
    //   </Row>

    //   <StyledDiv>
    //     <Table
    //       columns={nakwaColumns}
    //       dataSource={[nakwaData]}
    //       pagination={false}
    //     />
    //   </StyledDiv>
    // </Form>
    <div className="mb-10">
      {/* //{" "} */}
      {/* <Form form={goodsForm} onFinish={onGoodsFinish} className="mb-8"> */}
      <Row>
        <Col span={12} className="flex justify-start">
          <Heading className="ml-5" level={5} text="Nakwa Details" />
        </Col>
        <Col span={12} className="flex justify-end">
          {showButtons && (
            <FilledButton
              text="+ Add Nakwa Details"
              className="rounded-full border-midnight bg-midnight text-white mx-8"
              onClick={handleNakwaShowInput}
              disabled={nakwaDataEntered}
            />
          )}
        </Col>
      </Row>

      {/* if showInputs.goodsColumns is true. If it is, it adds an empty row ({})
        at the beginning of the list. If not, it just shows the list as it is. */}
      <AntdTable
        scroll={{ x: "auto" }} // Set the scroll property as per your requirements
        columns={nakwaColumns}
        data={[nakwaData]}
        pagination={false}
        form={nakwaForm}
        onFinish={onNakwaFinish}
      />

      {/* //{" "} */}
      {/* </Form> */}
    </div>
  );
}

export default FishingNakwaTable;
const StyledDiv = styled.div`
  box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
    rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
  border-radius: 10px;
`;
const IconsStylingWrap = styled.div`
  display: flex;
  /* gap: 20px; */
  .editIcon {
    color: #28387e;
    background-color: #f0f3f8;
    border-radius: 20px;
    font-size: 25px;
    padding: 5px;
    margin-right: 10px;
    cursor: pointer;
  }
  .deleteIcon {
    color: #e96162;
    background-color: #f9e7e8;
    border-radius: 20px;
    font-size: 25px;
    padding: 5px;
    cursor: pointer;
  }
`;
