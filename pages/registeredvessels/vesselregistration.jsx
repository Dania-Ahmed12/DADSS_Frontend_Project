import { Col, Form, Row } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import FilledButton from "../../src/components/button/FilledButton";
import OutlineButton from "../../src/components/button/OutlineButton";
import InputBox from "../../src/components/form/InputBox";
import SelectBox from "../../src/components/form/SelectBox";
import styled from "styled-components";
import { useForm } from "antd/lib/form/Form";
import {
  country_list,
  ethnicity_list,
  type_list,
  province,
} from "../../src/helper/dropdown";
import Cookies from "js-cookie";
import PageHeader from "../../src/components/pageheader/pageHeader";

function RegisteredVesselData() {
  const pf_id = localStorage.getItem("u_pf_id")
  const router = useRouter();
  const [form] = useForm();
  const [flag, setFlag] = useState("India");

  const handleSubmit = async () => {
    try {
      const validatedValues = await form.validateFields();
     localStorage.setItem("formData", JSON.stringify(form.getFieldsValue()));
      if (validatedValues) {
        const nakwaDetails = {
          rvc_name: validatedValues.rvc_name,
          rvc_nationality: validatedValues.rvc_nationality,
          rvc_ethnicity: validatedValues.rvc_ethnicity,
          rvc_cell: validatedValues.rvc_cell,
        };
        const data = {
          rv_pf_id: pf_id,
          rv_id: validatedValues.rv_id,
          rv_regno: validatedValues.rv_regno,
          rv_name: validatedValues.rv_name,
          rv_type: validatedValues.rv_type,
          rv_flag: validatedValues.rv_flag,
          rv_province: validatedValues.rv_province,
          rv_length: parseInt(validatedValues.rv_length),
          rv_breadth: parseInt(validatedValues.rv_breadth),
          rv_tonnage: parseInt(validatedValues.rv_tonnage),
        };
        router.push({
          pathname: "/registeredvessels/addownerdetail",
          query: {
            rv_data: JSON.stringify(data),
            nakwaDetails: JSON.stringify(nakwaDetails),
          },
        });
      }
    } catch (error) {
    }
  };

  // When the component mounts
  useEffect(() => {
    // Check if there is saved form data in local storage
    const savedFormData =localStorage.getItem("formData");

    if (savedFormData) {
      // Populate the form with saved data
      form.setFieldsValue(JSON.parse(savedFormData));
    }
  }, []);

  const handleBack = () => {
   localStorage.removeItem("formData");
   localStorage.removeItem("OwnerForm");
    router.back();
  };

  return (
    <StyledDiv>
      <div>
        {" "}
        <PageHeader
          showSearchBox={false}
          localStorage={handleBack}
          title="Fishing Vessel Registration"
        />
      </div>
      <div>
        <Form
          form={form}
          layout="vertical"
          className="shadow mx-5 px-3 py-10 bg-white"
          onFinish={handleSubmit}
        >
          <Row className="flex justify-center">
            <Col xs={24} sm={24} md={11} lg={11} xl={11}>
              <InputBox
                label="Platform ID"
                name="pf_id"
                className="input"
                defaultValue={pf_id}
                disabled={true}
              />
              <InputBox
                label="Vessel Name"
                name="rv_name"
                className="input"
                placeholder="The Mayflower"
                minLength={3}
                maxLength={15}
                rules={[
                  { required: true, message: "Please enter vessel name" },
                ]}
              />
              {/* <SelectBox
                label="Flag"
                name="rv_flag"
                className="input"
                placeholder="Pakistan (PK)"
                onChange={(value) => setFlag(value)}
                options={country_list.map((item) => ({
                  label: item,
                  value: item,
                }))}
                rules={[{ required: true, message: "Please select a flag" }]}
              /> */}
              <InputBox
                label="Flag"
                name="rv_flag"
                className="input"
                placeholder="Pakistan (PK)"
                rules={[{ required: true, message: "Please select a flag" }]}
              />
              <SelectBox
                label="Vessel Type"
                name="rv_type"
                className="input"
                placeholder="Select Type"
                options={type_list.map((item) => ({
                  value: item,
                  label: item,
                }))}
                rules={[
                  { required: true, message: "Please select a vessel type!" },
                ]}
              />
              <InputBox
                label="Tonnage (Gross tonnage)"
                name="rv_tonnage"
                className="input"
                placeholder="42785"
                minLength={3}
                maxLength={15}
                rules={[
                  { required: false, message: "Please enter the gross tonnage" },
                  {
                    pattern: /^\d+$/,
                    message: "Please enter a valid gross tonnage",
                  },
                ]}
              />
              <InputBox
                label="Nakwa/CO"
                placeholder="Lorem Ipsum"
                name="rvc_name"
                className="input"
                minLength={3}
                maxLength={15}
                pattern="/^[a-zA-Z0-9\s]+$/"
                rules={[
                  { required: true, message: "Please enter the Nakwa/CO" },
                  {
                    pattern: /^[a-zA-Z0-9\s]+$/,
                    message: "Please enter a valid Nakwa/CO",
                  },
                ]}
              />
              <InputBox
                label="Nakwa/CO Cell Number"
                name="rvc_cell"
                className="input"
                placeholder="+92-123-2525356"
                minLength={13}
                maxLength={15}
                pattern={/^\+?[0-9]+(-[0-9]+)*$|^[0-9]+$/}
                rules={[
                  {
                    required: false,
                    message: "Please input a valid mobile number!",
                  },
                  {
                    pattern: /^\d{11}$/,
                    message: "Please enter a valid 11-digit mobile number!",
                  },
                ]}
              />
            </Col>
            <Col xs={24} sm={24} md={11} lg={11} xl={11} className="ml-2 mr-2">
              <InputBox
                label="Vessel ID"
                className="input"
                placeholder="to be provided"
                name="rv_id"
                minLength={6}
                maxLength={12}
                pattern="/^[0-9]+$/"
                rules={[
                  {
                    required: true,
                    message: "Please input the ID Number!",
                  },
                  {
                    pattern: /^[0-9]+$/,
                    message: "ID Number can only contain numbers.",
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
              <InputBox
                label="Registration Number"
                name="rv_regno"
                placeholder="123SQU"
                className="input"
                minLength={3}
                maxLength={15}
                pattern="/^[a-zA-Z0-9]+$/"
                rules={[
                  {
                    required: true,
                    message: "Please enter the registration number",
                  },
                  {
                    pattern: /^[a-zA-Z0-9]+$/,
                    message: "Please enter a valid registration number",
                  },
                ]}
              />
              <InputBox
                label="Province"
                name="rv_province"
                className="input"
                placeholder="Enter Province"
                rules={[
                  { required: false, message: "Please select a province!" },
                ]}
              />
              {/* <SelectBox
                label="Province"
                name="rv_province"
                className="input"
                placeholder="Select Province"
                options={province[flag].map((item) => ({
                  value: item,
                  label: item,
                }))}
                rules={[
                  { required: true, message: "Please select a province!" },
                ]}
              /> */}
              <InputBox
                label="Length (meters)"
                name="rv_length"
                className="input"
                placeholder="397.71"
                minLength={3}
                maxLength={15}
                rules={[
                  {
                    required: false,
                    message: "Please enter the length in meters",
                  },
                  {
                    pattern: /^(0|[1-9]\d*)(\.\d+)?$/,
                    message: "Please enter a valid length in meters",
                  },
                ]}
              />
              <InputBox
                label="Breath (meters)"
                name="rv_breadth"
                className="input"
                placeholder="56.65"
                minLength={3}
                maxLength={15}
                rules={[
                  {
                    required: false,
                    message: "Please enter the breath in meters",
                  },
                  {
                    pattern: /^(0|[1-9]\d*)(\.\d+)?$/,
                    message: "Please enter a valid breath in meters",
                  },
                ]}
              />
              <SelectBox
                label="Nakwa/CO Nationality"
                name="rvc_nationality"
                className="input"
                placeholder="Pakistan"
                options={country_list.map((item) => ({
                  value: item,
                  label: item,
                }))}
                rules={[
                  { required: false, message: "Please select a nationality!" },
                ]}
              />
              {/* <SelectBox
                label="Nakwa/CO Ethnicity"
                name="rvc_ethnicity"
                placeholder="Select Ethnicity"
                className="input"
                options={ethnicity_list.map((item) => ({
                  value: item,
                  label: item,
                }))}
                rules={[
                  { required: true, message: "Please select ethnicity!" },
                ]} */}
              {/* /> */}
              <InputBox
                label="Nakwa/CO Ethnicity"
                name="rvc_ethnicity"
                placeholder="Enter Ethnicity"
                className="input"
                rules={[
                  { required: false, message: "Please select ethnicity!" },
                ]}
              />
            </Col>
          </Row>

          <Row className="mt-5 flex justify-center">
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={24}
              className="flex justify-end text-center mb-3 lg:text-right lg:mb-2 "
            >
              <Form.Item>
                <OutlineButton
                  text="Cancel"
                  onClick={handleBack}
                  className="rounded-full font-semibold border-gray pl-10 pr-10 bg-gray text-white ml-3 mb-3 mr-4 lg:mr-2 lg:ml-2 lg:mb-0  lg:inline-block"
                />
                <FilledButton
                  text="Next"
                  onClick={handleSubmit}
                  className="rounded-full font-semibold pl-10 pr-10 border-midnight bg-midnight text-white ml-3 mr-3 lg:mr-2 lg:ml-2 lg:mb-0  lg:inline-block  "
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </StyledDiv>
  );
}

export default RegisteredVesselData;

const StyledDiv = styled.div`
  .input {
    margin-bottom: 20px;
  }
`;
