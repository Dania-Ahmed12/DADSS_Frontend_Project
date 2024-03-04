import { useEffect, useState } from "react";
import { Col, Row, Table, Input, Form, InputNumber, Modal, Button } from "antd";
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
import AntdTable from "../table/AntdTable";
import FormTable from "../table/FromTable";
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
  const [filterValueBtw, setFilterValueBtw] = useState([null, null]);
  const [filterValue, setFilterValue] = useState(null);
  const [filterOperator, setFilterOperator] = useState("eq");
  const [filteredDataSource, setFilteredDataSource] = useState(null);

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

  useEffect(() => {
    if (crewData) {
      setFilteredDataSource(crewData);
    }
  }, [crewData]);

  const extractUniqueValues = (crewData, attribute) => {
    if (!crewData) {
      return [];
    }
    return [...new Set(crewData.map((item) => item[attribute]))].map(
      (value) => ({
        text: value,
        value: value,
      })
    );
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
      ellipsis: false,
      key: "name",
      width: 250,
      dataIndex: reportKeys.name,

      // filters: extractUniqueValues(crewData, reportKeys.name),
      // sorter: (a, b) => a[reportKeys.name].localeCompare(b[reportKeys.name]),
      // sortDirections: ["descend", "ascend"],
      // filterSearch: true,
      // onFilter: (value, record) => record[reportKeys.name].includes(value),

      render: (text, record, index) => {
        return (showInputs.crewColumns && index === 0) |
          isCrewEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
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
      ellipsis: false,
      key: "nationality",
      width: 250,
      dataIndex: reportKeys.nationality,

      // filters: extractUniqueValues(crewData, reportKeys.nationality),
      // sorter: (a, b) => a[reportKeys.nationality].localeCompare(b[reportKeys.nationality]),
      // sortDirections: ["descend", "ascend"],
      // filterSearch: true,
      // onFilter: (value, record) => record[reportKeys.nationality].includes(value),
      render: (text, record, index) => {
        return (showInputs.crewColumns && index === 0) |
          isCrewEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
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
      ellipsis: false,
      width: 250,
      key: "idtype",
      dataIndex: reportKeys.idtype,
      // filters: extractUniqueValues(crewData, reportKeys.idtype),
      // sorter: (a, b) =>
      //   a[reportKeys.idtype].localeCompare(b[reportKeys.idtype]),
      // sortDirections: ["descend", "ascend"],
      // filterSearch: true,
      // onFilter: (value, record) => record[reportKeys.idtype].includes(value),
      render: (text, record, index) => {
        return (showInputs.crewColumns && index === 0) |
          isCrewEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
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
      ellipsis: false,
      width: 250,
      key: "id",
      // filters: extractUniqueValues(crewData, reportKeys.id),
      // sorter: (a, b) =>
      //   a[reportKeys.id].localeCompare(b[reportKeys.id]),
      // sortDirections: ["descend", "ascend"],
      // filterSearch: true,
      // onFilter: (value, record) => record[reportKeys.id].includes(value),

      dataIndex: reportKeys.id,
      render: (text, record, index) => {
        return (showInputs.crewColumns && index === 0) |
          isCrewEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
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
      ellipsis: false,
      width: 250,
      key: "idexpdt",
      // sorter: (a, b) => a[reportKeys.idexpdt] - b[reportKeys.idexpdt], // Numerical comparison

      dataIndex: reportKeys.idexpdt,
      render: (text, record, index) => {
        if ((showInputs.crewColumns && index === 0) | isCrewEditing(index)) {
          return (
            <StyledInput>
              <DateBox
                style={{ width: 150 }}
                format="YYYY-MM-DD"
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
      ellipsis: false,
      width: 250,
      key: "ethnicity",
      dataIndex: reportKeys.ethnicity,

      // filters: extractUniqueValues(crewData, reportKeys.ethnicity),
      // sorter: (a, b) =>
      //   a[reportKeys.ethnicity].localeCompare(b[reportKeys.ethnicity]),
      // sortDirections: ["descend", "ascend"],
      // filterSearch: true,
      // onFilter: (value, record) => record[reportKeys.ethnicity].includes(value),
      render: (text, record, index) => {
        return (showInputs.crewColumns && index === 0) |
          isCrewEditing(index) ? (
          <StyledInput>
            <InputBox
              placeholder="Ethinicity"
              style={{ width: 150 }}
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
      key: "cell",
      // sorter: (a, b) => a[reportKeys.cell] - b[reportKeys.cell], // Numerical comparison
      ellipsis: false,
      width: 250,
      dataIndex: reportKeys.cell,
      render: (text, record, index) => {
        return (showInputs.crewColumns && index === 0) |
          isCrewEditing(index) ? (
          <StyledInput>
            <InputBox
              placeholder="0332-4324223"
              style={{ width: 150 }}
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
      key: "action",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        // if (showButtons) {
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
    // },
  ];

  const additionalColumn2 = [
    {
      key: "action",
      title: "",
      dataIndex: "action",
      render: (text, record, index) => {
        // if (showButtons) {
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
    // },
  ];

  const crewColumns = [
    ...commonColumns,
    ...(labelConfig === "page1" ? additionalColumn1 : []),
    ...(labelConfig === "page2" ? additionalColumn2 : []),
  ];
  return (
    <div className="mb-10">
      <Row>
        <Col span={12} className="flex justify-start">
          <Heading
            className=" whitespace-nowrap ml-5"
            level={5}
            text="Crew Details"
          />
        </Col>
        <Col span={12} className="flex justify-end">
          {/* {showButtons && ( */}
            <>
              <FilledButton
                text="+ Add Crew Details"
                className="rounded-full border-midnight bg-midnight text-white mr-4 custom-css-pageheaderButton"
                onClick={handleCrewColumnShowInput}
                disabled={crewKey !== ""}
              />
              <FilledButton
                text="+ Add"
                className="rounded-full border-midnight bg-midnight text-white mr-4 custom-css-pageheaderButtonMedia"
                onClick={handleCrewColumnShowInput}
                disabled={crewKey !== ""}
              />
            </>
          {/* )} */}
        </Col>
      </Row>
      <AntdTable
        scrollConfig={{ x: true }} // Set the scroll property as per your requirements
        columns={crewColumns}
        data={showInputs.crewColumns ? [{}, ...crewData] : crewData}
        pagination={true}
        className={className} // Use the className prop here
        form={crewForm}
        onFinish={onCrewFinish}
      />
    </div>
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
