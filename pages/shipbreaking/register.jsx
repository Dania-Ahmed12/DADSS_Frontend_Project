import { Col, Form, Row } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import FilledButton from "../../src/components/button/FilledButton";
import OutlineButton from "../../src/components/button/OutlineButton";
import InputBox from "../../src/components/form/InputBox";
import SelectBox from "../../src/components/form/SelectBox";
import styled from "styled-components";
import { useForm } from "antd/lib/form/Form";
import { port_list, ais_type_summary } from "../../src/helper/dropdown";
import DateBox from "../../src/components/form/DateBox";
import dayjs from "dayjs";
import { Select } from "antd";
import PageHeader from "../../src/components/pageheader/pageHeader";
import countryList from "country-list";

function Register() {
  const router = useRouter();
  const [form] = useForm();

  // State to manage the selected flag
  const [flag, setFlag] = useState("Pakistan");
  const [countryName, setCountryName] = useState("");

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

  // Handler to navigate back
  const handleBack = () => {
    router.back();
    localStorage.removeItem("shipBreakingForm");
    localStorage.removeItem("crewForm");
    localStorage.removeItem("crewData");
  };

  // Function to convert a string value to a boolean
  const convertToBoolean = (value) => {
    return value === "Yes";
  };

  // Handler for form submission
  const handleSubmit = async () => {
    try {
      // Validate form fields
      const validatedValues = await form.validateFields();

      if (validatedValues) {
        // Prepare data for the next page
        const data = {
          sb_goods_dec_doc: convertToBoolean(validatedValues.sb_goods_dec_doc),
          sb_del_cert: convertToBoolean(validatedValues.sb_del_cert),
          sb_iso_cert: convertToBoolean(validatedValues.sb_iso_cert),
          sb_ex_name: validatedValues.sb_ex_name,
          sb_emb_name: validatedValues.sb_emb_name,
          sb_locshipping_comp_name: validatedValues.sb_locshipping_comp_name,
          sb_locshipping_agent_name: validatedValues.sb_locshipping_agent_name,
          sb_locshipping_agent_num: validatedValues.sb_locshipping_agent_num,
          sb_sec_team: convertToBoolean(validatedValues.sb_sec_team),
          sb_haz_material: convertToBoolean(validatedValues.sb_haz_material),
          sb_gas_free_cert: convertToBoolean(validatedValues.sb_gas_free_cert),
          sb_waste_free_cert: convertToBoolean(
            validatedValues.sb_waste_free_cert
          ),
          sb_import_gen_manifest: convertToBoolean(
            validatedValues.sb_import_gen_manifest
          ),
          sb_lpoc: validatedValues.sb_lpoc,
          sb_mast_name: validatedValues.sb_mast_name,
          sb_mast_nationality: validatedValues.sb_mast_nationality,
          sb_buyer_comp_name: validatedValues.sb_buyer_comp_name,
          sb_buyer_comp_num: validatedValues.sb_buyer_comp_num,
          sb_owner_name: validatedValues.sb_owner_name,
          sb_owner_num: validatedValues.sb_owner_num,
          sb_flag_reg_cert: convertToBoolean(validatedValues.sb_flag_reg_cert),
          sb_crew: validatedValues.sb_crew,
          sb_imo_verified: convertToBoolean(validatedValues.sb_imo_verified),
          sb_agreement_memo: convertToBoolean(
            validatedValues.sb_agreement_memo
          ),
          sb_credit_let: convertToBoolean(validatedValues.sb_credit_let),
          sb_dtg: validatedValues.sb_dtg,
          mv_imo: validatedValues.mv_imo,
          mv_flag: validatedValues.mv_flag,
          mv_ship_name: validatedValues.mv_ship_name,
          mv_ais_type_summary: validatedValues.mv_ais_type_summary,
          sb_comm_equip_list: validatedValues.sb_comm_equip_list,
        };

        // Navigate to the next page with the prepared data
        router.push({
          pathname: "/shipbreaking/addcrewdetails",
          query: {
            sb_data: JSON.stringify(data),
          },
        });
      }
      // // Store the form data in localStorage
      localStorage.setItem(
        "shipBreakingForm",
        JSON.stringify({
          ...form.getFieldsValue(),
          sb_dtg: dayjs(form.getFieldValue("sb_dtg")).format(),
        })
      );
    } catch (error) {}
  };

  const commonRules = [
    {
      required: true,
      message: "Required Field!",
    },
  ];
  const refactoredRules = [
    {
      pattern: /^[a-zA-Z0-9\s]+$/,
      message: "Please enter a valid value",
    },
  ];

  // Effect hook to load stored form data from localtorage
  useEffect(() => {
    const storedData = localStorage.getItem("shipBreakingForm");
    if (storedData) {
      try {
        const formData = JSON.parse(storedData);
        // Parse and set the date if it exists in the form data
        if (formData.sb_dtg) {
          formData.sb_dtg = dayjs(formData.sb_dtg, "YYYY-MM-DD HH:mm:ss");
        }
        form.setFieldsValue(formData);
      } catch (error) {}
    }
  }, [form]);

  return (
    <StyledDiv>
      <PageHeader
        showSearchBox={false}
        title="Ship Breakage Registration"
        localStorage={handleBack}
      />

      <Form
        form={form}
        layout="vertical"
        className="shadow mx-5 px-3 py-10 bg-white"
        onFinish={handleSubmit}
      >
        <Row className="flex justify-center">
          <Col xs={24} sm={24} md={7} lg={7} xl={7}>
            <InputBox
              label="IMO"
              placeholder="4587"
              name="mv_imo"
              className="input"
              rules={commonRules}
            />
            <InputBox
              label="Ship Name"
              name="mv_ship_name"
              className="input"
              placeholder="The Mayflower"
              minLength={3}
              maxLength={15}
              rules={refactoredRules}
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
              label="Master"
              name="sb_mast_name"
              className="input"
              placeholder="Hassan"
              rules={refactoredRules}
            />
            <InputBox
              label="Buyer Co.Name"
              name="sb_buyer_comp_name"
              className="input"
              placeholder="Company name"
              rules={refactoredRules}
            />
            <InputBox
              label="Owner"
              name="sb_owner_name"
              className="input"
              placeholder="Owner name"
              rules={refactoredRules}
            />
            <InputBox
              label="Local Shipping Agent"
              name="sb_locshipping_agent_name"
              className="input"
              placeholder="Agent name "
              rules={refactoredRules}
            />
            <InputBox
              label="Local Shipping Co.Name"
              name="sb_locshipping_comp_name"
              className="input "
              placeholder="Shipping company name "
              rules={refactoredRules}
            />
            <SelectBox
              label="ISO  "
              className="input"
              name="sb_iso_cert"
              placeholder="Select"
              rules={commonRules}
              options={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
              ]}
            />
            <Form.Item
              label="Equipment List"
              name="sb_comm_equip_list"
              rules={commonRules}
            >
              <Select
                mode="tags"
                className="input"
                style={{
                  width: "100%",
                }}
                placeholder="Enter multiple items"
                tokenSeparators={[","]}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={7} lg={7} xl={7} className="ml-2 mr-2">
            <DateBox
              // style={{ width: "180px" }}
              label="Date Time"
              className="input w-full"
              name="sb_dtg"
              format="YYYY-MM-DD HH:mm:ss"
              showTime={{
                defaultValue: dayjs("00:00:00", "HH:mm:ss"),
              }}
            />
            <SelectBox
              label="IMO Verified"
              placeholder="IMO Verified"
              className="input"
              name="sb_imo_verified"
              rules={commonRules}
              options={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
              ]}
            />

            <SelectBox
              label="Vessel Type"
              name="mv_ais_type_summary"
              className="input"
              placeholder="Select Type"
              options={ais_type_summary.map((item) => ({
                value: item,
                label: item,
              }))}
            />
            <SelectBox
              label="LPOC"
              name="sb_lpoc"
              className="input"
              placeholder="Select"
              options={port_list.map((item) => ({
                value: item,
                label: item,
              }))}
            />
            <InputBox
              label="Master Nationality"
              name="sb_mast_nationality"
              className="input"
              placeholder="Pakistani"
            />

            <InputBox
              label="Buyer Co.Cell"
              name="sb_buyer_comp_num"
              className="input"
              placeholder="0334-2525356"
              minLength={13}
              maxLength={15}
              pattern={/^\+?[0-9]+(-[0-9]+)*$|^[0-9]+$/}
              rules={[
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

            <InputBox
              label="Owner Cell"
              name="sb_owner_num"
              className="input"
              placeholder="0334-2525356"
              minLength={13}
              maxLength={15}
              pattern={/^\+?[0-9]+(-[0-9]+)*$|^[0-9]+$/}
              rules={[
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

            <InputBox
              label="Local Shipping Agent Cell"
              name="sb_locshipping_agent_num"
              className="input"
              placeholder="0334-2525356"
              minLength={13}
              maxLength={15}
              pattern={/^\+?[0-9]+(-[0-9]+)*$|^[0-9]+$/}
              rules={[
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
            <SelectBox
              label="Deletion Certificate"
              name="sb_del_cert"
              className="input"
              placeholder="Select"
              rules={commonRules}
              options={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
              ]}
            />
            <InputBox
              label="Embossed"
              name="sb_emb_name"
              className="input"
              placeholder="to be provided"
              maxLength={25}
              rules={refactoredRules}
            />
          </Col>
          <Col xs={24} sm={24} md={7} lg={7} xl={7} className="ml-2 mr-2">
            <SelectBox
              label="Ship flag Registry "
              className="input nowrap"
              name="sb_flag_reg_cert"
              placeholder="Select"
              rules={commonRules}
              options={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
              ]}
            />

            <SelectBox
              label="Memo Agreement"
              className="input nowrap"
              name="sb_agreement_memo"
              placeholder="Select"
              rules={commonRules}
              options={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
              ]}
            />

            <SelectBox
              label="Letter Credit"
              className="input nowrap"
              name="sc_credit_let"
              placeholder="Select"
              rules={commonRules}
              options={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
              ]}
            />

            <SelectBox
              label="Security Team "
              className="input nowrap"
              name="sb_sec_team"
              placeholder="Select"
              rules={commonRules}
              options={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
              ]}
            />

            <SelectBox
              label="Hazardeous Material "
              className="input nowrap"
              name="sb_haz_material"
              placeholder="Select"
              rules={commonRules}
              options={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
              ]}
            />

            <SelectBox
              label="Gas Free  "
              className="input nowrap"
              name="sb_gas_free_cert"
              placeholder="Select"
              rules={commonRules}
              options={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
              ]}
            />

            <SelectBox
              label="Nuclear Waste Free "
              className="input nowrap"
              name="sb_waste_free_cert"
              placeholder="Select"
              rules={commonRules}
              options={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
              ]}
            />
            <SelectBox
              label="Import General Manifest"
              className="input nowrap"
              name="sb_import_gen_manifest"
              placeholder="Select"
              rules={commonRules}
              options={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
              ]}
            />
            <SelectBox
              label="Good Deceleration "
              className="input nowrap"
              name="sb_goods_dec_doc"
              placeholder="Select"
              rules={commonRules}
              options={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
              ]}
            />
            <InputBox
              label="Ex Name"
              name="sb_ex_name"
              className="input nowrap"
              placeholder="to be provided"
              maxLength={25}
              rules={refactoredRules}
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
                className=" rounded-full font-semibold border-gray pl-10 pr-10 bg-gray text-white ml-3 mb-3 mr-4 lg:mr-2 lg:ml-2 lg:mb-0  lg:inline-block"
              />
              <FilledButton
                text="Next"
                onClick={handleSubmit}
                className=" rounded-full font-semibold pl-10 pr-10 border-midnight bg-midnight text-white ml-3 mr-3 lg:mr-2 lg:ml-2 lg:mb-0  lg:inline-block  "
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </StyledDiv>
  );
}

export default Register;
const StyledDiv = styled.div`
  .input {
    margin-bottom: 20px;
  }
  .nowrap {
    white-space: nowrap !important;
  }
`;
