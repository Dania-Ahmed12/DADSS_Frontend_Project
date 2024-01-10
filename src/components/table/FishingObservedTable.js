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
import { type_list, movement_list } from "../../helper/dropdown";
import { positiontoDMS, DMStodecimal } from "../../helper/position";
import React from "react";

const StyledInput = styled.div`
  .ant-form-item-explain-error {
    font-size: 12px;
  }
`;
function FishingObservedTable(props) {
  const { fishingObservedData, setFishingObservedData } = props;
  const [FishingObservedForm] = useForm();
  const [fishingObservedKey, setFishingObservedKey] = useState("");


  const [showInputs, setShowInputs] = useState({
    fishingObservedColumns: false,
  });

  const handleFishingShowInput = () => {
    FishingObservedForm.resetFields();
    setShowInputs({ ...showInputs, fishingObservedColumns: true });
    FishingObservedForm.setFieldValue(["grf_position", "dms", 0, "dir"], "E");
    FishingObservedForm.setFieldValue(["grf_position", "dms", 1, "dir"], "N");

  };

  const handleFishingCancel = (event) => {
    event.preventDefault();
    Modal.confirm({
      title: `Are you sure, you want don't want to add data?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setShowInputs({ ...showInputs, fishingObservedColumns: false });
      },
    });
  };

  const handleFishingObservedDelete = (record_index) => {
    Modal.confirm({
      title: `Are you sure, you want to delete this field?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setFishingObservedData((prev) =>
          prev.filter((item, index) => index !== record_index)
        );
      },
    });
    FishingObservedForm.resetFields();
  };

  const isFishingObservedEditing = (record_index) =>
    record_index === fishingObservedKey;

  const fishingObservedEdited = (key) => {
    const editedValues = FishingObservedForm.getFieldValue();
    const newEdited = {
      ...editedValues,
      grd_position: {
        ...editedValues.grf_position,
        type: "Point",
        coordinates: DMStodecimal(editedValues.grf_position.dms),
      },
    };
    setFishingObservedData((previous) => {
      const newItems = [...previous];
      newItems[key] = newEdited;
      return newItems;
    });
    setFishingObservedKey("");
    FishingObservedForm.resetFields();
  };

  const onFishingObservedFinish = async () => {
    const validatedValues = await FishingObservedForm.validateFields();
    if (validatedValues) {
      setFishingObservedData((current) => [
        ...current,
        {
          ...validatedValues,
          grf_position: {
            ...validatedValues.grf_position,
            type: "Point",
            coordinates: DMStodecimal(validatedValues.grf_position.dms),
          },
        },
      ]);
      toast.success(`Fishing Observed data added`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setShowInputs({ ...showInputs, fishingObservedColumns: false });
      FishingObservedForm.resetFields();
    }
  };


  const fishingObservedColumns = [
    {
      title: "Longitude",
      dataIndex: ["grf_position", "dms", 0],
      render: (text, record, index) => {
        if (
          (showInputs.fishingObservedColumns && index === 0) |
          isFishingObservedEditing(index)
        ) {
          return (
            <StyledInput>
              <PositionBox name={["grf_position", "dms", 0]} coordinate={0} />
            </StyledInput>
          );
        } else {
          return record?.grf_position ? positiontoDMS(text) : text;
        }
      },
    },
    {
      title: "Latitude",
      dataIndex: ["grf_position", "dms", 1],
      render: (text, record, index) => {
        if (
          (showInputs.fishingObservedColumns && index === 0) |
          isFishingObservedEditing(index)
        ) {
          return (
            <StyledInput>
              <PositionBox name={["grf_position", "dms", 1]} coordinate={1} />
            </StyledInput>
          );
        } else {
          return record?.grf_position ? positiontoDMS(text) : text;
        }
      },
    },
    {
      title: "Vessel Name",
      dataIndex: "grf_name",
      ellipsis:true,
      render: (text, record, index) => {
        return (showInputs.fishingObservedColumns && index === 0) |
          isFishingObservedEditing(index) ? (
          <StyledInput>
            <InputBox
              placeholder="Vessel Name"
              name="grf_name"
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
      dataIndex: "grf_type",
      render: (text, record, index) => {
        return (showInputs.fishingObservedColumns && index === 0) |
          isFishingObservedEditing(index) ? (
          <StyledInput>
            <SelectBox
              name="grf_type"
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
      dataIndex: "grf_movement",
      render: (text, record, index) => {
        return (showInputs.fishingObservedColumns && index === 0) |
          isFishingObservedEditing(index) ? (
          <StyledInput>
            <SelectBox
              name="grf_movement"
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
      title: "",
      dataIndex: "action",
      render: (text, record, index) => {
        if (showInputs.fishingObservedColumns && index === 0) {
          return (
            <Form.Item>
              <div style={{ display: "flex" }}>
                <SimpleButton
                  onClick={handleFishingCancel}
                  style={{
                    fontWeight: "bold",
                  }}
                  text="Cancel"
                />
                <SimpleButton
                  onClick={onFishingObservedFinish}
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
          if (!showInputs.fishingObservedColumns) {

        if (fishingObservedData.length && !isFishingObservedEditing(index)) {
          return (
            <IconsStylingWrap>
              <MdModeEditOutline
                className="editIcon"
                onClick={() => {
                  setFishingObservedKey(index);
                  FishingObservedForm.setFieldsValue(record);
                }}
              />
              <MdDelete
                onClick={() => handleFishingObservedDelete(index)}
                className="deleteIcon"
              />
            </IconsStylingWrap>
          );
        }
        if (isFishingObservedEditing(index)) {
          return (
            <Form.Item>
              <div style={{ display: "flex" }}>
                <SimpleButton
                  onClick={() =>{
                    setFishingObservedKey("");
                  }}
                  style={{
                    fontWeight: "bold",
                  }}
                  text="Cancel"
                />
                <SimpleButton
                  onClick={() => {
                    fishingObservedEdited(index);
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
      form={FishingObservedForm}
      onFinish={onFishingObservedFinish}
      className="mb-8"
    >
      <Row className="mb-5">
        <Col span={24} className="flex justify-between">
          <Heading level={5} text="Fishing Observed" />
          <FilledButton
            text="+Add Fishing Observed"
            className="rounded-full border-midnight bg-midnight text-white"
            onClick={handleFishingShowInput}
            disabled={fishingObservedKey !== ""}
          />
        </Col>
      </Row>
      <StyledDiv>
        <Table
          scroll={{ x: "auto" }} // Set the scroll property as per your requirements
          columns={fishingObservedColumns}
          dataSource={
            showInputs.fishingObservedColumns
              ? [{}, ...fishingObservedData]
              : fishingObservedData
          }
          // dataSource={
          //   showInputs.fishingObservedColumns
          //     ? fishingObservedData
          //     : fishingObservedData.length > 1
          //     ? fishingObservedData
          //         .map((item, index) => ({
          //           ...item,
          //           key: index,
          //         }))
          //         .slice(1)
          //     : []
          // }
          pagination={true}
        />
      </StyledDiv>
    </Form>
  );
}

export default FishingObservedTable;
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
