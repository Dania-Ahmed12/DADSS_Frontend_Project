import { Col, Form, Row, Input, Space, Typography, Radio } from "antd";
import React, { use, useEffect } from "react";
import FilledButton from "../../src/components/button/FilledButton";
import OutlineButton from "../../src/components/button/OutlineButton";
import InputBox from "../../src/components/form/InputBox";
import SelectBox from "../../src/components/form/SelectBox";
import PasswordBox from "../../src/components/form/PasswordBox";
import Heading from "../../src/components/title/Heading";
import Checkbox from "../../src/components/form/CheckBox";
import { RxArrowLeft } from "react-icons/rx";
import { useRouter } from "next/router";
import { useForm } from "antd/lib/form/Form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { registerApi } from "../../src/redux/thunks/userAuth";
import { fetchAllPlatformData } from "../../src/redux/thunks/platformData";
import axios from "axios";
function CreateUser() {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  const dispatch = useDispatch();
  const [form] = useForm();

  const { data } = useSelector((state) => state.fetchPlatformData);

  useEffect(() => {
    dispatch(fetchAllPlatformData());
    form.resetFields();
  }, [dispatch]);

  const onFinish = async () => {
    const validatedValues = await form.validateFields();
    if (validatedValues) {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/register`,
          validatedValues
        );

        if (response.status === 201) {
          toast.success("User Created", {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          router.push("/user");
        }
      } catch {
        toast.error("User already exists", {
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
      // router.push("/user")
      // dispatch(registerApi(validatedValues));
    }
  };

  const onFinishFailed = (errorInfo) => {
    toast.error(errorInfo, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

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
        <Col>
          <Heading level={4} text="Create New User" />
        </Col>
      </Row>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autocomplete="off"
        className="shadow mx-14 px-3 py-10"
      >
        <Row className="flex justify-center">
          <Col span={11}>
            <InputBox
              autocomplete="off"
              label="Username"
              name="username"
              autofi
              placeholder="Username"
              // minLength={6}
              // maxLength={12}
              pattern="^[a-zA-Z0-9]+$"
              rules={[
                { required: true, message: "Please input the User ID!" },
                {
                  pattern: "^[a-zA-Z0-9]+$",
                  message: "User ID can only contain letters and numbers.",
                },
                {
                  min: 6,
                  message: "User ID must be at least 6 characters long.",
                },
                {
                  max: 12,
                  message: "User ID cannot be more than 12 characters long.",
                },
              ]}
            />
            <SelectBox
              autocomplete="off"
              name="u_pf_id"
              placeholder="Select Platform"
              label="Select Platform"
              // defaultValue="MSA-Craft-One"
              options={data.map((item) => ({
                value: item.pf_id,
                label: item.pf_name,
              }))}
              // options={[
              //   { value: "MSA-Craft-One", label: "MSA-Craft-One" },
              //   { value: "SINC", label: "SINC" },
              //   { value: "MSA-Craft-Two", label: "MSA-Craft-Two" },
              //   { value: "MSA-Craft-Three", label: "MSA-Craft-Three" },
              //   { value: "MSA-Craft-Four", label: "MSA-Craft-Four" },
              // ]}
              rules={[{ required: true, message: "Please select a platform!" }]}
            />
          </Col>
          <Col span={11} offset={1}>
            <PasswordBox
              autocomplete="off"
              label="Password"
              name="password"
              placeholder="*****"
              minLength={8}
              maxLength={16}
              pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).*$"
              rules={[
                { required: true, message: "Please input your password!" },
                {
                  pattern:
                    "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).*$",
                  message:
                    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
                },
              ]}
            />
          </Col>
        </Row>
        <Row className="flex justify-center">
          <Col span={23}>
            <Typography className="text-lg py-5">
              Access Point Details
            </Typography>
          </Col>
        </Row>

        <Row>
          <Form.Item
            name="category"
            rules={[{ required: true, message: "Please select option!" }]}
          >
            <Radio.Group buttonStyle="solid">
              <Space align="left">
                <Radio.Button value="A">Senior Officer</Radio.Button>
              </Space>
              <Space align="center">
                <Radio.Button value="B">Operator</Radio.Button>
              </Space>
              <Space align="right">
                <Radio.Button value="C">Visualizer</Radio.Button>
              </Space>
            </Radio.Group>
          </Form.Item>
        </Row>

        {/* <Row className="flex justify-center">
          <Col span={11}>
            <Form.Item
              initialValue={false}
              valuePropName="checked"
              name="u_access_form"
            >
              <Checkbox label="Can Access Forms Input" />
            </Form.Item>
            <Form.Item
              initialValue={false}
              valuePropName="checked"
              name="u_view_map"
            >
              <Checkbox
                value="accessMaps"
                label="Can Access Activity Maps & Trends"
              />
            </Form.Item>
            <Form.Item
              initialValue={false}
              valuePropName="checked"
              name="u_create_user"
            >
              <Checkbox value="createUsers" label="Can Create New Users" />
            </Form.Item>
          </Col>
          <Col span={11} offset={1}>
            <Form.Item
              initialValue={false}
              valuePropName="checked"
              name="u_access_rvdata"
            >
              <Checkbox
                value="accessData"
                label="Can Access Registered Vessel Historic Data"
              />
            </Form.Item>

            <div className="flex">
              <Form.Item
                initialValue={false}
                valuePropName="checked"
                name="u_crew"
              >
                <Checkbox value="crew" label="Crew" />
              </Form.Item>
              <Form.Item
                initialValue={false}
                valuePropName="checked"
                name="u_owner"
              >
                <Checkbox value="Owner" label="Owner" />
              </Form.Item>
              <Form.Item
                initialValue={false}
                valuePropName="checked"
                name="u_goods"
              >
                <Checkbox value="Goods" label="Goods" />
              </Form.Item>
            </div>
          </Col>
        </Row> */}

        <Row className="flex justify-center">
          <Col span={17} className="flex justify-end">
            <Form.Item>
              <OutlineButton
                text="Cancel"
                className="rounded-full font-semibold border-gray pl-10 pr-10 bg-gray text-white"
              />
              <FilledButton
                htmlType="submit"
                text="Save"
                className="rounded-full font-semibold pl-10 pr-10 border-midnight bg-midnight text-white ml-3"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
}

export default CreateUser;

export async function getServerSideProps(context) {
  return {
    props: {
      data: {
        title: "Create User",
      },
    },
  };
}
