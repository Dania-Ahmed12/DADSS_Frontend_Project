

import { useState } from "react";
import { Col, Row, Table, Input, Form, InputNumber, Modal } from "antd";
import Heading from "../title/Heading";
import SimpleButton from "../button/SimpleButton";
import styled from "styled-components";
import FilledButton from "../button/FilledButton";
import InputBox from "../form/InputBox";
import SelectBox from "../form/SelectBox";
import { useForm } from "antd/lib/form/Form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputNumBox from "../form/InputNumBox";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import React from "react";
import { positiontoDMS, DMStodecimal } from "../../helper/position";
import PositionBox from "../form/PositionBox";
import {
  type_list,
  movement_list,
  machineryDefects,
} from "../../helper/dropdown";
const StyledInput = styled.div`
  .ant-form-item-explain-error {
    font-size: 12px;
  }
`;

function Miscellaneous(props) {
  const { freshWaterData, setFreshWaterData } = props;
  const [freshWaterFrom] = useForm();
  const [freshWaterKey, setFreshWaterKey] = useState("");

  const [showInputs, setShowInputs] = useState({
    freshWaterColumn: false,
  });
  const handleFreshWaterColumnShowInput = () => {
    freshWaterFrom.resetFields();
    setShowInputs({ ...showInputs, freshWaterColumn: true });
  };
  const handleFreshWaterColumnCancel = (event) => {
    event.preventDefault();
    Modal.confirm({
      title: `Are you sure, you want don't want to add data?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setShowInputs({ ...showInputs, freshWaterColumn: false });
      },
    });
  };

  const handleFreshWaterDelete = (record_index) => {
    Modal.confirm({
      title: `Are you sure, you want to delete this field?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setFreshWaterData((prev) =>
          prev.filter((item, index) => index !== record_index)
        );
      },
    });
    freshWaterFrom.resetFields();
  };

  const isFreshWaterEditing = (record_index) => record_index === freshWaterKey;

  const freshWatesEdited = (key) => {
    const editedValues = freshWaterFrom.getFieldValue();
    const newEdited = {
      ...editedValues,
    };
    setFreshWaterData((previous) => {
      const newItems = [...previous];
      newItems[key] = newEdited;
      return newItems;
    });
    setFreshWaterKey("");
    freshWaterFrom.resetFields();
  };

  const onFreshWaterFinish = async () => {
    const validatedValues = await freshWaterFrom.validateFields();
    if (validatedValues) {
      setFreshWaterData((current) => [
        ...current,
        {
          ...validatedValues,
        },
      ]);
      toast.success(`Limitation Affectipn Ops Commitment data added`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setShowInputs({ ...showInputs, freshWaterColumn: false });
      freshWaterFrom.resetFields();
    }
  };

  const Columns = [
    {
      title: "Miscellaneous",
      dataIndex: "medical_evac",
      render: (text, record, index) => {
        return (showInputs.freshWaterColumn && index === 0) |
          isFreshWaterEditing(index) ? (
          <StyledInput>
            <InputBox
            className="input" 
            placeholder="Please Enter"

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
        if (showInputs.freshWaterColumn && index === 0) {
          return (
            <Form.Item>
              <div style={{ display: "flex" }}>
                <SimpleButton
                  onClick={handleFreshWaterColumnCancel}
                  style={{
                    fontWeight: "bold",
                  }}
                  text="Cancel"
                />
                <SimpleButton
                  onClick={onFreshWaterFinish}
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
        if (!showInputs.freshWaterColumn) {
          if (freshWaterData.length && !isFreshWaterEditing(index)) {
            return (
              <IconsStylingWrap>
                {/* {!showInputs.freshWaterColumn && ( */}
                <>
                  <MdModeEditOutline
                    className="editIcon"
                    onClick={() => {
                      setFreshWaterKey(index);
                      freshWaterFrom.setFieldsValue(record);
                    }}
                    disable={showInputs.freshWaterColumn}
                  />
                  <MdDelete
                    onClick={() => handleFreshWaterDelete(index)}
                    className="deleteIcon"
                  />
                </>
                {/* )} */}
              </IconsStylingWrap>
            );
          }

          if (isFreshWaterEditing(index)) {
            return (
              <Form.Item>
                <div style={{ display: "flex" }}>
                  <SimpleButton
                    onClick={() => {
                      setFreshWaterKey("");
                    }}
                    style={{
                      fontWeight: "bold",
                    }}
                    text="Cancel"
                  />
                  <SimpleButton
                    onClick={() => {
                      freshWatesEdited(index);
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
    <>
      <Form
        form={freshWaterFrom}
        onFinish={onFreshWaterFinish}
        className="mb-8"
      >
        <Row className="mb-5 mt-5">
          <Col span={24} className="flex justify-between">
            <Heading level={5} text="Miscellaneous" />
            <FilledButton
              text="+ Miscellaneous"
              className="rounded-full border-midnight bg-midnight text-white"
              onClick={handleFreshWaterColumnShowInput}
              // disabled={isEditing} // Disable the button when editing
              disabled={freshWaterKey !== ""}
            />
          </Col>
        </Row>
        <StyledDiv>
          <Table
            scroll={{ x: "auto" }} // Set the scroll property as per your requirements
            columns={Columns}
            dataSource={
              showInputs.freshWaterColumn
                ? [{}, ...freshWaterData]
                : freshWaterData
            }
            pagination={true}
          />
        </StyledDiv>
      </Form>
    </>
  );
}

export default Miscellaneous;

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

