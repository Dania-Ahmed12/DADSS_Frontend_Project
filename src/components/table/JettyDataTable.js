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
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import React from "react";
import DateBox from "../form/DateBox";
import dayjs from "dayjs";
import SimpleButton from "../button/SimpleButton";
import AntdTable from "./AntdTable";

const JettyDataTable = (props) => {
  // Function to handle the deletion of an image
  const handleImageDelete = (index) => {
    Modal.confirm({
      title: `Are you sure, you want to delete this image?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        // If the user confirms, update the state to remove the image at the specified index
        setJettyData((prev) => {
          const newItems = [...prev];
          newItems[index].ird_boat_picture = null; // Set the image to null to delete it
          return newItems;
        });
      },
    });
  };

  const { jettyData, setJettyData, showButtons } = props;
  const [jettyDataForm] = useForm();

  // used to track the currently editing item's index in the jettyData array.
  const [jettyDataKey, setJettyDataKey] = useState("");
  //jetty data array that is currently being edited
  // When you call setJettyData(newValue), it updates the value of jettyData to newValue.

  const [imageFile, setImageFile] = useState(null);

  // Function to handle the upload of an image
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
  };

  // State for managing the visibility of different input sections
  const [showInputs, setShowInputs] = useState({
    jettyDetailColumns: false,
  });

  // Function to show input fields for adding Jetty data
  const handleJettyDataColumnShowInput = () => {
    setImageFile(null);
    jettyDataForm.resetFields();
    setShowInputs({ ...showInputs, jettyDetailColumns: true });
  };

  // Function to cancel adding Jetty data
  const handleJettyDataColumnCancel = (event) => {
    event.preventDefault();
    Modal.confirm({
      title: `Are you sure, you want don't want to add data?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setShowInputs({ ...showInputs, jettyDetailColumns: false });
      },
    });
  };

  // Function to delete Jetty data
  const handleJettyDataDelete = (record_index) => {
    Modal.confirm({
      title: `Are you sure, you want to delete this field?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setJettyData((prev) =>
          // Remove the item at the specified index from the jetty data array
          // keep the elements in the array where the index is not equal to the record_index
          prev.filter((item, index) => index !== record_index)
        );
      },
    });
    jettyDataForm.resetFields();
  };

  // check if a Jetty data record is being edited  by comparing the provided index with the stored jettyDataKey.
  // If they are equal, it indicates that the record at the specified index is being edited.
  const isJettyDataEditing = (record_index) => record_index === jettyDataKey;

  // Function to save edited Jetty data
  const jettyDataEdited = (key, index) => {
    const editedValues = jettyDataForm.getFieldValue();
    // Create a new object with the edited values
    const newEdited = {
      ...editedValues,
      ird_boat_picture: imageFile,
    };
    // Update the Jetty data state by replacing the item at the specified key/index with the new edited item
    setJettyData((previous) => {
      const newItems = [...previous];
      newItems[key] = newEdited;
      return newItems;
    });
    setJettyDataKey("");
    jettyDataForm.resetFields();
  };

  // Function to handle Jetty data form submission
  const onjettyDataFinish = async () => {
    const validatedValues = await jettyDataForm.validateFields();
    if (validatedValues) {
      // Update the Jetty data state by adding a new item with the validated values
      setJettyData((current) => [
        ...current,
        {
          ...validatedValues,
          ird_boat_picture: imageFile, // Include the image file in the state
        },
      ]);
      toast.success(`Jetty Detail data added`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setShowInputs({ ...showInputs, jettyDetailColumns: false });
      jettyDataForm.resetFields();
    }
  };

  const jettyDataColumns = [
    {
      title: "Type of Boat",
      dataIndex: "ird_boat_types",
      ellipsis: true,
      render: (text, record, index) => {
        // Conditionally render an input field or existing text
        return (showInputs.jettyDetailColumns && index === 0) |
          isJettyDataEditing(index) ? (
          <StyledInput>
            <InputBox
              name="ird_boat_types"
              rules={[
                {
                  required: true,
                  message: "Required Field!",
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
      title: "No. of Boats",
      dataIndex: "ird_total_boats",
      ellipsis: true,
      render: (text, record, index) => {
        return (showInputs.jettyDetailColumns && index === 0) |
          isJettyDataEditing(index) ? (
          <StyledInput>
            <InputNumBox
              name="ird_total_boats"
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
      title: "Detected From",
      dataIndex: "ird_detected_from",
      ellipsis: true,
      render: (text, record, index) => {
        if (showInputs.jettyDetailColumns && index === 0) {
          return (
            <StyledInput>
              <DateBox
                style={{ width: 180 }}
                format="YYYY-MM-DD HH:mm:ss"
                showTime={{
                  defaultValue: dayjs("00:00:00", "HH:mm:ss"),
                }}
                name="ird_detected_from"
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
          return jettyData ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") : text;
        }
      },
    },
    {
      title: "Detected To",
      dataIndex: "ird_detected_to",
      ellipsis: true,
      render: (text, record, index) => {
        if (showInputs.jettyDetailColumns && index === 0) {
          return (
            <StyledInput>
              <DateBox
                style={{ width: 180 }}
                format="YYYY-MM-DD HH:mm:ss"
                showTime={{
                  defaultValue: dayjs("00:00:00", "HH:mm:ss"),
                }}
                name="ird_detected_to"
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
          return jettyData ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") : text;
        }
      },
    },
    {
      title: "Action Observed",
      dataIndex: "ird_act_observed",
      ellipsis: true,
      render: (text, record, index) => {
        return (showInputs.jettyDetailColumns && index === 0) |
          isJettyDataEditing(index) ? (
          <StyledInput>
            <InputBox
              name="ird_act_observed"
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
      title: "Transferring",
      dataIndex: "ird_transferring_loc",
      ellipsis: true,
      render: (text, record, index) => {
        return (showInputs.jettyDetailColumns && index === 0) |
          isJettyDataEditing(index) ? (
          <StyledInput>
            <InputBox
              name="ird_transferring_loc"
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
      title: "Probability",
      dataIndex: "ird_probability",
      ellipsis: true,
      render: (text, record, index) => {
        return (showInputs.jettyDetailColumns && index === 0) |
          isJettyDataEditing(index) ? (
          <StyledInput>
            <InputNumBox
              name="ird_probability"
              // suffix="%"
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
      title: "Picture Upload",
      dataIndex: "ird_boat_picture",
      ellipsis: true,
      render: (text, record, index) => {
        return (showInputs.jettyDetailColumns && index === 0) |
          (isJettyDataEditing(index) && !record.ird_boat_picture) ? (
          <StyledInput>
            <input
              type="file"
              name="ird_boat_picture"
              accept=".png,.jpg,.jpeg,.gif,.tiff"
              onChange={handleImageUpload}
            />
          </StyledInput>
        ) : (
          <div>
            {text ? (
              <div>
                {/* Display the uploaded picture or show "No picture" if no picture is present */}
                <IconsStylingWrap>
                  <span>
                    {record.ird_boat_picture
                      ? record.ird_boat_picture.name
                      : "No picture"}
                  </span>
                  {isJettyDataEditing(index) ? (
                    // Display delete icon only when the row is being edited
                    <MdDelete
                      onClick={() => handleImageDelete(index)}
                      className="deleteIcon"
                    />
                  ) : null}
                </IconsStylingWrap>
              </div>
            ) : (
              // Display "No picture" if no picture is present
              <span>No picture</span>
            )}
          </div>
        );
      },
    },
    {
      title: "Name of Nakwa",
      dataIndex: "ird_nakwa_name",
      ellipsis: true,
      render: (text, record, index) => {
        return (showInputs.jettyDetailColumns && index === 0) |
          isJettyDataEditing(index) ? (
          <StyledInput>
            <InputBox
              name="ird_nakwa_name"
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
      title: "Owner Name",
      dataIndex: "ird_owner_name",
      ellipsis: true,
      render: (text, record, index) => {
        return (showInputs.jettyDetailColumns && index === 0) |
          isJettyDataEditing(index) ? (
          <StyledInput>
            <InputBox
              name="ird_owner_name"
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
      title: "No. of Crew",
      dataIndex: "ird_number_of_crew",
      ellipsis: true,
      render: (text, record, index) => {
        return (showInputs.jettyDetailColumns && index === 0) |
          isJettyDataEditing(index) ? (
          <StyledInput>
            <InputNumBox
              name="ird_number_of_crew"
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
      title: "",
      dataIndex: "action",
      ellipsis: true,
      render: (text, record, index) => {
        if (showInputs.jettyDetailColumns && index === 0) {
          return (
            <Form.Item>
              <div style={{ display: "flex" }}>
                <SimpleButton
                  onClick={handleJettyDataColumnCancel}
                  style={{
                    fontWeight: "bold",
                  }}
                  text="Cancel"
                />
                <SimpleButton
                  onClick={onjettyDataFinish}
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
        if (!showInputs.jettyDataEdited) {
          if (jettyData.length && !isJettyDataEditing(index)) {
            return (
              <IconsStylingWrap>
                <MdModeEditOutline
                  className="editIcon"
                  onClick={() => {
                    setJettyDataKey(index);
                    jettyDataForm.setFieldsValue(record);
                  }}
                />
                <MdDelete
                  onClick={() => handleJettyDataDelete(index)}
                  className="deleteIcon"
                />
              </IconsStylingWrap>
            );
          }
          if (isJettyDataEditing(index)) {
            return (
              <Form.Item>
                <div style={{ display: "flex" }}>
                  <SimpleButton
                    onClick={() => {
                      setJettyDataKey("");
                    }}
                    style={{
                      fontWeight: "bold",
                    }}
                    text="Cancel"
                  />
                  <SimpleButton
                    onClick={() => {
                      jettyDataEdited(index);
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
    // <Form form={jettyDataForm} onFinish={onjettyDataFinish} className="mb-8">
    //   <Row className="mb-5">
    //     <Col span={24} className="flex justify-between">
    //       <Heading level={5} text="Intel Report Details" />
    //       <FilledButton
    //         text="+Add Intel Report Detail"
    //         className="rounded-full border-midnight bg-midnight text-white"
    // onClick={handleJettyDataColumnShowInput}
    // disabled={jettyDataKey !== ""}
    //       />
    //     </Col>
    //   </Row>
    //   <StyledDiv>
    //     <Table
    //       columns={jettyDataColumns}
    //       dataSource={
    //         showInputs.jettyDetailColumns ? [{}, ...jettyData] : jettyData
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
            className="whitespace-nowrap ml-5"
            level={5}
            text="Jetty Details"
          />
        </Col>
        <Col span={12} className="flex justify-end">
          {showButtons && (
            <FilledButton
              text="+ Add Jetty Details"
              className="rounded-full border-midnight bg-midnight text-white mr-4"
              onClick={handleJettyDataColumnShowInput}
              disabled={jettyDataKey !== ""}
            />
          )}
        </Col>
      </Row>
      {/* if showInputs.goodsColumns is true. If it is, it adds an empty row ({})
        at the beginning of the list. If not, it just shows the list as it is. */}
      <AntdTable
        form={jettyDataForm}
        onFinish={onjettyDataFinish}
        scroll={{ x: "auto" }} // Set the scroll property as per your requirements
        columns={jettyDataColumns}
        data={showInputs.jettyDetailColumns ? [{}, ...jettyData] : jettyData}
        // dataSource={showInputs.goodsColumns ? [{}] : goodsData}
      />

      {/* //{" "} */}
      {/* </Form> */}
    </div>
  );
};

export default JettyDataTable;
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
