import { useState } from "react";
import { Col, Row, Table, Form, Modal } from "antd";
import Heading from "../title/Heading";
import styled from "styled-components";
import FilledButton from "../button/FilledButton";
import InputBox from "../form/InputBox";
import { useForm } from "antd/lib/form/Form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputNumBox from "../form/InputNumBox";
import PositionBox from "../form/PositionBox";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import React from "react";
import DateBox from "../form/DateBox";
import dayjs from "dayjs";
import { mission_details_vessel_type } from "../../helper/dropdown";
import { positiontoDMS, DMStodecimal } from "../../helper/position";
import SimpleButton from "../button/SimpleButton";
import SelectBox from "../form/SelectBox";
import AntdTable from "./AntdTable";

const StyledDiv = styled.div`
  box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
    rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
  border-radius: 10px;
`;
const StyledInput = styled.div`
  .ant-form-item-explain-error {
    font-size: 12px;
  }
`;
const IconsStylingWrap = styled.div`
  display: flex;
  /* gap: 40px; */
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

function MissionDetailDataTable(props) {
  const { missionDetail, setMissionDetail , showButtons} = props;
  const [missionDetailForm] = useForm();

  // used to track the currently editing item's index in the mission detail array.
  const [missionDetailDataKey, setMissionDetailDataKey] = useState("");
  //jetty data array that is currently being edited
  // When you call setmission detail(newValue), it updates the value of mission detail to newValue.

  // State for managing the visibility of different input sections
  const [showInputs, setShowInputs] = useState({
    missionDetailColumns: false,
  });

  // Function to show input fields for adding mission detail data
  const handleMissionDataColumnShowInput = () => {
    missionDetailForm.resetFields();
    setShowInputs({ ...showInputs, missionDetailColumns: true });
    missionDetailForm.setFieldValue(["mrd_position", "dms", 0, "dir"], "E");
    missionDetailForm.setFieldValue(["mrd_position", "dms", 1, "dir"], "N");
  };

  // Function to handle cancelling the addition of mission detail data
  const handleMissionDataColumnCancel = (event) => {
    event.preventDefault();
    Modal.confirm({
      title: `Are you sure, you want don't want to add data?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setShowInputs({ ...showInputs, missionDetailColumns: false });
      },
    });
  };

  // Function to handle deleting mission detail data
  const handleMissionDataDelete = (record_index) => {
    Modal.confirm({
      title: `Are you sure, you want to delete this field?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setMissionDetail((prev) =>
          // Remove the item at the specified index from the mission detail data array
          // keep the elements in the array where the index is not equal to the record_index
          prev.filter((item, index) => index !== record_index)
        );
      },
    });
    missionDetailForm.resetFields();
  };

  // check if a   data record is being edited  by comparing the provided index with the stored  DataKey.
  // If they are equal, it indicates that the record at the specified index is being edited.
  const isMissionDetailDataEditing = (record_index) =>
    record_index === missionDetailDataKey;

  const missionDetailDataEdited = (key) => {
    const editedValues = missionDetailForm.getFieldValue();
    // Convert the DMS (Degree, Minute, Second) coordinates to decimal coordinates
    const newEdited = {
      ...editedValues,
      mrd_position: {
        ...editedValues.mrd_position,
        coordinates: DMStodecimal(editedValues.mrd_position.dms),
      },
    };
    // Update the  data state by replacing the item at the specified key/index with the new edited item
    setMissionDetail((previous) => {
      const newItems = [...previous];
      newItems[key] = newEdited;
      return newItems;
    });
    setMissionDetailDataKey("");
    missionDetailForm.resetFields();
  };

  // Function to handle Jetty data form submission
  const onMissionDetailDataFinish = async () => {
    const validatedValues = await missionDetailForm.validateFields();
    // Convert DMS (Degree, Minute, Second) coordinates to decimal coordinates
    validatedValues.mrd_position = {
      ...validatedValues.mrd_position,
      coordinates: DMStodecimal(validatedValues.mrd_position.dms),
    };
    if (validatedValues) {
      // Update the  data state by adding a new item with the validated values
      setMissionDetail((current) => [
        ...current,
        {
          ...validatedValues,
          mrd_position: {
            ...validatedValues.mrd_position,
            type: "Point",
            coordinates: DMStodecimal(validatedValues.mrd_position.dms),
          },
        },
      ]);

      toast.success(`Mission  Detail data added`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setShowInputs({ ...showInputs, missionDetailColumns: false });
      missionDetailForm.resetFields();
    }
  };

  const missionDetailsDataColumns = [
    {
      title: "MMSI",
      dataIndex: "mrd_mmsi",
      ellipsis: true,
      render: (text, record, index) => {
        // Conditionally render an input field or existing text
        return (showInputs.missionDetailColumns && index === 0) |
          isMissionDetailDataEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 100 }}
              name="mrd_mmsi"
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
                {
                  len: 9,
                  message: "MMSI must be exactly 9 digits!",
                },
                {
                  pattern: /^\d+$/,
                  message: "MMSI must contain only digits!",
                },
              ]}
            />
          </StyledInput>
        ) : (
          // If conditions not met, render the existing text
          text
        );
      },
    },
    {
      title: "Longitude",
      dataIndex: ["mrd_position", "dms", 0],
      render: (text, record, index) => {
        if (
          (showInputs.missionDetailColumns && index === 0) |
          isMissionDetailDataEditing(index)
        ) {
          return (
            <StyledInput>
              <PositionBox name={["mrd_position", "dms", 0]} coordinate={0} />
            </StyledInput>
          );
        } else {
          return record?.mrd_position ? positiontoDMS(text) : text;
        }
      },
    },
    {
      title: "Latitude",
      dataIndex: ["mrd_position", "dms", 1],
      render: (text, record, index) => {
        if (
          (showInputs.missionDetailColumns && index === 0) |
          isMissionDetailDataEditing(index)
        ) {
          return (
            <StyledInput>
              <PositionBox name={["mrd_position", "dms", 1]} coordinate={1} />
            </StyledInput>
          );
        } else {
          return record?.mrd_position ? positiontoDMS(text) : text;
        }
      },
    },
    {
      title: "Course",
      dataIndex: "mrd_course",
      ellipsis: true,
      render: (text, record, index) => {
        return (showInputs.missionDetailColumns && index === 0) |
          isMissionDetailDataEditing(index) ? (
          <StyledInput>
            <InputNumBox
              name="mrd_course"
              //   min={1}
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
      title: "Speed",
      dataIndex: "mrd_speed",
      ellipsis: true,
      render: (text, record, index) => {
        return (showInputs.missionDetailColumns && index === 0) |
          isMissionDetailDataEditing(index) ? (
          <StyledInput>
            <InputNumBox
              name="mrd_speed"
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
      title: "Vessel Name",
      dataIndex: "mrd_vessel_name",
      ellipsis: true,
      render: (text, record, index) => {
        return (showInputs.missionDetailColumns && index === 0) |
          isMissionDetailDataEditing(index) ? (
          <StyledInput>
            <InputBox
              name="mrd_vessel_name"
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
      title: "NPOC",
      dataIndex: "mrd_npoc",
      ellipsis: true,
      render: (text, record, index) => {
        return (showInputs.missionDetailColumns && index === 0) |
          isMissionDetailDataEditing(index) ? (
          <StyledInput>
            <InputBox
              name="mrd_npoc"
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
      title: "LPOC",
      dataIndex: "mrd_lpoc",
      ellipsis: true,
      render: (text, record, index) => {
        return (showInputs.missionDetailColumns && index === 0) |
          isMissionDetailDataEditing(index) ? (
          <StyledInput>
            <InputBox
              name="mrd_lpoc"
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
      title: "Activity Description",
      dataIndex: "mrd_act_desc",
      ellipsis: true,
      render: (text, record, index) => {
        return (showInputs.missionDetailColumns && index === 0) |
          isMissionDetailDataEditing(index) ? (
          <StyledInput>
            <InputBox
              name="mrd_act_desc"
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
      title: "AIS Status",
      dataIndex: "mrd_ais_status",
      ellipsis: true,
      render: (text, record, index) => {
        return (showInputs.missionDetailColumns && index === 0) |
          isMissionDetailDataEditing(index) ? (
          <StyledInput>
            <InputBox
              name="mrd_ais_status"
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
      title: "Call Details",
      dataIndex: "mrd_call_details",
      ellipsis: true,
      render: (text, record, index) => {
        return (showInputs.missionDetailColumns && index === 0) |
          isMissionDetailDataEditing(index) ? (
          <StyledInput>
            <InputBox
              name="mrd_call_details"
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
      title: "Response",
      dataIndex: "mrd_response",
      ellipsis: true,
      render: (text, record, index) => {
        return (showInputs.missionDetailColumns && index === 0) |
          isMissionDetailDataEditing(index) ? (
          <StyledInput>
            <InputBox
              name="mrd_response"
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
      title: "Remarks",
      dataIndex: "mrd_remarks",
      ellipsis: true,
      render: (text, record, index) => {
        return (showInputs.missionDetailColumns && index === 0) |
          isMissionDetailDataEditing(index) ? (
          <StyledInput>
            <InputBox
              name="mrd_remarks"
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
      dataIndex: "mrd_vessel_type",
      ellipsis: true,
      render: (text, record, index) => {
        return (showInputs.missionDetailColumns && index === 0) |
          isMissionDetailDataEditing(index) ? (
          <StyledInput>
            <SelectBox
              placeholder="Vessel Type"
              name={"mrd_vessel_type"}
              options={mission_details_vessel_type.map((item) => ({
                value: item,
                label: item,
              }))}
              rules={[
                {
                  required: true,
                  message: "Please select a vessel type!",
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
      title: "Date Time",
      dataIndex: "mrd_dtg",
      ellipsis: true,
      render: (text, record, index) => {
        return (showInputs.missionDetailColumns && index === 0) |
          isMissionDetailDataEditing(index) ? (
          // return (
          <StyledInput>
            <DateBox
              style={{ width: 180 }}
              format="YYYY-MM-DD HH:mm:ss"
              showTime={{
                defaultValue: dayjs("00:00:00", "HH:mm:ss"),
              }}
              name="mrd_dtg"
              rules={[
                {
                  required: true,
                  message: "Please select a date!",
                },
              ]}
            />
          </StyledInput>
        ) : missionDetail ? (
          dayjs(text).format("YYYY-MM-DD HH:mm:ss")
        ) : (
          text
        );
      },
    },

    {
      title: "",
      dataIndex: "action",
      ellipsis: true,
      render: (text, record, index) => {
        if (showInputs.missionDetailColumns && index === 0) {
          return (
            <Form.Item>
              <div style={{ display: "flex" }}>
                <SimpleButton
                  onClick={handleMissionDataColumnCancel}
                  style={{
                    fontWeight: "bold",
                  }}
                  text="Cancel"
                />
                <SimpleButton
                  onClick={onMissionDetailDataFinish}
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
        if (!showInputs.missionDetailColumns) {
          if (missionDetail.length && !isMissionDetailDataEditing(index)) {
            return (
              <IconsStylingWrap>
                <MdModeEditOutline
                  className="editIcon"
                  onClick={() => {
                    setMissionDetailDataKey(index);
                    missionDetailForm.setFieldsValue(record);
                  }}
                  disable={showInputs.missionDetailColumns}
                />
                <MdDelete
                  onClick={() => handleMissionDataDelete(index)}
                  className="deleteIcon"
                />
              </IconsStylingWrap>
            );
          }
          if (isMissionDetailDataEditing(index)) {
            return (
              <Form.Item>
                <div style={{ display: "flex" }}>
                  <SimpleButton
                    onClick={() => {
                      setMissionDetailDataKey("");
                    }}
                    style={{
                      fontWeight: "bold",
                    }}
                    text="Cancel"
                  />
                  <SimpleButton
                    onClick={() => {
                      missionDetailDataEdited(index);
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
    // <Form
    // form={missionDetailForm}
    // onFinish={onMissionDetailDataFinish}
    //   className="mb-8"
    // >
    //   <Row className="mb-5">
    //     <Col span={24} className="flex justify-between">
    //       <Heading level={5} text="Mission Details" />
    //       <FilledButton
    //         text="+Add Mission Detail"
    //         className="rounded-full border-midnight bg-midnight text-white"
    //         onClick={handleMissionDataColumnShowInput}
    //         disabled={missionDetailDataKey !== ""}
    //       />
    //     </Col>
    //   </Row>
    //   <StyledDiv>
    //     <Table
    //       columns={missionDetailsDataColumns}
    //       dataSource={
    //         showInputs.missionDetailColumns
    //           ? [{}, ...missionDetail]
    //           : missionDetail
    //       }
    //       pagination={true}
    //       scroll={{ x: "auto" }} // Set the scroll property as per your requirements
    //     />
    //   </StyledDiv>
    // </Form>
    <div className="mb-10">
      <Row>
        <Col span={12} className="flex justify-start">
          <Heading
            className=" whitespace-nowrap ml-5"
            level={5}
            text="Mission Details"
          />
        </Col>
        <Col span={12} className="flex justify-end">
          {showButtons && (
            <FilledButton
              text="+ Add Mission Details"
              className="rounded-full border-midnight bg-midnight text-white mr-4"
              onClick={handleMissionDataColumnShowInput}
              disabled={missionDetailDataKey !== ""}
            />
          )}
        </Col>
      </Row>
      {/* if showInputs.goodsColumns is true. If it is, it adds an empty row ({})
        at the beginning of the list. If not, it just shows the list as it is. */}
      <AntdTable
        form={missionDetailForm}
        onFinish={onMissionDetailDataFinish}
        columns={missionDetailsDataColumns}
        data={
          showInputs.missionDetailColumns
            ? [{}, ...missionDetail]
            : missionDetail
        }
      />
    </div>
  );
}

export default MissionDetailDataTable;
