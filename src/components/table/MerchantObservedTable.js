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
import PositionBox from "../form/PositionBox";
import { type_list, movement_list, port_list } from "../../helper/dropdown";
import { positiontoDMS, DMStodecimal } from "../../helper/position";
import React from "react";

const StyledInput = styled.div`
  .ant-form-item-explain-error {
    font-size: 12px;
  }
`;
function MerchantObservedTable(props) {
  const { merchantObservedData, setMerchantObservedData } = props;
  const [MerchantObservedForm] = useForm();
  const [merchantObservedKey, setMerchantObservedKey] = useState("");


  const [showInputs, setShowInputs] = useState({
    merchantObservedColumns: false,
  });

  const handleMerchantShowInput = () => {
    MerchantObservedForm.resetFields();
    setShowInputs({ ...showInputs, merchantObservedColumns: true });
    MerchantObservedForm.setFieldValue(["grm_position", "dms", 0, "dir"], "E");
    MerchantObservedForm.setFieldValue(["grm_position", "dms", 1, "dir"], "N");
  };

  const handleMerchantCancel = (event) => {
    event.preventDefault();
    Modal.confirm({
      title: `Are you sure, you want don't want to add data?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setShowInputs({ ...showInputs, merchantObservedColumns: false });
      },
    });
  };

  const handleMerchantObservedDelete = (record_index) => {
    Modal.confirm({
      title: `Are you sure, you want to delete this field?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setMerchantObservedData((prev) =>
          prev.filter((item, index) => index !== record_index)
        );
      },
    });
    MerchantObservedForm.resetFields();
  };

  const isMerchantObservedEditing = (record_index) =>
    record_index === merchantObservedKey;

  const merchantObservedEdited = (key) => {
    const editedValues = MerchantObservedForm.getFieldValue();
    const newEdited = {
      ...editedValues,
      grd_position: {
        ...editedValues.grm_position,
        type: "Point",
        coordinates: DMStodecimal(editedValues.grm_position.dms),
      },
    };
    setMerchantObservedData((previous) => {
      const newItems = [...previous];
      newItems[key] = newEdited;
      return newItems;
    });
    setMerchantObservedKey("");
    MerchantObservedForm.resetFields();
  };

  const onMerchantObservedFinish = async () => {
    const validatedValues = await MerchantObservedForm.validateFields();
    if (validatedValues) {
      setMerchantObservedData((current) => [
        ...current,
        {
          ...validatedValues,
          grm_position: {
            ...validatedValues.grm_position,
            type: "Point",
            coordinates: DMStodecimal(validatedValues.grm_position.dms),
          },
        },
      ]);
      toast.success(`Merchant Observed data added`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setShowInputs({ ...showInputs, merchantObservedColumns: false });
      MerchantObservedForm.resetFields();
    }
  };


  const merchantObservedColumns = [
    {
      title: "Longitude",
      dataIndex: ["grm_position", "dms", 0],
      render: (text, record, index) => {
        if (
          (showInputs.merchantObservedColumns && index === 0) |
          isMerchantObservedEditing(index)
        ) {
          return (
            <StyledInput>
              <PositionBox name={["grm_position", "dms", 0]} coordinate={0} />
            </StyledInput>
          );
        } else {
          return record?.grm_position ? positiontoDMS(text) : text;
        }
      },
    },
    {
      title: "Latitude",
      dataIndex: ["grm_position", "dms", 1],
      render: (text, record, index) => {
        if (
          (showInputs.merchantObservedColumns && index === 0) |
          isMerchantObservedEditing(index)
        ) {
          return (
            <StyledInput>
              <PositionBox name={["grm_position", "dms", 1]} coordinate={1} />
            </StyledInput>
          );
        } else {
          return record?.grm_position ? positiontoDMS(text) : text;
        }
      },
    },
    {
      title: "Vessel Name",
      ellipsis: true,

      dataIndex: "grm_name",
      render: (text, record, index) => {
        return (showInputs.merchantObservedColumns && index === 0) |
          isMerchantObservedEditing(index) ? (
          <StyledInput>
            <InputBox
              placeholder="Vessel Name"
              name="grm_name"
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
      title: "Vessel Type",
      dataIndex: "grm_type",
      render: (text, record, index) => {
        return (showInputs.merchantObservedColumns && index === 0) |
          isMerchantObservedEditing(index) ? (
          <StyledInput>
            <SelectBox
              name="grm_type"
              placeholder="Select Type"
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]}
              options={type_list.map((item) => ({ value: item, label: item }))}
            />
          </StyledInput>
        ) : (
          text
        );
      },
    },
    {
      title: "Vessel Movement",
      dataIndex: "grm_movement",
      ellipsis: true,

      render: (text, record, index) => {
        return (showInputs.merchantObservedColumns && index === 0) |
          isMerchantObservedEditing(index) ? (
          <StyledInput>
            <SelectBox
              name="grm_movement"
              placeholder="Select"
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]}
              options={movement_list.map((item) => ({
                value: item,
                label: item,
              }))}
            />
          </StyledInput>
        ) : (
          text
        );
      },
    },
    {
      title: "LPOC",
      dataIndex: "grm_lpoc",
      render: (text, record, index) => {
        return (showInputs.merchantObservedColumns && index === 0) |
          isMerchantObservedEditing(index) ? (
          <StyledInput>
            <SelectBox
              name="grm_lpoc"
              placeholder="Select"
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]}
              options={port_list.map((item) => ({ value: item, label: item }))}
            />
          </StyledInput>
        ) : (
          text
        );
      },
    },
    {
      title: "NPOC",
      dataIndex: "grm_npoc",
      render: (text, record, index) => {
        return (showInputs.merchantObservedColumns && index === 0) |
          isMerchantObservedEditing(index) ? (
          <StyledInput>
            <SelectBox
              name="grm_npoc"
              placeholder="Select"
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]}
              options={port_list.map((item) => ({ value: item, label: item }))}
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
        if (showInputs.merchantObservedColumns && index === 0) {
          return (
            <Form.Item>
              <div style={{ display: "flex" }}>
                <SimpleButton
                  onClick={handleMerchantCancel}
                  style={{
                    fontWeight: "bold",
                  }}
                  text="Cancel"
                />
                <SimpleButton
                  onClick={onMerchantObservedFinish}
                  style={{
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: "#51AE3B",
                  }}
                  text="Save"
                />
              </div>
            </Form.Item>
          );
        }
        if (!showInputs.merchantObservedColumns) {
          if (
            merchantObservedData.length &&
            !isMerchantObservedEditing(index)
          ) {
            return (
              <IconsStylingWrap>
                <MdModeEditOutline
                  className="editIcon"
                  onClick={() => {
                    setMerchantObservedKey(index);
                    MerchantObservedForm.setFieldsValue(record);
                  }}
                />
                <MdDelete
                  onClick={() => handleMerchantObservedDelete(index)}
                  className="deleteIcon"
                />
              </IconsStylingWrap>
            );
          }
          if (isMerchantObservedEditing(index)) {
            return (
              <Form.Item>
                <div style={{ display: "flex" }}>
                  <SimpleButton
                    onClick={() => {
                      setMerchantObservedKey("");
                    }}
                    style={{
                      fontWeight: "bold",
                    }}
                    text="Cancel"
                  />
                  <SimpleButton
                    onClick={() => {
                      merchantObservedEdited(index);
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
          }
        }
      },
    },
  ];

  return (
    <Form
      form={MerchantObservedForm}
      onFinish={onMerchantObservedFinish}
      className="mb-8"
    >
      <Row className="mb-5">
        <Col span={24} className="flex justify-between">
          <Heading level={5} text="Merchant Observed" />
          <FilledButton
            text="+Add Merchant Observed"
            className="rounded-full border-midnight bg-midnight text-white"
            onClick={handleMerchantShowInput}
            disabled={merchantObservedKey !== ""}
          />
        </Col>
      </Row>
      <StyledDiv>
        <Table
          scroll={{ x: "auto" }} // Set the scroll property as per your requirements
          columns={merchantObservedColumns}
          dataSource={
            showInputs.merchantObservedColumns
              ? [{}, ...merchantObservedData]
              : merchantObservedData
          }
          pagination={true}
        />
      </StyledDiv>
    </Form>
  );
}

export default MerchantObservedTable;
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
