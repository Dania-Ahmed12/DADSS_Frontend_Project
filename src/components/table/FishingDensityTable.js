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
const StyledInput = styled.div`
  .ant-form-item-explain-error {
    font-size: 12px;
  }
`;
function FishingDensityTable(props) {
  const { fishingDensityData, setFishingDensityData } = props;
  const [FishingDensityForm] = useForm();
  const [fishingDensityKey, setFishingDensityKey] = useState("");

  const [showInputs, setShowInputs] = useState({
    fishingColumns: false,
  });

  const handleFishingColumnShowInput = () => {
    FishingDensityForm.resetFields();
    setShowInputs({ ...showInputs, fishingColumns: true });
    FishingDensityForm.setFieldValue(["grd_position", "dms", 0, "dir"], "E");
    FishingDensityForm.setFieldValue(["grd_position", "dms", 1, "dir"], "N");
  };

  const handleFishingColumnCancel = (event) => {
    event.preventDefault();
    Modal.confirm({
      title: `Are you sure, you want don't want to add data?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setShowInputs({ ...showInputs, fishingColumns: false });
      },
    });
  };

  const handleFishingDensityDelete = (record_index) => {
    Modal.confirm({
      title: `Are you sure, you want to delete this field?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setFishingDensityData((prev) =>
          prev.filter((item, index) => index !== record_index)
        );
      },
    });
    FishingDensityForm.resetFields();
  };

  const isFishingDensityEditing = (record_index) =>
    record_index === fishingDensityKey;

  const fishingDensityDataEdited = (key) => {
    const editedValues = FishingDensityForm.getFieldValue();
    const newEdited = {
      ...editedValues,
      grd_position: {
        ...editedValues.grd_position,
        type: "Point",
        coordinates: DMStodecimal(editedValues.grd_position.dms),
      },
    };
    setFishingDensityData((previous) => {
      const newItems = [...previous];
      newItems[key] = newEdited;
      return newItems;
    });
    setFishingDensityKey("");
    FishingDensityForm.resetFields();
  };

  const onFishingDensityFinish = async () => {
    const validatedValues = await FishingDensityForm.validateFields();
    if (validatedValues) {
      setFishingDensityData((current) => [
        ...current,
        {
          ...validatedValues,
          grd_position: {
            ...validatedValues.grd_position,
            type: "Point",
            coordinates: DMStodecimal(validatedValues.grd_position.dms),
          },
        },
      ]);
      toast.success(`Fishing Density data added`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setShowInputs({ ...showInputs, fishingColumns: false });
      FishingDensityForm.resetFields();
    }
  };


  const fishingColumns = [
    {
      title: "Longitude",
      dataIndex: ["grd_position", "dms", 0],
      render: (text, record, index) => {
        if (
          (showInputs.fishingColumns && index === 0) |
          isFishingDensityEditing(index)
        ) {
          return (
            <StyledInput>
              <PositionBox name={["grd_position", "dms", 0]} coordinate={0} />
            </StyledInput>
          );
        } else {
          return record?.grd_position ? positiontoDMS(text) : text;
        }
      },
    },
    {
      title: "Latitude",
      dataIndex: ["grd_position", "dms", 1],
      render: (text, record, index) => {
        if (
          (showInputs.fishingColumns && index === 0) |
          isFishingDensityEditing(index)
        ) {
          return (
            <StyledInput>
              <PositionBox name={["grd_position", "dms", 1]} coordinate={1} />
            </StyledInput>
          );
        } else {
          return record?.grd_position ? positiontoDMS(text) : text;
        }
      },
    },
    {
      title: "Number of Vessels",
      ellipsis: true,
      dataIndex: "grd_qty",
      render: (text, record, index) => {
        // return isFishingDensityEditing(record) ? (
        return (showInputs.fishingColumns && index === 0) |
          isFishingDensityEditing(index) ? (
          <StyledInput>
            <InputNumBox
              placeholder="Vessels"
              name="grd_qty"
              min={1}
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
      title: "Vessel Type",
      dataIndex: "grd_type",
      render: (text, record, index) => {
        return (showInputs.fishingColumns && index === 0) |
          isFishingDensityEditing(index) ? (
          <StyledInput>
            <SelectBox
              name="grd_type"
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
      ellipsis: true,
      dataIndex: "grd_movement",
      render: (text, record, index) => {
        return (showInputs.fishingColumns && index === 0) |
          isFishingDensityEditing(index) ? (
          <StyledInput>
            <SelectBox
              name="grd_movement"
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
        if (showInputs.fishingColumns && index === 0) {
          return (
            <Form.Item>
              <div style={{ display: "flex" }}>
                <SimpleButton
                  onClick={handleFishingColumnCancel}
                  style={{
                    fontWeight: "bold",
                  }}
                  text="Cancel"
                />
                <SimpleButton
                  onClick={onFishingDensityFinish}
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
        if (!showInputs.fishingColumns) {
          if (fishingDensityData.length && !isFishingDensityEditing(index)) {
            return (
              <IconsStylingWrap>
                {/* {!showInputs.fishingColumns && ( */}
                <>
                  <MdModeEditOutline
                    className="editIcon"
                    onClick={() => {
                      setFishingDensityKey(index);
                      FishingDensityForm.setFieldsValue(record);
                    }}
                    disable={showInputs.fishingColumns}
                  />
                  <MdDelete
                    onClick={() => handleFishingDensityDelete(index)}
                    className="deleteIcon"
                  />
                </>
                {/* )} */}
              </IconsStylingWrap>
            );
          }

          if (isFishingDensityEditing(index)) {
            return (
              <Form.Item>
                <div style={{ display: "flex" }}>
                  <SimpleButton
                    onClick={() => {
                      setFishingDensityKey("");
                    }}
                    style={{
                      fontWeight: "bold",
                    }}
                    text="Cancel"
                  />
                  <SimpleButton
                    onClick={() => {
                      fishingDensityDataEdited(index);
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
      form={FishingDensityForm}
      onFinish={onFishingDensityFinish}
      className="mb-8"
    >
      <Row className="mb-5">
        <Col span={24} className="flex justify-between">
          <Heading level={5} text="Fishing Density" />
          <FilledButton
            text="+Add Fishing Density"
            className="rounded-full border-midnight bg-midnight text-white"
            onClick={handleFishingColumnShowInput}
            // disabled={isEditing} // Disable the button when editing
            disabled={fishingDensityKey !== ""}
          />
        </Col>
      </Row>
      <StyledDiv>
        <Table
          scroll={{ x: "auto" }} // Set the scroll property as per your requirements
          columns={fishingColumns}
          dataSource={
            showInputs.fishingColumns
              ? [{}, ...fishingDensityData]
              : fishingDensityData
          }
          //   showInputs.fishingColumns
          //     ? fishingDensityData
          //     : fishingDensityData.length > 1
          //     ? fishingDensityData
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

export default FishingDensityTable;

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
