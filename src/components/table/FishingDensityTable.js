import { useState } from "react";
import { Col, Row, Form, Modal } from "antd";
import Heading from "../title/Heading";
import SimpleButton from "../button/SimpleButton";
import styled from "styled-components";
import FilledButton from "../button/FilledButton";
import SelectBox from "../form/SelectBox";
import { useForm } from "antd/lib/form/Form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputNumBox from "../form/InputNumBox";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import React from "react";
import { positiontoDMS, DMStodecimal } from "../../helper/position";
import PositionBox from "../form/PositionBox";
import { type_list, movement_list } from "../../helper/dropdown";
import AntdTable from "./AntdTable";

function FishingDensityTable(props) {
  const { fishingDensityData, setFishingDensityData, showButtons } = props;
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
      ellipsis: false,
      key: "longitude",
      width: 250,
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
      key: "latitude",
      ellipsis: false,
      width: 250,
      dataIndex: ["grd_position", "dms", 1],
      render: (text, record, index) => {
        if (
          (showInputs.fishingColumns && index === 0) |
          isFishingDensityEditing(index)
        ) {
          return (
            <StyledInput style={{ width: "auto" }}>
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
      key: "grd_qty",
      width: 250,
      ellipsis: false,
      dataIndex: "grd_qty",
      render: (text, record, index) => {
        // return isFishingDensityEditing(record) ? (
        return (showInputs.fishingColumns && index === 0) |
          isFishingDensityEditing(index) ? (
          <StyledInput>
            <InputNumBox
              style={{ width: 150 }}
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
      key: "grd_type",
      dataIndex: "grd_type",
      width: 250,
      render: (text, record, index) => {
        return (showInputs.fishingColumns && index === 0) |
          isFishingDensityEditing(index) ? (
          <StyledInput>
            <SelectBox
              style={{ width: 150 }}
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
      key: "grd_movement",
      ellipsis: false,
      dataIndex: "grd_movement",
      width: 250,
      render: (text, record, index) => {
        return (showInputs.fishingColumns && index === 0) |
          isFishingDensityEditing(index) ? (
          <StyledInput>
            <SelectBox
              style={{ width: 150 }}
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
      width: 250,
      dataIndex: "action",
      key: "action",
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
    <div className="mb-10">
      <Row>
        <Col span={12} className="flex justify-start">
          <Heading
            className="whitespace-nowrap ml-5"
            level={5}
            text="Fishing Density"
          />
        </Col>
        <Col span={12} className="flex justify-end">
          {/* {showButtons && ( */}
            <>
              <FilledButton
                text="+ Add Fishing Density"
                className="rounded-full border-midnight bg-midnight text-white mr-4 custom-css-pageheaderButton"
                onClick={handleFishingColumnShowInput}
                disabled={fishingDensityKey !== ""}
              />
              <FilledButton
                text="+ Add"
                className="rounded-full border-midnight bg-midnight text-white mr-4 custom-css-pageheaderButtonMedia"
                onClick={handleFishingColumnShowInput}
                disabled={fishingDensityKey !== ""}
              />
            </>
          {/* )} */}
        </Col>
      </Row>
      {/* if showInputs.goodsColumns is true. If it is, it adds an empty row ({})
        at the beginning of the list. If not, it just shows the list as it is. */}
      <AntdTable
        scrollConfig={{ x: true }}
        form={FishingDensityForm}
        onFinish={onFishingDensityFinish}
        columns={fishingColumns}
        data={
          showInputs.fishingColumns
            ? [{}, ...fishingDensityData]
            : fishingDensityData
        }
      />
    </div>
  );
}

export default FishingDensityTable;

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
