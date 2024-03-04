import { useEffect, useState } from "react";
import {
  Col,
  Row,
  Table,
  Input,
  Form,
  InputNumber,
  Modal,
  Button,
  Select,
} from "antd";
import Heading from "../title/Heading";
import SimpleButton from "../button/SimpleButton";
import styled from "styled-components";
import FilledButton from "../button/FilledButton";
import InputBox from "../form/InputBox";
import { useForm } from "antd/lib/form/Form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputNumBox from "../form/InputNumBox";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import React from "react";
import DateBox from "../form/DateBox";
import dayjs from "dayjs";
import AntdTable from "../table/AntdTable";

function OwnerTable(props) {
  const { ownerData, setOwnerData, showButtons } = props;
  const [ownerForm] = useForm();
  const [ownerKey, setOwnerKey] = useState("");
  const [filterValueBtw, setFilterValueBtw] = useState([null, null]);
  const [filterValue, setFilterValue] = useState(null);
  const [filterOperator, setFilterOperator] = useState("eq");
  const [filteredDataSource, setFilteredDataSource] = useState(null);
  const [showInputs, setShowInputs] = useState({
    ownerColumns: false,
  });

  const handleOwnerColumnShowInput = () => {
    ownerForm.resetFields();
    setShowInputs({ ...showInputs, ownerColumns: true });
  };

  const handleOwnerCancel = (event) => {
    event.preventDefault();
    Modal.confirm({
      title: `Are you sure, you want don't want to add data?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setShowInputs({ ...showInputs, ownerColumns: false });
      },
    });
    ownerForm.resetFields();
  };

  const handleOwnerDelete = (record_index) => {
    Modal.confirm({
      title: `Are you sure, you want to delete this field?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setOwnerData((prev) =>
          prev.filter((item, index) => index !== record_index)
        );
      },
    });
    ownerForm.resetFields();
  };

  const isOwnerEditing = (record_index) => record_index === ownerKey;

  const ownerDataEdited = (key) => {
    const editedValues = ownerForm.getFieldValue();
    const newEdited = {
      ...editedValues,
    };
    setOwnerData((previous) => {
      const newItems = [...previous];
      newItems[key] = newEdited;
      return newItems;
    });
    setOwnerKey("");
    ownerForm.resetFields();
  };

  const onOwnerFinish = async () => {
    const validatedValues = await ownerForm.validateFields();
    if (validatedValues) {
      setOwnerData((current) => [
        ...current,
        {
          ...validatedValues,
        },
      ]);
      toast.success(`Owner data added`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setShowInputs({ ...showInputs, ownerColumns: false });
      ownerForm.resetFields();
    }
  };

  useEffect(() => {
    if (ownerData) {
      setFilteredDataSource(ownerData);
    }
  }, [ownerData]);

  const extractUniqueValues = (ownerData, attribute) => {
    if (!ownerData) {
      return [];
    }
    return [...new Set(ownerData.map((item) => item[attribute]))].map(
      (value) => ({
        text: value,
        value: value,
      })
    );
  };

  const ownerColumns = [
    {
      key: "sro_name",
      title: "Name",
      ellipsis: false,
      width: 250,
      dataIndex: "sro_name",

      // filters: extractUniqueValues(ownerData, "sro_name"),
      // sorter: (a, b) => a.sro_name.localeCompare(b.sro_name),
      // sortDirections: ["descend", "ascend"],
      // filterSearch: true,
      // onFilter: (value, record) => record.sro_name.includes(value),

      render: (text, record, index) => {
        return (showInputs.ownerColumns && index === 0) |
          isOwnerEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              placeholder="Name"
              name="sro_name"
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
      key: "sro_nationality",
      title: "Nationality",
      ellipsis: false,
      width: 250,
      dataIndex: "sro_nationality",

      // filters: extractUniqueValues(ownerData, "sro_nationality"),
      // sorter: (a, b) => a.sro_nationality.localeCompare(b.sro_nationality),
      // sortDirections: ["descend", "ascend"],
      // filterSearch: true,
      // onFilter: (value, record) => record.sro_nationality.includes(value),
      render: (text, record, index) => {
        return (showInputs.ownerColumns && index === 0) |
          isOwnerEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              placeholder="Nationality"
              name="sro_nationality"
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
      key: "sro_idtype",
      title: "ID Type",
      ellipsis: false,
      width: 250,
      dataIndex: "sro_idtype",

      // filters: extractUniqueValues(ownerData, "sro_idtype"),
      // sorter: (a, b) => a.sro_idtype.localeCompare(b.sro_idtype),
      // sortDirections: ["descend", "ascend"],
      // filterSearch: true,
      // onFilter: (value, record) => record.sro_idtype.includes(value),
      render: (text, record, index) => {
        return (showInputs.ownerColumns && index === 0) |
          isOwnerEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              placeholder="ID Type"
              name="sro_idtype"
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
      key: "sro_id",
      title: "ID Number",
      ellipsis: false,
      width: 250,
      dataIndex: "sro_id",
      // filters: extractUniqueValues(ownerData, "sro_id"),
      // sorter: (a, b) => a.sro_id.localeCompare(b.sro_id),
      // sortDirections: ["descend", "ascend"],
      // filterSearch: true,
      // onFilter: (value, record) => record[sro_id].includes(value),
      render: (text, record, index) => {
        return (showInputs.ownerColumns && index === 0) |
          isOwnerEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              placeholder="ID"
              name="sro_id"
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
      key: "sro_idexpdt",
      title: "ID Exp. Date",
      ellipsis: false,
      width: 250,
      dataIndex: "sro_idexpdt",
      // sorter: (a, b) => a.sro_idexpdt - b.sro_idexpdt,

      render: (text, record, index) => {
        if ((showInputs.ownerColumns && index === 0) | isOwnerEditing(index)) {
          return (
            <StyledInput>
              <DateBox
                style={{ with: 250 }}
                format="YYYY-MM-DD"
                name="sro_idexpdt"
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
          return record?.sro_idexpdt ? dayjs(text).format("YYYY-MM-DD") : text;
        }
      },
    },
    {
      key: "sro_ethnicity",
      title: "Ethnicity",
      ellipsis: false,
      width: 250,
      dataIndex: "sro_ethnicity",
      // filters: extractUniqueValues(ownerData, "sro_ethnicity"),
      // sorter: (a, b) => a.sro_ethnicity.localeCompare(b.sro_ethnicity),
      // sortDirections: ["descend", "ascend"],
      // filterSearch: true,
      // onFilter: (value, record) => record[sro_ethnicity].includes(value),
      render: (text, record, index) => {
        return (showInputs.ownerColumns && index === 0) |
          isOwnerEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              placeholder="Ethinicity"
              name="sro_ethnicity"
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
      key: "sro_share",
      title: "Share (%)",
      ellipsis: false,
      width: 250,
      dataIndex: "sro_share",

      // filters: extractUniqueValues(ownerData, "sro_share"),
      // // sorter: (a, b) => a.sro_share - localeCompare(b.sro_share),
      // sorter: (a, b) => a.sro_share - b.sro_share,

      // sortDirections: ["descend", "ascend"],
      // filterSearch: true,
      // onFilter: (value, record) => record[sro_share].includes(value),
      render: (text, record, index) => {
        return (showInputs.ownerColumns && index === 0) |
          isOwnerEditing(index) ? (
          <StyledInput>
            <InputNumBox
              style={{ width: 150 }}
              placeholder="Share"
              name="sro_share"
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
      key: "sro_cell",
      title: "Mobile Number",
      ellipsis: false,
      width: 250,
      dataIndex: "sro_cell",
      // sorter: (a, b) => a.sro_cell - b.sro_cell,

      render: (text, record, index) => {
        return (showInputs.ownerColumns && index === 0) |
          isOwnerEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 150 }}
              placeholder="0332-4324223"
              name="sro_cell"
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
      key: "action",
      dataIndex: "action",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        // if (showButtons) {
          if (showInputs.ownerColumns && index === 0) {
            return (
              <Form.Item>
                <div style={{ display: "flex" }}>
                  <SimpleButton
                    onClick={handleOwnerCancel}
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
                    onClick={onOwnerFinish}
                  />
                </div>
              </Form.Item>
            );
          } else {
            if (!showInputs.ownerColumns) {
              if (isOwnerEditing(index)) {
                return (
                  <Form.Item>
                    <div style={{ display: "flex" }}>
                      <SimpleButton
                        onClick={() => {
                          setOwnerKey("");
                          ownerForm.resetFields();
                        }}
                        style={{
                          fontWeight: "bold",
                        }}
                        text="Cancel"
                      />
                      <SimpleButton
                        onClick={() => {
                          ownerDataEdited(index);
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
                        setOwnerKey(index);
                        ownerForm.setFieldsValue(record);
                        ownerForm.resetFields;
                      }}
                    />
                    <MdDelete
                      onClick={() => handleOwnerDelete(index)}
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

  return (
    <div className="mb-10">
      <Row>
        <Col span={12} className="flex justify-start">
          <Heading
            className=" whitespace-nowrap ml-5"
            level={5}
            text="Owner Details"
          />
        </Col>
        <Col span={12} className="flex justify-end">
          {/* {showButtons && ( */}
          <>
            <FilledButton
              text="+ Add Owner Details"
              className="rounded-full border-midnight bg-midnight text-white mr-4 custom-css-pageheaderButton"
              onClick={handleOwnerColumnShowInput}
              disabled={ownerKey !== ""}
            />
            <FilledButton
              text="+ Add"
              className="rounded-full border-midnight bg-midnight text-white mr-4 custom-css-pageheaderButtonMedia"
              onClick={handleOwnerColumnShowInput}
              disabled={ownerKey !== ""}
            />
          </>
          {/* )} */}
        </Col>
      </Row>
      {/* if showInputs.goodsColumns is true. If it is, it adds an empty row ({})
        at the beginning of the list. If not, it just shows the list as it is. */}
      <AntdTable
        scrollConfig={{ x: true }} // Set the scroll property as per your requirements
        columns={ownerColumns}
        data={showInputs.ownerColumns ? [{}, ...ownerData] : ownerData}
        pagination={true}
        form={ownerForm}
        onFinish={onOwnerFinish}
      />
    </div>
  );
}

export default OwnerTable;
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
