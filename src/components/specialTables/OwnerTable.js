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
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import React from "react";
import { positiontoDMS, DMStodecimal } from "../../helper/position";
import PositionBox from "../form/PositionBox";
import { type_list, movement_list } from "../../helper/dropdown";
import DateBox from "../form/DateBox";
import dayjs from "dayjs";
const StyledInput = styled.div`
  .ant-form-item-explain-error {
    font-size: 12px;
  }
`;
function OwnerTable(props) {
  const { ownerData, setOwnerData, showButtons } = props;
  const [ownerForm] = useForm();
  const [ownerKey, setOwnerKey] = useState("");
  const [showInputs, setShowInputs] = useState({
    ownerColumns: false,
  });

  const handleOwnerColumnShowInput = () => {
    ownerForm.resetFields();
    setShowInputs({ ...showInputs, ownerColumns: true });
  };

  const handleOwnerCancel = (event) => {
    event.preventDefault();
    Modal.confirm({
      title: `Are you sure, you want don't want to add data?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setShowInputs({ ...showInputs, ownerColumns: false });
      },
    });
    ownerForm.resetFields();
  };

  const handleOwnerDelete = (record_index) => {
    Modal.confirm({
      title: `Are you sure, you want to delete this field?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setOwnerData((prev) =>
          prev.filter((item, index) => index !== record_index)
        );
      },
    });
    ownerForm.resetFields();
  };

  const isOwnerEditing = (record_index) => record_index === ownerKey;

  const ownerDataEdited = (key) => {
    const editedValues = ownerForm.getFieldValue();
    const newEdited = {
      ...editedValues,
    };
    setOwnerData((previous) => {
      const newItems = [...previous];
      newItems[key] = newEdited;
      return newItems;
    });
    setOwnerKey("");
    ownerForm.resetFields();
  };

  const onOwnerFinish = async () => {
    const validatedValues = await ownerForm.validateFields();
    if (validatedValues) {
      setOwnerData((current) => [
        ...current,
        {
          ...validatedValues,
        },
      ]);
      toast.success(`Owner data added`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setShowInputs({ ...showInputs, ownerColumns: false });
      ownerForm.resetFields();
    }
  };

  const ownerColumns = [
    {
      title: "Name",
      dataIndex: "sro_name",
      render: (text, record, index) => {
        return (showInputs.ownerColumns && index === 0) |
          isOwnerEditing(index) ? (
          <StyledInput>
            <InputBox
              placeholder="Name"
              name="sro_name"
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
      dataIndex: "sro_nationality",
      render: (text, record, index) => {
        return (showInputs.ownerColumns && index === 0) |
          isOwnerEditing(index) ? (
          <StyledInput>
            <InputBox
              placeholder="Nationality"
              name="sro_nationality"
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
      title: "ID Type",
      dataIndex: "sro_idtype",
      render: (text, record, index) => {
        return (showInputs.ownerColumns && index === 0) |
          isOwnerEditing(index) ? (
          <StyledInput>
            <InputBox
              placeholder="ID Type"
              name="sro_idtype"
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
      title: "ID Number",
      dataIndex: "sro_id",
      render: (text, record, index) => {
        return (showInputs.ownerColumns && index === 0) |
          isOwnerEditing(index) ? (
          <StyledInput>
            <InputBox
              placeholder="ID"
              name="sro_id"
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
      title: "ID Exp. Date",
      dataIndex: "sro_idexpdt",
      ellipsis: true,
      render: (text, record, index) => {
        if ((showInputs.ownerColumns && index === 0) | isOwnerEditing(index)) {
          return (
            <StyledInput>
              <DateBox
                style={{ with: 100 }}
                format="YYYY-MM-DD"
                // showTime={{
                //   defaultValue: dayjs("00:00:00", "HH:mm:ss"),
                // }}
                name="sro_idexpdt"
                rules={[
                  {
                    required: true,
                    message: "Please select a date!",
                  },
                ]}
              />
            </StyledInput>
          );
        } else {
          return record?.sro_idexpdt ? dayjs(text).format("YYYY-MM-DD") : text;
        }
      },
    },
    {
      title: "Ethnicity",
      dataIndex: "sro_ethnicity",
      render: (text, record, index) => {
        return (showInputs.ownerColumns && index === 0) |
          isOwnerEditing(index) ? (
          <StyledInput>
            <InputBox
              placeholder="Ethinicity"
              name="sro_ethnicity"
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
      title: "Share (%)",
      dataIndex: "sro_share",
      render: (text, record, index) => {
        return (showInputs.ownerColumns && index === 0) |
          isOwnerEditing(index) ? (
          <StyledInput>
            <InputNumBox
              placeholder="Share"
              name="sro_share"
              type="number"
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
      title: "Mobile Number",
      dataIndex: "sro_cell",
      ellipsis:true,
      
      render: (text, record, index) => {
        return (showInputs.ownerColumns && index === 0) |
          isOwnerEditing(index) ? (
          <StyledInput>
            <InputBox
              placeholder="0332-4324223"
              name="sro_cell"
              pattern={/^\+?[0-9]+(-[0-9]+)*$|^[0-9]+$/}
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
                {
                  pattern: /^\+?[0-9]+(-[0-9]+)*$|^[0-9]+$/,
                  message: "Please enter a valid mobile number!",
                },
                {
                  pattern: /^\d{11}$/,
                  message: "Please enter a valid 11-digit mobile number!",
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
          if (showInputs.ownerColumns && index === 0) {
            return (
              <Form.Item>
                <div style={{ display: "flex" }}>
                  <SimpleButton
                    onClick={handleOwnerCancel}
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
                    onClick={onOwnerFinish}
                  />
                </div>
              </Form.Item>
            );
          } else {
            if (!showInputs.ownerColumns) {
              if (isOwnerEditing(index)) {
                return (
                  <Form.Item>
                    <div style={{ display: "flex" }}>
                      <SimpleButton
                        onClick={() => {
                          setOwnerKey("");
                          ownerForm.resetFields();
                        }}
                        style={{
                          fontWeight: "bold",
                        }}
                        text="Cancel"
                      />
                      <SimpleButton
                        onClick={() => {
                          ownerDataEdited(index);
                        }}
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
                return (
                  <IconsStylingWrap>
                    <MdModeEditOutline
                      className="editIcon"
                      onClick={() => {
                        setOwnerKey(index);
                        ownerForm.setFieldsValue(record);
                        ownerForm.resetFields;
                      }}
                    />
                    <MdDelete
                      onClick={() => handleOwnerDelete(index)}
                      className="deleteIcon"
                    />
                  </IconsStylingWrap>
                );
              }
            }
          }
        }
      },
    },
  ];

  return (
    <Form form={ownerForm} onFinish={onOwnerFinish} className="mb-8">
      <Row className="mb-5">
        <Col span={24} className="flex justify-between">
          <Heading level={5} text="Owner Details" />
          {showButtons && (
            <FilledButton
              text="+Add Owner Details"
              className="rounded-full border-midnight bg-midnight text-white"
              onClick={handleOwnerColumnShowInput}
              disabled={ownerKey !== ""}
            />
          )}
        </Col>
      </Row>
      <StyledDiv>
        <Table
          scroll={{ x: "auto" }} // Set the scroll property as per your requirements
          columns={ownerColumns}
          dataSource={showInputs.ownerColumns ? [{}, ...ownerData] : ownerData}
          pagination={true}
        />
      </StyledDiv>
    </Form>
  );
}

export default OwnerTable;
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
