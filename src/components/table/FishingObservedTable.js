import { useState } from "react";
import { Col, Row, Form, Modal } from "antd";
import Heading from "../title/Heading";
import SimpleButton from "../button/SimpleButton";
import styled from "styled-components";
import FilledButton from "../button/FilledButton";
import InputBox from "../form/InputBox";
import SelectBox from "../form/SelectBox";
import { useForm } from "antd/lib/form/Form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import PositionBox from "../form/PositionBox";
import { type_list, movement_list } from "../../helper/dropdown";
import { positiontoDMS, DMStodecimal } from "../../helper/position";
import React from "react";
import AntdTable from "./AntdTable";

function FishingObservedTable(props) {
  const { fishingObservedData, setFishingObservedData, showButtons } = props;
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
      key: "longitude",
      title: "Longitude",
      ellipsis: false,
      width: 250,
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
      key: "latitude",
      title: "Latitude",
      ellipsis: false,
      width: 250,
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
      key: "grf_name",
      dataIndex: "grf_name",
      width: 250,
      ellipsis: false,
      render: (text, record, index) => {
        return (showInputs.fishingObservedColumns && index === 0) |
          isFishingObservedEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
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
      key: "grf_type",
      dataIndex: "grf_type",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        return (showInputs.fishingObservedColumns && index === 0) |
          isFishingObservedEditing(index) ? (
          <StyledInput>
            <SelectBox
              style={{ width: 150 }}
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
      key: "grf_movement",
      dataIndex: "grf_movement",
      width: 250,
      ellipsis: false,
      render: (text, record, index) => {
        return (showInputs.fishingObservedColumns && index === 0) |
          isFishingObservedEditing(index) ? (
          <StyledInput>
            <SelectBox
              style={{ width: 150 }}
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
      key: "action",
      dataIndex: "action",
      width: 250,
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
                    onClick={() => {
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
    <div className="mb-10">
      <Row>
        <Col span={12} className="flex justify-start">
          <Heading
            className="whitespace-nowrap ml-5"
            level={5}
            text="Fishing Observed"
          />
        </Col>
        <Col span={12} className="flex justify-end">
          {/* {showButtons && ( */}
            <>
              <FilledButton
                text="+ Add Fishing Observed"
                className="rounded-full border-midnight bg-midnight text-white mr-4 custom-css-pageheaderButton"
                onClick={handleFishingShowInput}
                disabled={fishingObservedKey !== ""}
              />
              <FilledButton
                text="+ Add"
                className="rounded-full border-midnight bg-midnight text-white mr-4 custom-css-pageheaderButtonMedia"
                onClick={handleFishingShowInput}
                disabled={fishingObservedKey !== ""}
              />
            </>
          {/* )} */}
        </Col>
      </Row>
      {/* if showInputs.goodsColumns is true. If it is, it adds an empty row ({})
        at the beginning of the list. If not, it just shows the list as it is. */}
      <AntdTable
        scrollConfig={{ x: true }}
        form={FishingObservedForm}
        onFinish={onFishingObservedFinish}
        columns={fishingObservedColumns}
        data={
          showInputs.fishingObservedColumns
            ? [{}, ...fishingObservedData]
            : fishingObservedData
        }
      />
    </div>
  );
}

export default FishingObservedTable;

const StyledInput = styled.div`
  .ant-form-item-explain-error {
    font-size: 12px;
  }
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
