import { useState } from "react";
import { Col, Row, Table, Form, Modal } from "antd";
import Heading from "../title/Heading";
import SimpleButton from "../button/SimpleButton";
import styled from "styled-components";
import FilledButton from "../button/FilledButton";
import { useForm } from "antd/lib/form/Form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import React from "react";
import DateBox from "../form/DateBox";
import dayjs from "dayjs";
import AntdTable from "./AntdTable";
import FormTable from "./FromTable";

function MacroMissionDataTable(props) {
  const { missionData, setMissionData, init_mission_data, showButtons } = props;

  // Checking if `props.reportKeys` is provided, otherwise using default values
  const reportKeys = props.reportKeys
    ? props.reportKeys
    : {
        pf_id: "mr_pf_id",
        datetime: "mr_dtg",
      };

  // Destructures `missionDataEntered` from props into `missionDataEntered` and `setMissionDataEntered`.

  //  missionDataEntered: A boolean variable indicating whether the macro data has been entered or not.
  // setMissionDataEntered: A function that can be used to update the value of missionDataEntered.
  const { missionDataEntered, setMissionDataEntered } = props.MissionDataState;
  const [missionDataForm] = useForm();

  // State for managing the visibility of different input sections
  const [showInputs, setShowInputs] = useState({
    missionDataColumns: false,
    missionData_editing: false,
  });

  // Function to handle cancelling the addition of macro data
  const handleMissionDataCancel = (event) => {
    event.preventDefault();
    Modal.confirm({
      title: `Are you sure, you want don't want to add data?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setShowInputs({ ...showInputs, missionDataColumns: false });
      },
    });
  };

  // Function to handle deleting macro data
  const handleMissionDataDelete = (record) => {
    Modal.confirm({
      title: `Are you sure, you want to delete this field?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        // Reset the macro data to the initial state (empty or default values)
        setMissionData(init_mission_data);
        // Set the flag to indicate that macro data has not been entered
        setMissionDataEntered(false);
      },
    });
  };

  const missionDataEdited = () => {
    const editedValues = missionDataForm.getFieldValue();

    if (editedValues) {
      // Update the macro data state by merging the previous state with the edited values
      setMissionData((prev) => ({ ...prev, ...editedValues }));
    }
    setShowInputs({ ...showInputs, missionData_editing: false });
  };

  // Function to show input fields for adding macro data
  const handleMissionDataShowInput = () => {
    missionDataForm.resetFields();
    setShowInputs({ ...showInputs, missionDataColumns: true });
  };

  // Function to handle form submission for adding macro data
  const onMissionDataFinish = async () => {
    const validatedValues = await missionDataForm.validateFields();
    // Check if there are validated value
    if (validatedValues) {
      setMissionData({
        ...validatedValues,
        mr_pf_id: init_mission_data.mr_pf_id,
      });

      toast.success(`Macro data added`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setShowInputs({ ...showInputs, missionDataColumns: false });
      setMissionDataEntered(true);
    }
  };
  const ownMissionDataFormColumns = [
    {
      title: "Platform ID",
      dataIndex: reportKeys.pf_id,
      ellipsis: false,
      width: 250,
    },
    {
      title: "Date Time",
      dataIndex: reportKeys.datetime,
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        // When in data entry or editing mode, display DateBox component
        if (showInputs.missionDataColumns | showInputs.missionData_editing) {
          return (
            <StyledInput>
              <DateBox
                style={{ width: 180 }}
                format="YYYY-MM-DD HH:mm:ss"
                showTime={{
                  defaultValue: dayjs("00:00:00", "HH:mm:ss"),
                }}
                name={reportKeys.datetime}
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
          // When not in editing mode, display formatted date/time or the raw text
          return missionDataEntered
            ? dayjs(text).format("YYYY-MM-DD HH:mm:ss")
            : text; // Display the raw text if not in data entry or editing mode
        }
      },
    },
    {
      title: "",
      dataIndex: "action",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        if (showInputs.missionDataColumns) {
          return (
            <Form.Item>
              <div style={{ display: "flex" }}>
                <SimpleButton
                  onClick={handleMissionDataCancel}
                  style={{
                    fontWeight: "bold",
                  }}
                  text="Cancel"
                />
                <SimpleButton
                  onClick={onMissionDataFinish}
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
        if (!showInputs.missionDataColumns) {
          if (missionDataEntered && !showInputs.missionData_editing) {
            return (
              <IconsStylingWrap>
                <MdModeEditOutline
                  className="editIcon"
                  onClick={() => {
                    setShowInputs({ ...showInputs, missionData_editing: true });
                  }}
                />
                <MdDelete
                  onClick={() => handleMissionDataDelete(record)}
                  className="deleteIcon"
                />
              </IconsStylingWrap>
            );
          }
          if (showInputs.missionData_editing) {
            return (
              <Form.Item>
                <div style={{ display: "flex" }}>
                  <SimpleButton
                    onClick={() => {
                      setShowInputs({
                        ...showInputs,
                        missionData_editing: false,
                      });
                    }}
                    style={{
                      fontWeight: "bold",
                    }}
                    text="Cancel"
                  />
                  <SimpleButton
                    onClick={() => {
                      missionDataEdited();
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
        <Col span={12}>
          <Heading
            className=" whitespace-nowrap ml-5 justify-start"
            level={5}
            text="Mission Macro Data"
          />
        </Col>
        <Col span={12} className=" flex justify-end">
          {/* {showButtons && ( */}
            <>
              <FilledButton
                disabled={missionDataEntered}
                text="+ Add Intel Macro Data"
                className="rounded-full border-midnight bg-midnight text-white mr-4 custom-css-pageheaderButton"
                onClick={handleMissionDataShowInput}
              />
              <FilledButton
                disabled={missionDataEntered}
                text="+ Add"
                className="rounded-full border-midnight bg-midnight text-white mr-4 custom-css-pageheaderButtonMedia"
                onClick={handleMissionDataShowInput}
              />
            </>
          {/* )} */}
        </Col>
      </Row>
      {/* if showInputs.goodsColumns is true. If it is, it adds an empty row ({})
        at the beginning of the list. If not, it just shows the list as it is. */}
      <FormTable
        form={missionDataForm}
        onFinish={onMissionDataFinish}
        columns={ownMissionDataFormColumns}
        data={[missionData]}
        pagination={false}
        scrollConfig={{ x: true }}
      />
    </div>
  );
}

export default MacroMissionDataTable;

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
