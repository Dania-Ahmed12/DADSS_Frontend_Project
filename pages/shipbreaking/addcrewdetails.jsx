import { Col, Form, Row } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import FilledButton from "../../src/components/button/FilledButton";
import InputBox from "../../src/components/form/InputBox";
import styled from "styled-components";
import { useForm } from "antd/lib/form/Form";
import { saveShipBreakingReport } from "../../src/redux/thunks/shipbreakingReportData";
import { useSelector, useDispatch } from "react-redux";
import CrewTable from "../../src/components/specialTables/CrewTable";
import OutlineButton from "../../src/components/button/OutlineButton";
import PageHeader from "../../src/components/pageheader/pageHeader";

function Addcrewdetails() {
  const [form] = useForm();
  const router = useRouter();
  const [crewData, setCrewData] = useState([]);
  const [showButtons, setShowButtons] = useState(false);
  const dispatch = useDispatch();
  const { isLoading, data } = useSelector(
    (state) => state.saveShipBreakingReport
  );

  const handleBack = () => {
    router.back();
    // Store form data in sessionStorage
    sessionStorage.setItem("crewForm", JSON.stringify(form.getFieldsValue()));
    sessionStorage.setItem("crewData", JSON.stringify(crewData));
  };

  // Handler for form submission
  const handleSubmit = async () => {
    try {
      // Validate form fields
      const validatedValues = await form.validateFields();

      if (validatedValues) {
        // Parse form data
        const parsedData = {
          sb_crew: parseInt(validatedValues.sb_crew),
        };

        const { sb_data } = router.query;
        let finalData = JSON.parse(sb_data);
        // Add the parsedData directly to the sb_data object
        finalData["sb_crew"] = parsedData.sb_crew;
        // Append the crewData array to the shipbreakingcrew property
        finalData["shipbreakingcrew"] = crewData;
        // Dispatch action to save ship breaking report
        dispatch(saveShipBreakingReport(finalData));
        // Redirect to shipbreaking page on successful save
        if (data) {
          router.push({
            pathname: "/shipbreaking",
          });
        }
      }
    } catch (error) {}
  };

  useEffect(() => {
        // Retrieve stored form data from sessionStorage
    const storedData = sessionStorage.getItem("crewForm");
    const storedCrewData = sessionStorage.getItem("crewData");

    if (storedData) {
      try {
        const formData = JSON.parse(storedData);
        form.setFieldsValue(formData);
      } catch (error) {
      }
    }

    if (storedCrewData) {
      try {
        const crewData = JSON.parse(storedCrewData);
        setCrewData(crewData);
      } catch (error) {
      }
    }
  }, [form]);
  return (
    <>
      <PageHeader
        showSearchBox={false}
        title="Ship Breakage Registration/Add Crew Detail"
        sessionStorage={handleBack}
      />


      <Row className="items-center mb-4">
        <Col span={6}></Col>
        <Col span={18} className="flex justify-end">
          {showButtons ? (
            <FilledButton
              style={{ marginLeft: "auto" }}
              text="Save Data"
              className="rounded-full border-lightgreen bg-lightgreen text-white mr-4"
              loading={isLoading}
              onClick={handleSubmit}
            />
          ) : (
            <FilledButton
              style={{ marginLeft: "auto" }}
              text="+ Add Crew Data "
              className="rounded-full border-midnight bg-midnight text-white mr-4"
              onClick={() => setShowButtons(true)}
            />
          )}
        </Col>
      </Row>
      <Form
        form={form}
        layout="vertical"
        className="shadow mx-5 px-3 py-10 bg-white"
        onFinish={handleSubmit}
      >
        <Row>
          <Col className="ml-5 mb-4">
            <StyledInput>
              <InputBox
                label="Total Crew on Board"
                placeholder="4587"
                name="sb_crew"
                type="number"
                className="input"
                rules={[{ required: true, message: "Required Field!" }]}
              />
            </StyledInput>
          </Col>
        </Row>

        <StyledDiv>
          <CrewTable
            class="ant-table-row ant-table-row-level-0"
            style={{ height: "100px" }}
            reportKeys={{
              name: "sbc_name",
              nationality: "sbc_nationality",
            }}
            labelConfig="page2"
            crewData={crewData}
            setCrewData={setCrewData}
            showButtons={showButtons}
          />
        </StyledDiv>

        <Row className="flex justify-center">
          <Col span={23} className="flex justify-end">
            <div>
              <OutlineButton
                text="Cancel"
                onClick={handleBack}
                className="rounded-full font-semibold border-gray pl-10 pr-10 bg-gray text-white"
              />
          
            </div>
          </Col>
        </Row>
      </Form>
    </>
  );
}

export default Addcrewdetails;

const StyledDiv = styled.div`
  .input {
    margin-bottom: 20px;
  }
  .ant-table-tbody {
    margin-bottom: 50px;
  }
  .ant-table-row.ant-table-row-level-0 {
    /* Your additional styles for level-0 */
   height:80px
  }
`;
const StyledInput = styled.div`
  .ant-form-item-explain-error {
    font-size: 12px;
  }
`;
