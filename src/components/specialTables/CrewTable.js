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
import DateBox from "../form/DateBox";
import dayjs from "dayjs";
import { Select, Typography } from "antd";
const { Title } = Typography;

const StyledInput = styled.div`
  .ant-form-item-explain-error {
    font-size: 12px;
  }
`;
function CrewTable(props) {
  const { crewData, setCrewData, showButtons, labelConfig, className } = props;
  const [crewForm] = useForm();
  const [crewKey, setCrewKey] = useState("");

  const [showInputs, setShowInputs] = useState({
    crewColumns: false,
  });

  const handleCrewColumnShowInput = () => {
    crewForm.resetFields();
    setShowInputs({ ...showInputs, crewColumns: true });
  };

  const handleCrewCancel = (event) => {
    event.preventDefault();
    Modal.confirm({
      title: `Are you sure, you want don't want to add data?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setShowInputs({ ...showInputs, crewColumns: false });
      },
    });
  };

  const handleCrewDelete = (record_index) => {
    Modal.confirm({
      title: `Are you sure, you want to delete this field?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setCrewData((prev) =>
          prev.filter((item, index) => index !== record_index)
        );
      },
    });
    crewForm.resetFields();
  };

  const isCrewEditing = (record_index) => record_index === crewKey;

  const crewDataEdited = (key) => {
    const editedValues = crewForm.getFieldValue();
    const newEdited = {
      ...editedValues,
    };
    setCrewData((previous) => {
      const newItems = [...previous];
      newItems[key] = newEdited;
      return newItems;
    });
    setCrewKey("");
    crewForm.resetFields();
  };

  const onCrewFinish = async () => {
    const validatedValues = await crewForm.validateFields();
    if (validatedValues) {
      setCrewData((current) => [
        ...current,
        {
          ...validatedValues,
        },
      ]);
      toast.success(`Crew data added`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setShowInputs({ ...showInputs, crewColumns: false });
      crewForm.resetFields();
    }
  };

  const reportKeys = props.reportKeys
    ? props.reportKeys
    : {
        name: "src_name",
        nationality: "src_nationality",
        idtype: "src_idtype",
        id: "src_id",
        idexpdt: "src_idexpdt",
        ethnicity: "src_ethnicity",
        cell: "src_cell",
        total: "sb_crew",
      };
  const commonColumns = [
    {
      title: "Name",
      // dataIndex: "src_name",
      dataIndex: reportKeys.name,
      render: (text, record, index) => {
        return (showInputs.crewColumns && index === 0) |
          isCrewEditing(index) ? (
          <StyledInput>
            <InputBox
              placeholder="Name"
              // name="src_name"
              name={reportKeys.name}
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
      title: "Nationality",
      // dataIndex: "src_nationality",
      dataIndex: reportKeys.nationality,
      render: (text, record, index) => {
        return (showInputs.crewColumns && index === 0) |
          isCrewEditing(index) ? (
          <StyledInput>
            <InputBox
              placeholder="Nationality"
              // name="src_nationality"
              name={reportKeys.nationality}
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
  ];

  const additionalColumn1 = [
    {
      title: "ID Type",
      // dataIndex: "src_idtype",
      dataIndex: reportKeys.idtype,
      render: (text, record, index) => {
        return (showInputs.crewColumns && index === 0) |
          isCrewEditing(index) ? (
          <StyledInput>
            <InputBox
              placeholder="ID Type"
              // name="src_idtype"
              name={reportKeys.idtype}
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
      title: "ID Number",
      // dataIndex: "src_id",
      dataIndex: reportKeys.id,
      render: (text, record, index) => {
        return (showInputs.crewColumns && index === 0) |
          isCrewEditing(index) ? (
          <StyledInput>
            <InputBox
              placeholder="ID"
              // name="src_id"
              name={reportKeys.id}
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
      title: "ID Exp. Date",
      // dataIndex: "src_idexpdt",
      dataIndex: reportKeys.idexpdt,
      render: (text, record, index) => {
        if ((showInputs.crewColumns && index === 0) | isCrewEditing(index)) {
          return (
            <StyledInput>
              <DateBox
                style={{ width: 180 }}
                format="YYYY-MM-DD"
                // showTime={{
                //   defaultValue: dayjs("00:00:00", "HH:mm:ss"),
                // }}
                // name="src_idexpdt"
                name={reportKeys.idexpdt}
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
          // return record?.src_idexpdt ? dayjs(text).format("YYYY-MM-DD") : text;
          return record?.[reportKeys.idexpdt]
            ? dayjs(text).format("YYYY-MM-DD")
            : text;
        }
      },
    },
    {
      title: "Ethnicity",
      // dataIndex: "src_ethnicity",
      dataIndex: reportKeys.ethnicity,
      render: (text, record, index) => {
        return (showInputs.crewColumns && index === 0) |
          isCrewEditing(index) ? (
          <StyledInput>
            <InputBox
              placeholder="Ethinicity"
              // name="src_ethnicity"
              name={reportKeys.ethnicity}
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
      title: "Mobile Number",
      ellipsis: true,
      // dataIndex: "src_cell",
      dataIndex: reportKeys.cell,
      render: (text, record, index) => {
        return (showInputs.crewColumns && index === 0) |
          isCrewEditing(index) ? (
          <StyledInput>
            <InputBox
              placeholder="0332-4324223"
              // name="src_cell"
              name={reportKeys.cell}
              pattern={/^\+?[0-9]+(-[0-9]+)*$|^[0-9]+$/}
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
                {
                  pattern: /^\+?[0-9]+(-[0-9]+)*$|^[0-9]+$/,
                  message: "Please enter a valid mobile number!",
                },
                {
                  pattern: /^\d{11}$/,
                  message: "Please enter a valid 11-digit mobile number!",
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
      render: (text, record, index) => {
        if (showButtons) {
          if (showInputs.crewColumns && index === 0) {
            return (
              <Form.Item>
                <div style={{ display: "flex" }}>
                  <SimpleButton
                    onClick={handleCrewCancel}
                    style={{
                      fontWeight: "bold",
                    }}
                    text="Cancel"
                  />
                  <SimpleButton
                    style={{
                      fontWeight: "bold",
                      color: "white",
                      backgroundColor: "#51AE3B",
                    }}
                    text="Save"
                    onClick={onCrewFinish}
                  />
                </div>
              </Form.Item>
            );
          } else {
            if (!showInputs.crewColumns) {
              if (isCrewEditing(index)) {
                return (
                  <Form.Item>
                    <div style={{ display: "flex" }}>
                      <SimpleButton
                        onClick={() => {
                          setCrewKey("");
                          crewForm.resetFields();
                        }}
                        style={{
                          fontWeight: "bold",
                        }}
                        text="Cancel"
                      />
                      <SimpleButton
                        onClick={() => {
                          crewDataEdited(index);
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
              } else {
                return (
                  <IconsStylingWrap>
                    <MdModeEditOutline
                      className="editIcon"
                      onClick={() => {
                        setCrewKey(index);
                        crewForm.setFieldsValue(record);
                        crewForm.resetFields;
                      }}
                    />
                    <MdDelete
                      onClick={() => handleCrewDelete(index)}
                      className="deleteIcon"
                    />
                  </IconsStylingWrap>
                );
              }
            }
          }
        }
      },
    },
  ];

  const additionalColumn2 = [
    // {
    //   title: "Total Number of Crew on Board",
    //   // width:250,
    //   // dataIndex: "src_ethnicity",
    //   dataIndex: reportKeys.total,
    //   render: (text, record, index) => {
    //     return (showInputs.crewColumns && index === 0) |
    //       isCrewEditing(index) ? (
    //       <StyledInput className="mt-4">
    //         <InputNumBox
    //           // mode="tags"
    //           paceholder="Entr Crew Number
    //           "
    //           className="input"
    //           name={reportKeys.total}
    //           type="number"
    //           style={{
    //             width: "100%",
    //           }}
    //           // placeholder="Tags Mode"
    //           // onChange={handleChange}
    //           rules={[
    //             {
    //               required: true,
    //               message: "Please select a nationality!",
    //             },
    //           ]}
    //         />
    //       </StyledInput>
    //     ) : (
    //       text
    //     );
    //   },
    // },
    {
      title: "",
      dataIndex: "action",
      render: (text, record, index) => {
        if (showButtons) {
          if (showInputs.crewColumns && index === 0) {
            return (
              <Form.Item>
                <div style={{ display: "flex" }}>
                  <SimpleButton
                    onClick={handleCrewCancel}
                    style={{
                      fontWeight: "bold",
                    }}
                    text="Cancel"
                  />
                  <SimpleButton
                    style={{
                      fontWeight: "bold",
                      color: "white",
                      backgroundColor: "#51AE3B",
                    }}
                    text="Save"
                    onClick={onCrewFinish}
                  />
                </div>
              </Form.Item>
            );
          } else {
            if (!showInputs.crewColumns) {
              if (isCrewEditing(index)) {
                return (
                  <Form.Item>
                    <div style={{ display: "flex" }}>
                      <SimpleButton
                        onClick={() => {
                          setCrewKey("");
                          crewForm.resetFields();
                        }}
                        style={{
                          fontWeight: "bold",
                        }}
                        text="Cancel"
                      />
                      <SimpleButton
                        onClick={() => {
                          crewDataEdited(index);
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
              } else {
                return (
                  <IconsStylingWrap>
                    <MdModeEditOutline
                      className="editIcon"
                      onClick={() => {
                        setCrewKey(index);
                        crewForm.setFieldsValue(record);
                        crewForm.resetFields;
                      }}
                    />
                    <MdDelete
                      onClick={() => handleCrewDelete(index)}
                      className="deleteIcon"
                    />
                  </IconsStylingWrap>
                );
              }
            }
          }
        }
      },
    },
  ];

  const crewColumns = [
    ...commonColumns,
    ...(labelConfig === "page1" ? additionalColumn1 : []),
    ...(labelConfig === "page2" ? additionalColumn2 : []),
  ];

  return (
    <Form form={crewForm} onFinish={onCrewFinish} className="mb-8">
      <Row className="mb-5">
        <Col span={24} className="flex justify-between">
          <Heading level={5} text="Crew Details" />
          {showButtons && (
            <FilledButton
              text="+ Add Crew Details"
              className="rounded-full border-midnight bg-midnight text-white"
              onClick={handleCrewColumnShowInput}
              disabled={crewKey !== ""}
            />
          )}
        </Col>
      </Row>
      <StyledDiv>
        <Table
          scroll={{ x: "auto" }} // Set the scroll property as per your requirements
          columns={crewColumns}
          dataSource={showInputs.crewColumns ? [{}, ...crewData] : crewData}
          pagination={true}
          className={className} // Use the className prop here
        />
      </StyledDiv>
    </Form>
  );
}

export default CrewTable;
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
