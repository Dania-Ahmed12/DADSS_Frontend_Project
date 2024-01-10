import React, { useEffect, useState } from "react";
import { RxArrowLeft } from "react-icons/rx";
import AntdTable from "../../src/components/table/AntdTable";
import FilledButton from "../../src/components/button/FilledButton";
import { Col, Form, Input, Modal, Row } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Heading from "../../src/components/title/Heading";
import SimpleButton from "../../src/components/button/SimpleButton";
import InputBox from "../../src/components/form/InputBox";
import SelectBox from "../../src/components/form/SelectBox";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  addPlatformData,
  fetchAllPlatformData,
} from "../../src/redux/thunks/platformData";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "antd/lib/form/Form";
import Cookies from "js-cookie";
import { platform_type_list } from "../../src/helper/dropdown";
import axios from "axios";

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
  const router = useRouter();
  const dispatch = useDispatch();

  const columns = [
    {
      title: "Platform ID",
      dataIndex: "pf_id",
      render: (text, record, index) => {
        if (showInputs && index === 0) {
          return (
            <StyledInput>
              <InputBox
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
      render: (text, record, index) => {
        if (showInputs && index === 0) {
          return (
            <StyledInput>
              <InputBox
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
      dataIndex: "pf_type",
      render: (text, record, index) => {
        if (showInputs && index === 0) {
          return (
            <StyledInput>
              <SelectBox
                placeholder="Vessels"
                name="pf_type"
                rules={[{ required: true, message: "Required" }]}
                options={platform_type_list.map((item) => ({
                  value: item,
                  lable: item,
                }))}
              />
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
      render: (text, record, index) => {
        if (showInputs && index === 0) {
          return (
            <StyledInput>
              <InputBox placeholder="CO" name="pf_co" rules={[req_rule]} />
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
      render: (text, record, index) => {
        if (showInputs && index === 0) {
          return (
            <StyledInput>
              <InputBox placeholder="Other Info" name="pf_info" />
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
            </Form.Item>
          );
        } else {
          return text;
        }
      },
    },
  ];
  const handleBack = () => {
    router.push("/");
  };
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
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/platform`,
          validatedValues
        );

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
      <ToastContainer />
      <div className="flex items-center mt-14">
        <RxArrowLeft
          onClick={handleBack}
          cursor={"pointer"}
          className="ml-14"
          fontSize={25}
        />
        <span
          onClick={handleBack}
          className=" ml-2 text-sm font-medium"
          style={{ cursor: "pointer" }}
        >
          Back
        </span>
      </div>
      <Row className="mx-14 mb-8 mt-4">
        <Col span={11}>
          <Heading level={4} text="MSA Platform Data (View/Add)" />
        </Col>
        <Col span={8}>
          <Input
            size="large"
            placeholder="Search"
            allowClear
            prefix={<SearchOutlined />}
            className="search-input"
            onChange={(e) => setSearchData(e.target.value)}
          />
        </Col>
        <Col className="flex justify-center items-center" span={4} offset={1}>
          <FilledButton
            text="+Add Platform"
            className="rounded-full border-midnight bg-midnight text-white"
            onClick={handleShowInput}
          />
        </Col>
      </Row>
      <div>
        <AntdTable
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
