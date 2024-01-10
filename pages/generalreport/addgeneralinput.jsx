import { useState } from "react";
import { Col, InputNumber, Row, message } from "antd";
import Heading from "../../src/components/title/Heading";
import { useRouter } from "next/router";
import { RxArrowLeft } from "react-icons/rx";
import styled from "styled-components";
import FilledButton from "../../src/components/button/FilledButton";
import { useForm } from "antd/lib/form/Form";
import { useDispatch, useSelector } from "react-redux";
import { saveGeneralReport } from "../../src/redux/thunks/generalReportData";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import FishingDensityTable from "../../src/components/table/FishingDensityTable";
import FishingObservedTable from "../../src/components/table/FishingObservedTable";
import OwnPlatformTable from "../../src/components/table/OwnPlatformTable";
import MerchantObservedTable from "../../src/components/table/MerchantObservedTable";
// import InputNumBox from "../";
import { Cascader, Select, Space } from "antd";
import LimitationOpsCommittment from "../../src/components/table/limitationOpsCommittment";
import ReportsLinksTable from "../../src/components/table/ReportsLinksTable";
import FreshWaterTable from "../../src/components/table/FreshWaterTable";
import SelectBox from "../../src/components/form/SelectBox";
import {
  Likeliness,
  ReaonCondition,
  TypeOfEvents,
  condition,
  patrol_type_list,
  supportLevel,
  supportRecieved,
} from "../../src/helper/dropdown";
import InputBox from "../../src/components/form/InputBox";
import ActivityLikelinessTable from "../../src/components/table/ActivityLikelinessTable";
import Head from "next/head";
import Link from "next/link";
import Miscellaneous from "../../src/components/table/miscellaneous";
const StyledInput = styled.div`
  .ant-form-item-explain-error {
    font-size: 12px;
  }
`;
const StyledDiv = styled.div`
  box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
    rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
  border-radius: 10px;
`;
const AddGeneralInput = () => {
  const [searchData, setSearchData] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();
  const init_platform_data = { gr_pf_id: Cookies.get("u_pf_id") };

  const [MerchantForm] = useForm();

  const [platformData, setPlatformData] = useState(init_platform_data);
  const [platformDataEntered, setPlatformDataEntered] = useState(false);

  const [fishingDensityData, setFishingDensityData] = useState([]);

  const [fishingObservedData, setFishingObservedData] = useState([]);

  const [merchantObservedData, setMerchantObservedData] = useState([]);

  const [limitOps, setLimitOps] = useState([]);

  const [freshWaterData, setFreshWaterData] = useState([]);

  const [activtyData, setactivtyData] = useState([]);

  const generalReportState = useSelector((state) => state.saveGeneralReport);

  /*-----------------------------------Fishing Density Data (Second Table)-------------------------------------*/


  /*-----------------------------------Owner Data (Third Table)-------------------------------------*/

  /*-----------------------------------Merchant Data (Fourth Table)-------------------------------------*/

  const handleBack = () => {
    router.back();
  };

  const handleSendGeneralReport = () => {
    if (platformDataEntered) {
      const finalData = {
        ...platformData,
        gr_dtg: platformData.gr_dtg.toISOString(),
        gr_position: {
          coordinates: platformData.gr_position.coordinates,
          type: "Point",
        },
        fishingDensities: fishingDensityData,
        fishingVesselObserved: fishingObservedData,
        merchantVesselObserved: merchantObservedData,
      };
      const newFinal = {
        data: finalData,
        navigation: router,
      };
      dispatch(saveGeneralReport(newFinal));
    } else {
      message.error("Enter Platform Data to continue");
    }
  };

  return (
    <>
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
        <Col span={17}>
          <Heading level={4} text="ADD Report" />
        </Col>
      </Row>
      <Row>
        <Col span={23} className="flex items-center justify-end mb-8">
          <FilledButton
            text="Save Report"
            loading={generalReportState.isLoading}
            // disabled={!vesselData || !merchantData}
            disabled={!platformDataEntered}
            onClick={handleSendGeneralReport}
            className="rounded-full border-lightgreen bg-lightgreen text-white"
            htmlType="submit"
          />
        </Col>
      </Row>

      {/*-----------------------------------Own Platform Data (First Table)-------------------------------------*/}

      <OwnPlatformTable
        platformData={platformData}
        setPlatformData={setPlatformData}
        init_platform_data={init_platform_data}
        showButtons={true}
        platformDataState={{
          platformDataEntered: platformDataEntered,
          setPlatformDataEntered: setPlatformDataEntered,
        }}
      />

      {/*-----------------------------------Cntinued Already Reported Activity-------------------------------------*/}
      <Row className="mb-5 mt-5">
        <Col>
          <Heading
            level={5}
            text="Continue Already Reported Activity"
            className="mr-3"
          />
        </Col>
        <Col>
          <SelectBox
            size="medium"
            placeholder="Choose"
            className="ml-3"
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" },
            ]}
          />
        </Col>
      </Row>

      {/*-----------------------------------Report Links (Second Table)-------------------------------------*/}
      {/* <ReportsLinksTable /> */}
      <Heading
        level={5}
        text="   Previous Special Reports"
        className="mb-5 mt-5"
      ></Heading>
      <StyledInput>
        <Row>
          <Col className="ml-5 mr-5">
            <Heading level={5} text=" Date Time"></Heading>
          </Col>
          <Col className="ml-5 mr-5">
            <Heading level={5} text="Links"></Heading>
          </Col>
        </Row>
        <Row className="mb-5">
          <Col className="ml-5 mr-5">
            <p>22/12/2023</p>
          </Col>
          <Col className="ml-5 mr-5">
            {/* Displaying a clickable link */}
            <a
              href="your_actual_link_here"
              target="_blank"
              style={{ color: "blue" }}
            >
              https://www.wikipedia.org/
            </a>
          </Col>
        </Row>

        <Row className="mb-5">
          <Col className="ml-5 mr-5">
            <p>22/12/2023</p>
          </Col>
          <Col className="ml-5 mr-5">
            {/* Displaying a clickable link */}
            <a
              href="your_actual_link_here"
              target="_blank"
              style={{ color: "blue" }}
            >
              https://www.wikipedia.org/
            </a>
          </Col>
        </Row>
      </StyledInput>

      {/*-----------------------------------Activity Likely (Second Table)-------------------------------------*/}
      {/* <StyledInput>
        <Row className="mb-5">
          <Col className="mr-5">
            <Heading level={5} text="Activity" />
            <SelectBox
              name="machinery defects"
              placeholder="Select Activity Type"
              options={patrol_type_list.map((item) => ({
                value: item,
                label: item,
              }))}
            />
          </Col>
          <Col>
            <Heading level={5} text="Likeliness" />
            <SelectBox
              name="machinery defects"
              placeholder="Select likeliness"
              options={Likeliness.map((item) => ({
                value: item,
                label: item,
              }))}
            />
          </Col>
        </Row>
      </StyledInput> */}
      <ActivityLikelinessTable
        activtyData={activtyData}
        setactivtyData={setactivtyData}
      />

      {/*-----------------------------------Limitation Condition  (Second Table)-------------------------------------*/}

      <StyledInput>
        <Row className="mb-5 mt-5">
          <Col className="mr-5">
            <Heading level={5} text="Limitation Condition" />
            <SelectBox
              name="machinery defects"
              placeholder="Select Activity Type"
              options={condition.map((item) => ({
                value: item,
                label: item,
              }))}
            />
          </Col>
          <Col>
            <Heading level={5} text="Likeliness" />
            <SelectBox
              name="machinery defects"
              placeholder="Select likeliness"
              options={ReaonCondition.map((item) => ({
                value: item,
                label: item,
              }))}
            />
          </Col>
        </Row>
      </StyledInput>
      {/*-----------------------------------Event Support REcieved and Level (Second Table)-------------------------------------*/}

      <StyledInput>
        <Row className="mb-5 mt-5">
          <Col className="mr-5">
            <Heading level={5} text="Types of  Event" />
            <SelectBox
              name="machinery defects"
              placeholder="Select Event Type"
              options={TypeOfEvents.map((item) => ({
                value: item,
                label: item,
              }))}
            />
          </Col>
          <Col className="mr-5">
            <Heading level={5} text="Support Recieved" />
            <SelectBox
              name="machinery defects"
              placeholder="Select Support Recieved"
              options={supportRecieved.map((item) => ({
                value: item,
                label: item,
              }))}
            />
          </Col>
          <Col className="mr-5">
            <Heading level={5} text="Support Level" />
            <SelectBox
              name="machinery defects"
              placeholder="Select Support Level"
              options={supportLevel.map((item) => ({
                value: item,
                label: item,
              }))}
            />
          </Col>
        </Row>
      </StyledInput>

      {/*-----------------------------------Add Fresh Water %(Second Table)-------------------------------------*/}
      {/* <StyledInput>
        <Row className="mb-5">
          <Col>
            <Heading level={5} text="Add Fresh Water %" />
            <InputBox
              type="number"
              style={{
                width: "100%",
              }}
              placeholder="Vessels"
              name="medical_evac"
              min={1}
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]}
            />
          </Col>
        </Row>
      </StyledInput> */}
      {/* -----------------------------------Add Fresh Water %(Second Table)------------------------------------- */}
      <FreshWaterTable
        freshWaterData={freshWaterData}
        setFreshWaterData={setFreshWaterData}
      />

      {/*-----------------------------------Limitation Affecting Ops Commitment (Second Table)-------------------------------------*/}
      <LimitationOpsCommittment limitOps={limitOps} setLimitOps={setLimitOps} />

      {/*-----------------------------------Missceallanous(Second Table)-------------------------------------*/}
      <Miscellaneous
        freshWaterData={freshWaterData}
        setFreshWaterData={setFreshWaterData}
      />

      {/*-----------------------------------Fishing Density (Second Table)-------------------------------------*/}
      <FishingDensityTable
        fishingDensityData={fishingDensityData}
        setFishingDensityData={setFishingDensityData}
      />

      {/*-----------------------------------Fishing Observed (Third Table)-------------------------------------*/}
      <FishingObservedTable
        fishingObservedData={fishingObservedData}
        setFishingObservedData={setFishingObservedData}
      />

      {/* -----------------------------------Merchant Vessel (Fourth Table)------------------------------------- */}
      <MerchantObservedTable
        merchantObservedData={merchantObservedData}
        setMerchantObservedData={setMerchantObservedData}
      />
    </>
  );
};

export default AddGeneralInput;
export async function getServerSideProps() {
  return {
    props: {
      data: {
        title: "Add General Report",
      },
    },
  };
}
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
