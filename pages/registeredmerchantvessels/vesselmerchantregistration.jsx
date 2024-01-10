import { Col, Form, Row } from "antd";
import { useRouter } from "next/router";
import React, { useState } from "react";
import FilledButton from "../../src/components/button/FilledButton";
import OutlineButton from "../../src/components/button/OutlineButton";
import InputBox from "../../src/components/form/InputBox";
import SelectBox from "../../src/components/form/SelectBox";
import styled from "styled-components";
import { useForm } from "antd/lib/form/Form";
import countryList from "country-list";
import { saveRegistedMerchantVessel } from "../../src/redux/thunks/registerMerchantVesselDatas";
import { useSelector, useDispatch } from "react-redux";
import { aisTypeSummaryNames } from "../../src/helper/dropdown";
import Cookies from "js-cookie";
import PageHeader from "../../src/components/pageheader/pageHeader";

function RegisteredVesselData() {
  // Get the platform ID from cookies
  const pf_id = Cookies.get("u_pf_id");

  const router = useRouter();

  // Form related state and methods
  const [form] = useForm();
  const [flag, setFlag] = useState("Pakistan");
  const [countryName, setCountryName] = useState("");

  // State for managing selected category and subcategory
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  // Generate country options for the flag select box
  const countryOptions = countryList.getNames().map((country) => {
    const countryCode = countryList.getCode(country);
    const label = `${country} (${countryCode})`;
    return {
      label,
      value: countryCode, // Set the short country code as the value
    };
  });

  // Handle flag (country) change
  const handleCountryChange = (value) => {
    setCountryName(value);
  };

  // Navigation back to the previous page
  const handleBack = () => {
    router.back();
  };

  // Redux related hooks and state variables for saving registered vessel data
  const dispatch = useDispatch();
  const { data, isLoading } = useSelector(
    (state) => state.saveRegisteredMerchantVesselData
  );

  // Handle category change
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  const handleSubmit = async () => {
    try {
      const validatedValues = await form.validateFields();
      if (validatedValues) {
        // Extract and prepare data for dispatch
        const merchantData = {
          mv_mmsi: validatedValues.mv_mmsi,
          mv_call_sign: validatedValues.mv_call_sign,

          mv_width: parseFloat(validatedValues.mv_width),
          mv_ais_type_summary: validatedValues.mv_ais_type_summary,

          mv_ship_id: validatedValues.mv_ship_id,

          mv_ship_name: validatedValues.mv_ship_name,
          mv_flag: validatedValues.mv_flag,
          mv_grt: parseFloat(validatedValues.mv_grt),
          mv_year_built: validatedValues.mv_year_built,

          mv_type_name: validatedValues.mv_type_name,

          mv_imo: validatedValues.mv_imo,
          mv_ship_type: validatedValues.mv_ship_type,

          mv_length: parseFloat(validatedValues.mv_length),
          mv_dwt: parseFloat(validatedValues.mv_dwt),
        };

        // Dispatch the saveRegisteredMerchantVessel action
        let finalData = JSON.parse(JSON.stringify(merchantData));
        dispatch(saveRegistedMerchantVessel(finalData));

        // If data is successfully saved, navigate to the registered merchant vessels page
        if (data) {
          router.push({
            pathname: "/registeredmerchantvessels",
          });
        }
      }
    } catch (error) {
    
    }
  };
  return (
    <StyledDiv>
      <PageHeader showSearchBox={false} title="Vessel Registration" />
      <Form
        form={form}
        layout="vertical"
        className="shadow mx-14 px-3 py-10 bg-white"
        onFinish={handleSubmit}
      >
        <Row className="flex justify-center">
          <Col span={7} offset={1}>
            <InputBox
              label="Platform ID"
              name="pf_id"
              className="input"
              defaultValue={pf_id}
              disabled={true}
            />
            <InputBox
              label="MMSI ID"
              name="mv_mmsi"
              className="input"
              placeholder="1458963"
              maxLength={9}
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
            <InputBox
              label="Call Sign ID "
              name="mv_call_sign"
              className="input"
              placeholder="PAK123"
            />
            <InputBox
              label="Width"
              name="mv_width"
              className="input"
              placeholder="Enter the width in meters (25.3)"
              rules={[
                {
                  pattern: /^[0-9]+([.][0-9]+)?$/, // Allow numbers with an optional decimal point
                  message: "Please enter a valid number",
                },
              ]}
            />
            <SelectBox
              label="AIS Type"
              name="mv_ais_type_summary"
              className="input"
              placeholder="Select ais type "
              onChange={handleCategoryChange}
              options={aisTypeSummaryNames.map((item) => ({
                label: item.category,
                value: item.category,
              }))}
              rules={[
                { required: true, message: "Please select the ais type" },
              ]}
            />
          </Col>
          <Col span={7} offset={1}>
            <InputBox
              label="Ship ID"
              name="mv_ship_id"
              className="input"
              placeholder="123785"
              maxLength={100}
              rules={[
                { required: true, message: "Please enter ship ID" },
                {
                  pattern: /^[0-9]+$/,
                  message: "Please enter a valid number",
                },
              ]}
            />
            <InputBox
              label="Ship Name"
              name="mv_ship_name"
              className="input"
              placeholder="SPA"
              rules={[
                { required: true, message: "Please enter a ship name" },
                {
                  pattern: /^[A-Za-z\s]+$/,
                  message:
                    "Please enter a ship name with only alphabetic characters",
                },
              ]}
            />
            <SelectBox
              label="Flag"
              name="mv_flag"
              className="input"
              placeholder="Pakistan (PK)"
              value={flag}
              onChange={handleCountryChange}
              options={countryOptions}
            />
            <InputBox
              label="Tonnage (Gross tonnage)"
              name="mv_grt"
              className="input"
              placeholder="42785"
              rules={[
                {
                  pattern: /^\d+$/,
                  message: "Please enter a valid gross tonnage",
                },
              ]}
            />
            <SelectBox
              label="Type "
              name="mv_type_name"
              className="input"
              placeholder="Cargo"
              onChange={(value) => setSelectedSubcategory(value)}
              options={
                selectedCategory
                  ? aisTypeSummaryNames
                      .find((item) => item.category === selectedCategory)
                      ?.subcategories.map((subCategory) => ({
                        label: subCategory,
                        value: subCategory,
                      }))
                  : []
              }
              disabled={!selectedCategory}
              value={selectedSubcategory}
              rules={[
                { required: true, message: "Please select the  type name" },
              ]}
            />
          </Col>
          <Col span={7} offset={1}>
            <InputBox
              label="IMO ID"
              name="mv_imo"
              className="input"
              placeholder="5896784"
              maxLength={100}
              rules={[
                { required: true, message: "Please enter IMO ID" },
                {
                  pattern: /^[0-9]+$/, // Allow numbers with an optional decimal point
                  message: "Please enter a valid number",
                },
              ]}
            />
            <InputBox
              label="Ship Type"
              name="mv_ship_type"
              className="input"
              maxLength={15}
              rules={[{ required: true, message: "Please enter ship type" }]}
            />
            <InputBox
              label="Length"
              name="mv_length"
              className="input"
              placeholder="Enter the length in meters (25.4)"
              maxLength={15}
              rules={[
                {
                  pattern: /^[0-9]+([.][0-9]+)?$/, // Allow numbers with an optional decimal point
                  message: "Please enter a valid  number",
                },
              ]}
            />
            <InputBox
              label="Dead Weight"
              name="mv_dwt"
              className="input"
              placeholder="42785"
              rules={[
                {
                  pattern: /^[0-9]+([.][0-9]+)?$/, // Allow numbers with an optional decimal point
                  message: "Please enter a valid number",
                },
              ]}
            />
            <InputBox
              label="Built in year"
              name="mv_year_built"
              className="input"
              placeholder="2023"
              maxLength={4}
              rules={[
                {
                  pattern: /^\d{4}$/,
                  message: "Please enter a valid 4-digit year",
                },
              ]}
            />
          </Col>
        </Row>
        <Row className="flex justify-center">
          <Col span={23} className="flex justify-end">
            <div>
              <OutlineButton
                text="Cancel"
                onClick={handleBack}
                className="rounded-full font-semibold border-gray pl-10 pr-10 bg-gray text-white"
              />
              <FilledButton
                text="Save"
                loading={isLoading}
                onClick={handleSubmit}
                className="rounded-full font-semibold pl-10 pr-10 border-midnight bg-midnight text-white ml-3"
              />
            </div>
          </Col>
        </Row>
      </Form>
    </StyledDiv>
  );
}

export default RegisteredVesselData;

const StyledDiv = styled.div`
  .input {
    margin-bottom: 20px;
  }
`;
