import { useState } from "react";
import { Col, Row, Table, Form, Modal } from "antd";
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
import { ais_type_summary } from "../../helper/dropdown";
import dayjs from "dayjs";
import DateBox from "../form/DateBox";
import { useDispatch } from "react-redux";
import { addPnscReport } from "../../redux/thunks/jmisPnscUploadData";
const StyledInput = styled.div`
  .ant-form-item-explain-error {
    font-size: 12px;
  }
`;

function PnscTable(props) {
  const dispatch = useDispatch();

  const { pnscReport, setPnscReport } = props;
  const [pnscReportForm] = useForm();
  const [pnscReportKey, setPnscReportKey] = useState("");

  const [showInputs, setShowInputs] = useState({
    pnscReportColumn: false,
  });

  const handlePnscReportColumnShowInput = () => {
    pnscReportForm.resetFields();
    setShowInputs({ ...showInputs, pnscReportColumn: true });
    pnscReportForm.setFieldValue(["ps_position", "dms", 0, "dir"], "E");
    pnscReportForm.setFieldValue(["ps_position", "dms", 1, "dir"], "N");
  };

  const handlePnscReportColumnCancel = (event) => {
    event.preventDefault();
    Modal.confirm({
      title: `Are you sure, you want don't want to add data?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setShowInputs({ ...showInputs, pnscReportColumn: false });
      },
    });
  };

  const handlePnscReportDelete = (record_index) => {
    Modal.confirm({
      title: `Are you sure, you want to delete this field?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setPnscReport((prev) =>
          prev.filter((item, index) => index !== record_index)
        );
      },
    });
    pnscReportForm.resetFields();
  };

  const isPnscReportEditing = (record_index) => record_index === pnscReportKey;

  const pnscReportEdited = (key) => {
    const editedValues = pnscReportForm.getFieldValue();
    const newEdited = {
      ...editedValues,
      ps_position: {
        ...editedValues.ps_position,
        type: "Point",
        coordinates: DMStodecimal(editedValues.ps_position.dms),
      },
    };
    setPnscReport((previous) => {
      const newItems = [...previous];
      newItems[key] = newEdited;
      return newItems;
    });
    setPnscReportKey("");
    pnscReportForm.resetFields();
  };

  const onPnscReportFinish = async () => {
    const validatedValues = await pnscReportForm.validateFields();
    // Log the data
    console.log("Adding data:", validatedValues);
    if (validatedValues) {
      setPnscReport((current) => [
        ...current,
        {
          ...validatedValues,

          ps_position: {
            ...validatedValues.ps_position,
            type: "Point",
            coordinates: DMStodecimal(validatedValues.ps_position.dms),
          },
        },
      ]);
      toast.success(`Data Added Successfully`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setShowInputs({ ...showInputs, pnscReportColumn: false });
      pnscReportForm.resetFields();
    }
  };

  console.log(pnscReport)

  const sendPnscReport = async () => {
    try {
      const finalData = pnscReport;
      // Dispatch the action with the data
      dispatch(addPnscReport(finalData));
      setPnscReport([]);
    } catch (error) {}
  };

  const pnscReportColumn = [
    {
      title: "Time Stamp",
      dataIndex: "ps_timestamp",
      ellipsis: true,
      render: (text, record, index) => {
        // If in editing mode or first row and column is visible
        if (
          (showInputs.pnscReportColumn && index === 0) ||
          isPnscReportEditing(index)
        ) {
          return (
            <StyledInput>
              <DateBox
                format="YYYY-MM-DD HH:mm:ss"
                showTime={{
                  defaultValue: dayjs("00:00:00", "HH:mm:ss"),
                }}
                name="ps_timestamp"
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
          // If pnscReport is available and text is not null, format the date
          if (pnscReport && text !== null) {
            return dayjs(text).format("YYYY-MM-DD HH:mm:ss");
          } else {
            // Otherwise, display "No Date"
            return "No Date";
          }
        }
      },
    },
    {
      title: "IMO",
      dataIndex: "mv_imo",
      render: (text, record, index) => {
        return (showInputs.pnscReportColumn && index === 0) |
          isPnscReportEditing(index) ? (
          <StyledInput>
            <InputBox
              name="mv_imo"
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
      title: "Type",
      dataIndex: "mv_ais_type_summary",
      render: (text, record, index) => {
        return (showInputs.pnscReportColumn && index === 0) |
          isPnscReportEditing(index) ? (
          <StyledInput>
            <SelectBox
              placeholder="Select Type"
              name={"mv_ais_type_summary"}
              options={ais_type_summary.map((item) => ({
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
      title: "Longitude",
      dataIndex: ["ps_position", "dms", 0],
      render: (text, record, index) => {
        if (
          (showInputs.pnscReportColumn && index === 0) |
          isPnscReportEditing(index)
        ) {
          return (
            <StyledInput>
              <PositionBox name={["ps_position", "dms", 0]} coordinate={0} />
            </StyledInput>
          );
        } else {
          return record?.ps_position ? positiontoDMS(text) : text;
        }
      },
    },
    {
      title: "Latitude",
      dataIndex: ["ps_position", "dms", 1],
      render: (text, record, index) => {
        if (
          (showInputs.pnscReportColumn && index === 0) |
          isPnscReportEditing(index)
        ) {
          return (
            <StyledInput>
              <PositionBox name={["ps_position", "dms", 1]} coordinate={1} />
            </StyledInput>
          );
        } else {
          return record?.ps_position ? positiontoDMS(text) : text;
        }
      },
    },
    {
      title: "Country",
      dataIndex: "ps_country",
      render: (text, record, index) => {
        return (showInputs.pnscReportColumn && index === 0) |
          isPnscReportEditing(index) ? (
          <StyledInput>
            <InputBox
              name="ps_country"
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
      title: "Status Symbol",
      ellipsis: true,

      dataIndex: "ps_status_symbol",
      render: (text, record, index) => {
        return (showInputs.pnscReportColumn && index === 0) |
          isPnscReportEditing(index) ? (
          <StyledInput>
            <InputBox
              name="ps_status_symbol"
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
      title: "Status Symbol Remarks",
      dataIndex: "ps_status_symbol_remarks",
      ellipsis: true,

      render: (text, record, index) => {
        return (showInputs.pnscReportColumn && index === 0) |
          isPnscReportEditing(index) ? (
          <StyledInput>
            <InputBox
              name="ps_status_symbol_remarks"
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
      title: "Status Symbol Assigned Time",
      dataIndex: "ps_status_symbol_assigned_time",
      ellipsis: true,
      render: (text, record, index) => {
        // If in editing mode or first row and column is visible
        if (
          (showInputs.pnscReportColumn && index === 0) ||
          isPnscReportEditing(index)
        ) {
          return (
            <StyledInput>
              <DateBox
                format="YYYY-MM-DD HH:mm:ss"
                showTime={{
                  defaultValue: dayjs("00:00:00", "HH:mm:ss"),
                }}
                name="ps_status_symbol_assigned_time"
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
          // If pnscReport is available and text is not null, format the date
          if (pnscReport && text !== null) {
            return dayjs(text).format("YYYY-MM-DD HH:mm:ss");
          } else {
            // Otherwise, display "No Date"
            return "No Date";
          }
        }
      },
    },
    {
      title: "Track Number",
      dataIndex: "ps_track_number",
      render: (text, record, index) => {
        return (showInputs.pnscReportColumn && index === 0) |
          isPnscReportEditing(index) ? (
          <StyledInput>
            <InputNumBox
              name="ps_track_number"
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
      title: "Course",
      dataIndex: "ps_course",
      render: (text, record, index) => {
        return (showInputs.pnscReportColumn && index === 0) |
          isPnscReportEditing(index) ? (
          <StyledInput>
            <InputNumBox
              name="ps_course"
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
      dataIndex: "ps_speed",
      render: (text, record, index) => {
        return (showInputs.pnscReportColumn && index === 0) |
          isPnscReportEditing(index) ? (
          <StyledInput>
            <InputNumBox
              name="ps_speed"
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
      title: "Last Port",
      dataIndex: "ps_lastport",
      render: (text, record, index) => {
        return (showInputs.pnscReportColumn && index === 0) |
          isPnscReportEditing(index) ? (
          <StyledInput>
            <InputBox
              name="ps_lastport"
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
      title: "Next Port",
      dataIndex: "ps_next_port",
      render: (text, record, index) => {
        return (showInputs.pnscReportColumn && index === 0) |
          isPnscReportEditing(index) ? (
          <StyledInput>
            <InputBox
              name="ps_next_port"
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
      title: "Track Label",
      dataIndex: "ps_track_label",
      render: (text, record, index) => {
        return (showInputs.pnscReportColumn && index === 0) |
          isPnscReportEditing(index) ? (
          <StyledInput>
            <InputBox
              name="ps_track_label"
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
      title: "Track Type",
      dataIndex: "ps_track_type",
      render: (text, record, index) => {
        return (showInputs.pnscReportColumn && index === 0) |
          isPnscReportEditing(index) ? (
          <StyledInput>
            <InputBox
              name="ps_track_type"
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
      ellipsis: true,
      render: (text, record, index) => {
        if (showInputs.pnscReportColumn && index === 0) {
          return (
            <Form.Item>
              <div style={{ display: "flex" }}>
                <SimpleButton
                  onClick={handlePnscReportColumnCancel}
                  style={{
                    fontWeight: "bold",
                  }}
                  text="Cancel"
                />
                <SimpleButton
                  onClick={onPnscReportFinish}
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
        if (!showInputs.pnscReportColumn) {
          if (pnscReport.length && !isPnscReportEditing(index)) {
            return (
              <IconsStylingWrap>
                <MdModeEditOutline
                  className="editIcon"
                  onClick={() => {
                    setPnscReportKey(index);
                    pnscReportForm.setFieldsValue(record);
                  }}
                  disable={showInputs.pnscReportColumn}
                />
                <MdDelete
                  onClick={() => handlePnscReportDelete(index)}
                  className="deleteIcon"
                />
              </IconsStylingWrap>
            );
          }
          if (isPnscReportEditing(index)) {
            return (
              <Form.Item>
                <div style={{ display: "flex" }}>
                  <SimpleButton
                    onClick={() => {
                      setPnscReportKey("");
                    }}
                    style={{
                      fontWeight: "bold",
                    }}
                    text="Cancel"
                  />
                  <SimpleButton
                    onClick={() => {
                      pnscReportEdited(index);
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
    // <Form form={pnscReportForm} onFinish={onPnscReportFinish} className="mb-8">
    //   <Row className="mb-8">
    //     <Col span={24} className="flex justify-end mb-8">
    //       <FilledButton
    //         disabled={pnscReport.length == 0}
    //         style={{ marginLeft: "auto" }}
    //         text="+ Save Lost Report"
    //         onClick={sendPnscReport}
    //         className="rounded-full border-lightgreen bg-lightgreen text-white"
    //       />
    //     </Col>
    //     <Col span={24} className="flex justify-between">
    //       <Heading level={5} text="Lost Report" />

    //       <FilledButton
    //         text="+ Add Lost Report"
    //         className="rounded-full border-midnight bg-midnight text-white"
    //         onClick={handlePnscReportColumnShowInput}
    //         disabled={pnscReportKey !== ""}
    //       />
    //     </Col>
    //   </Row>

    //   <StyledDiv>
    //     <Table
    //       scroll={{ x: "auto" }} // Set the scroll property as per your requirements
    //       columns={pnscReportColumn}
    //       dataSource={
    //         showInputs.pnscReportColumn ? [{}, ...pnscReport] : pnscReport
    //       }
    //       pagination={true}
    //     />
    //   </StyledDiv>
    // </Form>

    <Form form={pnscReportForm} onFinish={onPnscReportFinish} className="mb-8">
      <Row className="mb-8">
        <Col span={24} className="flex justify-end mb-8">
          <FilledButton
            disabled={pnscReport.length == 0}
            style={{ marginLeft: "auto" }}
            text="+ Save PNSC Report"
            onClick={sendPnscReport}
            className="rounded-full border-lightgreen bg-lightgreen text-white"
          />
        </Col>
        <Col span={24} className="flex justify-between">
          <Heading level={5} text="PNSC Report" />

          <FilledButton
            text="+ Add PNSC Report"
            className="rounded-full border-midnight bg-midnight text-white"
            onClick={handlePnscReportColumnShowInput}
            disabled={pnscReportKey !== ""}
          />
        </Col>
      </Row>

      <StyledDiv>
        <Table
          scroll={{ x: "auto" }} // Set the scroll property as per your requirements
          columns={pnscReportColumn}
          dataSource={
            showInputs.pnscReportColumn ? [{}, ...pnscReport] : pnscReport
          }
          pagination={true}
        />
      </StyledDiv>
    </Form>
  );
}

export default PnscTable;

const StyledDiv = styled.div`
padding:60px,
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
