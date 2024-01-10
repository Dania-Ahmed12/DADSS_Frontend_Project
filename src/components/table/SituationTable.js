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
import { useDispatch, useSelector } from "react-redux";
import { addSituationReport } from "../../redux/thunks/situationUploadData";
const StyledInput = styled.div`
  .ant-form-item-explain-error {
    font-size: 12px;
  }
`;

function SituationTable(props) {
  const dispatch = useDispatch();

  const { situationData, setSituationData } = props;
  const [situationForm] = useForm();
  const [situationReportKey, setSituationReportKey] = useState("");

  const [showInputs, setShowInputs] = useState({
    situationColumns: false,
  });

  const handleSituationColumnShowInput = () => {
    situationForm.resetFields();
    setShowInputs({ ...showInputs, situationColumns: true });
    situationForm.setFieldValue(["sit_position", "dms", 0, "dir"], "E");
    situationForm.setFieldValue(["sit_position", "dms", 1, "dir"], "N");
  };

  const handleSituatioColumnCancel = (event) => {
    event.preventDefault();
    Modal.confirm({
      title: `Are you sure, you want don't want to add data?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setShowInputs({ ...showInputs, situationColumns: false });
      },
    });
  };

  const handleSituationDelete = (record_index) => {
    Modal.confirm({
      title: `Are you sure, you want to delete this field?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setSituationData((prev) =>
          prev.filter((item, index) => index !== record_index)
        );
      },
    });
    situationForm.resetFields();
  };

  const isSituationEditing = (record_index) =>
    record_index === situationReportKey;

  const situationEdited = (key) => {
    const editedValues = situationForm.getFieldValue();
    const newEdited = {
      ...editedValues,
      sit_position: {
        ...editedValues.sit_position,
        type: "Point",
        coordinates: DMStodecimal(editedValues.sit_position.dms),
      },
    };
    setSituationData((previous) => {
      const newItems = [...previous];
      newItems[key] = newEdited;
      return newItems;
    });
    setSituationReportKey("");
    situationForm.resetFields();
  };

  const onSituationFinish = async () => {
    const validatedValues = await situationForm.validateFields();
    if (validatedValues) {
      setSituationData((current) => [
        ...current,
        {
          ...validatedValues,

          sit_position: {
            ...validatedValues.sit_position,
            type: "Point",
            coordinates: DMStodecimal(validatedValues.sit_position.dms),
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
      setShowInputs({ ...showInputs, situationColumns: false });
      situationForm.resetFields();
    }
  };

  const sendSituationalReprot = async () => {
    try {
      const finalData = situationData;
      dispatch(addSituationReport(finalData));
    
      setSituationData([]);
    } catch (error) {
    
    }
  };
  const situationColumns = [
    {
      title: "DTG",
      dataIndex: "sit_dtg",
      ellipsis: true,
      render: (text, record, index) => {
        // If in editing mode or first row and column is visible
        if (
          (showInputs.situationColumns && index === 0) ||
         isSituationEditing(index)
        ) {
          return (
            <StyledInput>
              <DateBox
                style={{ width: 180 }}
                format="YYYY-MM-DD HH:mm:ss"
                showTime={{
                  defaultValue: dayjs("00:00:00", "HH:mm:ss"),
                }}
                name="sit_dtg"
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
          // If pnscData is available and text is not null, format the date
          if (situationData && text !== null) {
            return dayjs(text).format("YYYY-MM-DD HH:mm:ss");
          } else {
            // Otherwise, display "No Date"
            return "No Date";
          }
        }
      },
    },
    {
      title: "MMSI",
      dataIndex: "mv_mmsi",
      render: (text, record, index) => {
        return (showInputs.situationColumns && index === 0) |
          isSituationEditing(index) ? (
          <StyledInput>
            <InputBox
              name="mv_mmsi"
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
          text
        );
      },
    },
    {
      title: "IMO",
      dataIndex: "mv_imo",
      render: (text, record, index) => {
        return (showInputs.situationColumns && index === 0) |
          isSituationEditing(index) ? (
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
      title: "Name",
      dataIndex: "mv_ship_name",
      render: (text, record, index) => {
        return (showInputs.situationColumns && index === 0) |
          isSituationEditing(index) ? (
          <StyledInput>
            <InputBox
              name="mv_ship_name"
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
      title: "Flag",
      dataIndex: "mv_flag",
      render: (text, record, index) => {
        return (showInputs.situationColumns && index === 0) |
          isSituationEditing(index) ? (
          <StyledInput>
            <InputBox
              name="mv_flag"
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
        return (showInputs.situationColumns && index === 0) |
          isSituationEditing(index) ? (
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
      dataIndex: ["sit_position", "dms", 0],
      render: (text, record, index) => {
        if (
          (showInputs.situationColumns && index === 0) |
          isSituationEditing(index)
        ) {
          return (
            <StyledInput>
              <PositionBox name={["sit_position", "dms", 0]} coordinate={0} />
            </StyledInput>
          );
        } else {
          return record?.sit_position ? positiontoDMS(text) : text;
        }
      },
    },

    {
      title: "Latitude",
      dataIndex: ["sit_position", "dms", 1],
      render: (text, record, index) => {
        if (
          (showInputs.situationColumns && index === 0) |
          isSituationEditing(index)
        ) {
          return (
            <StyledInput>
              <PositionBox name={["sit_position", "dms", 1]} coordinate={1} />
            </StyledInput>
          );
        } else {
          return record?.sit_position ? positiontoDMS(text) : text;
        }
      },
    },
    {
      title: "LPOC",
      dataIndex: "sit_lpoc",
      render: (text, record, index) => {
        return (showInputs.situationColumns && index === 0) |
          isSituationEditing(index) ? (
          <StyledInput>
            <InputBox
              name="sit_lpoc"
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
      title: "Last Port Country",
      dataIndex: "sit_last_port_country",
      render: (text, record, index) => {
        return (showInputs.situationColumns && index === 0) |
          isSituationEditing(index) ? (
          <StyledInput>
            <InputBox
              name="sit_last_port_country"
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
      dataIndex: "sit_npoc",
      render: (text, record, index) => {
        return (showInputs.situationColumns && index === 0) |
          isSituationEditing(index) ? (
          <StyledInput>
            <InputBox
              name="sit_npoc"
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
      title: "Next Port Country",
      dataIndex: "sit_next_port_country",
      render: (text, record, index) => {
        return (showInputs.situationColumns && index === 0) |
          isSituationEditing(index) ? (
          <StyledInput>
            <InputBox
              name="sit_next_port_country"
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
      dataIndex: "sit_course",
      render: (text, record, index) => {
        return (showInputs.situationColumns && index === 0) |
          isSituationEditing(index) ? (
          <StyledInput>
            <InputNumBox
              name="sit_course"
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
      dataIndex: "sit_speed",
      render: (text, record, index) => {
        return (showInputs.situationColumns && index === 0) |
          isSituationEditing(index) ? (
          <StyledInput>
            <InputNumBox
              name="sit_speed"
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
      title: "Source",
      dataIndex: "sit_source",
      render: (text, record, index) => {
        return (showInputs.situationColumns && index === 0) |
          isSituationEditing(index) ? (
          <StyledInput>
            <InputBox
              name="sit_source"
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
        if (showInputs.situationColumns && index === 0) {
          return (
            <Form.Item>
              <div style={{ display: "flex" }}>
                <SimpleButton
                  onClick={handleSituatioColumnCancel}
                  style={{
                    fontWeight: "bold",
                  }}
                  text="Cancel"
                />
                <SimpleButton
                  onClick={onSituationFinish}
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
        if (!showInputs.situationColumns) {
          if (situationData.length && !isSituationEditing(index)) {
            return (
              <IconsStylingWrap>
                <MdModeEditOutline
                  className="editIcon"
                  onClick={() => {
                    setSituationReportKey(index);
                    situationForm.setFieldsValue(record);
                  }}
                  disable={showInputs.situationColumns}
                />
                <MdDelete
                  onClick={() => handleSituationDelete(index)}
                  className="deleteIcon"
                />
              </IconsStylingWrap>
            );
          }
          if (isSituationEditing(index)) {
            return (
              <Form.Item>
                <div style={{ display: "flex" }}>
                  <SimpleButton
                    onClick={() => {
                      setSituationReportKey("");
                    }}
                    style={{
                      fontWeight: "bold",
                    }}
                    text="Cancel"
                  />
                  <SimpleButton
                    onClick={() => {
                      situationEdited(index);
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
      <Form form={situationForm} onFinish={onSituationFinish} className="mb-8">
        <Row className="mb-8">
          <Col span={24} className="flex justify-end mb-8">
            <FilledButton
              disabled={situationData.length == 0}
              style={{ marginLeft: "auto" }}
              text="+ Save Situation Report"
              onClick={sendSituationalReprot}
              className="rounded-full border-lightgreen bg-lightgreen text-white"
            />
          </Col>
          <Col span={24} className="flex justify-between">
            <Heading level={5} text="Situation Report" />

            <FilledButton
              text="+Add Situation Report"
              className="rounded-full border-midnight bg-midnight text-white"
              onClick={handleSituationColumnShowInput}
              disabled={situationReportKey !== ""}
            />
          </Col>
        </Row>

        <StyledDiv>
          <Table
            scroll={{ x: "auto" }} // Set the scroll property as per your requirements
            columns={situationColumns}
            dataSource={
              showInputs.situationColumns
                ? [{}, ...situationData]
                : situationData
            }
            pagination={true}
          />
        </StyledDiv>
      </Form>
    </>
  );
}

export default SituationTable;

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
