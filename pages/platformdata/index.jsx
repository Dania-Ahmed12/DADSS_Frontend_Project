import React, { useEffect, useState } from "react";
import AntdTable from "../../src/components/table/AntdTable";
import { Form, Modal } from "antd";
import SimpleButton from "../../src/components/button/SimpleButton";
import InputBox from "../../src/components/form/InputBox";
import SelectBox from "../../src/components/form/SelectBox";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { fetchAllPlatformData } from "../../src/redux/thunks/platformData";
import styled from "styled-components";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "antd/lib/form/Form";
import axios from "axios";
import PageHeader from "../../src/components/pageheader/pageHeader";

const StyledInput = styled.div`
  .ant-form-item-explain-error {
    font-size: 12px;
  }
`;

const req_rule = {
  required: true,
  message: "Required",
};

function PlatformId() {
  const [showInputs, setShowInputs] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [form] = useForm();
  const { data, isLoading } = useSelector((state) => state.fetchPlatformData);
  const dispatch = useDispatch();
  // Define state to store the options data
  const [platformTypes, setPlatformTypes] = useState([]);
  const [otherSelected, setOtherSelected] = useState(false);
  const [selectedType, setSelectedType] = useState(""); // Added selectedType state

  const fetchPlatformTypes = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/platform_type`
      );
      const types = response.data.map((item) => ({
        key: item.type_key,
        title: item.type_title,
      }));
      setPlatformTypes(types);
      console.log(types);
    } catch (error) {
      console.error("Error fetching platform types:", error);
    }
  };
  useEffect(() => {
    fetchPlatformTypes();
  }, []);
  const columns = [
    {
      title: "Platform ID",
      dataIndex: "pf_id",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        if (showInputs && index === 0) {
          return (
            <StyledInput>
              <InputBox
                style={{ width: 150 }}
                placeholder="Platform ID"
                name="pf_id"
                minLength={6}
                maxLength={12}
                rules={[
                  req_rule,
                  {
                    pattern: /^[0-9]+$/,
                    message: "ID Number can only contain numbers.",
                  },
                ]}
              />
            </StyledInput>
          );
        } else {
          return text;
        }
      },
    },
    {
      title: "Full Name",
      dataIndex: "pf_name",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        if (showInputs && index === 0) {
          return (
            <StyledInput>
              <InputBox
                style={{ width: 150 }}
                placeholder="Name"
                name="pf_name"
                minLength={3}
                maxLength={15}
                rules={[req_rule]}
              />
            </StyledInput>
          );
        } else {
          return text;
        }
      },
    },
    {
      title: "Type",
      dataIndex: "pf_type_key",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        if (showInputs && index === 0) {
          // return (
          //   <StyledInput>
          //     <SelectBox
          //       placeholder="Vessels"
          //       name="pf_type_key"
          //       style={{ width: 150 }}
          //       rules={[{ required: true, message: "Required" }]}
          //       options={[
          //         ...platformTypes.map((item) => ({
          //           value: item.key, // Use type_key as value
          //           label: item.title, // Use type_title as label
          //         })),
          //         { value: "Other", label: "Other" },
          //       ]}
          //       onChange={(value) => {
          //         if (value === "Other") {
          //           setOtherSelected(true);
          //         } else {
          //           setOtherSelected(false);
          //         }
          //       }}
          //     />

          //     {otherSelected && (
          //       <StyledInput>
          //         <InputBox
          //           placeholder="Other"
          //           name="pf_type_key"
          //           rules={[{ required: true, message: "Required" }]}
          //           style={{ width: 150 }}
          //         />
          //       </StyledInput>
          //     )}
          //   </StyledInput>
          // );
          const isInitialRow = index === 0;
          const isShowInputs = showInputs || isInitialRow;
          const isOtherSelected = selectedType === "Other";

          return (
            <StyledInput>
              {isShowInputs && (
                <>
                  {!isOtherSelected && (
                    <SelectBox
                      placeholder="Vessels"
                      name="pf_type_key"
                      style={{ width: 150 }}
                      rules={[{ required: true, message: "Required" }]}
                      options={[
                        ...platformTypes.map((item) => ({
                          value: item.key, // Use type_key as value
                          label: item.title, // Use type_title as label
                        })),
                        { value: "Others", label: "Others" },
                      ]}
                      onChange={(value) => {
                        setSelectedType(value);
                      }}
                    />
                  )}
                  {isOtherSelected && (
                    <StyledInput>
                      <InputBox
                        placeholder="Other"
                        name="pf_type_key"
                        rules={[{ required: true, message: "Required" }]}
                        style={{ width: 150 }}
                      />
                    </StyledInput>
                  )}
                </>
              )}
            </StyledInput>
          );
        } else {
          return text;
        }
      },
    },
    {
      title: "Squadron",
      dataIndex: "pf_squadron",
      ellipsis: false,
      width: 250,
      render: (text, record, index) => {
        if (showInputs && index === 0) {
          return (
            <StyledInput>
              <SelectBox
                placeholder="Squadron"
                name="pf_squadron"
                rules={[req_rule]}
                options={[
                  {
                    value: "OSRON 25 SQN",
                    label: "OSRON 25 SQN",
                  },
                  {
                    value: "OSRON 27 SQN",
                    label: "OSRON 27 SQN",
                  },
                  {
                    value: "OSRON 28 SQN",
                    label: "OSRON 28 SQN",
                  },
                ]}
                style={{ width: 150 }}
              />
            </StyledInput>
          );
        } else {
          return text;
        }
      },
    },
    {
      title: "CO",
      dataIndex: "pf_co",
      ellipsis: false,
      width: 250,
      width: 200,
      render: (text, record, index) => {
        if (showInputs && index === 0) {
          return (
            <StyledInput>
              <InputBox
                placeholder="CO"
                name="pf_co"
                rules={[req_rule]}
                style={{ width: 150 }}
              />
            </StyledInput>
          );
        } else {
          return text;
        }
      },
    },
    {
      title: "Other Info",
      dataIndex: "pf_info",
      width: 200,
      render: (text, record, index) => {
        if (showInputs && index === 0) {
          return (
            <StyledInput>
              <InputBox
                placeholder="Other Info"
                name="pf_info"
                style={{ width: 150 }}
              />
            </StyledInput>
          );
        } else {
          return text;
        }
      },
    },
    {
      title: "Status",
      dataIndex: "pf_status",
      width: 200,
      render: (text, record, index) => {
        if (showInputs && index === 0) {
          return (
            <StyledInput>
              <SelectBox
                placeholder="Status"
                name="pf_status"
                style={{ width: 150 }}
                rules={[req_rule]}
                options={[
                  {
                    value: "OPS",
                    label: "OPS",
                  },
                  {
                    value: "Non-OPS",
                    label: "Non-OPS",
                  },
               
                ]}
                onChange={(value) => {
                  setSelectedType(value);
                }}
              />
            </StyledInput>
          );
        } else {
          return text;
        }
      },
    },
    {
      title: "",
      dataIndex: "action",
      render: (text, record, index) => {
        if (showInputs && index === 0) {
          return (
            <Form.Item style={{ display: "flex" }}>
              <div style={{ display: "flex" }}>
                <SimpleButton
                  onClick={handleDelete}
                  style={{
                    fontWeight: "bold",
                  }}
                  text="Cancel"
                />
                <SimpleButton
                  htmlType="submit"
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
        } else {
          return text;
        }
      },
    },
  ];

  const handleShowInput = () => {
    setShowInputs(true);
    setDisabled(true);
  };

  const handleDelete = (event) => {
    Modal.confirm({
      title: `Are you sure, you want to delete this field?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setShowInputs(false);
        setDisabled(false);
      },
    });
  };
  const onFinish = async () => {
    const validatedValues = await form.validateFields();
    if (validatedValues) {
      console.log(validatedValues.pf_type_key);
      try {

             let typeKey;
             if (validatedValues.pf_type_key === "Other") {
               const response = await axios.post(
                 `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/platform_type`,
                 { type_title: validatedValues.pf_type_key }
               );
               console.log(response)
               typeKey = response.data.type_key;
             } else {
               typeKey = validatedValues.pf_type_key;
             }
        const formData = {
          ...validatedValues,
          pf_type_key: validatedValues.pf_type_key, // Make sure pf_type_key is directly accessed
        };
        console.log("Form Data:", formData);
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/platform`,
          formData
        );
        console.log(response.data);
        if (response.status === 201) {
          toast.success("Platform Data Saved", {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          setShowInputs(false);
          setDisabled(false);
          form.resetFields();
          dispatch(fetchAllPlatformData());
        }
      } catch {
        toast.error("Platform already exists", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    }
  };

  useEffect(() => {
    dispatch(fetchAllPlatformData(searchData));
  }, [searchData]);

  return (
    <>
      <div>
        <PageHeader
          title="MSA Platform Data (View/Add)"
          btnTitle="+ Add Platform"
          btnTitleMedia="+"
          onSearchChange={setSearchData}
          onNavigate={handleShowInput}
          placeholder="Search by Platform ID / Full Name "
          showButton={true}
        />
      </div>
      <div>
        <AntdTable
          scrollConfig={{ x: true }}
          form={form}
          onFinish={onFinish}
          columns={columns}
          data={showInputs ? [data[0], ...data] : data}
          loading={isLoading}
        />
      </div>
    </>
  );
}

export default PlatformId;

export async function getServerSideProps(context) {
  return {
    props: {
      data: {
        title: "Platform Data",
      },
    },
  };
}
