import { useState } from "react";
import { Col, Row, message } from "antd";
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
import LimitationOpsCommittment from "../../src/components/table/limitationOpsCommittment";
import FreshWaterTable from "../../src/components/table/FreshWaterTable";
import SelectBox from "../../src/components/form/SelectBox";
import {
  ReaonCondition,
  TypeOfEvents,
  condition,
  supportLevel,
  supportRecieved,
} from "../../src/helper/dropdown";
import ActivityLikelinessTable from "../../src/components/table/ActivityLikelinessTable";
import Miscellaneous from "../../src/components/table/miscellaneous";
import PageHeader from "../../src/components/pageheader/pageHeader";
const StyledInput = styled.div`
  .ant-form-item-explain-error {
    font-size: 12px;
  }
`;

const AddGeneralInput = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showButtons, setShowButtons] = useState(false);

  const init_platform_data = { gr_pf_id: Cookies.get("u_pf_id") };


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
      <PageHeader
        showButton={false}
        showSearchBox={false}
        title="ADD General Report"
      />

      {/* <Row>
        <Col span={23} className="flex justify-end mb-4">
          <FilledButton
            text="Save Report"
            loading={generalReportState.isLoading}
            disabled={!platformDataEntered}
            onClick={handleSendGeneralReport}
            className="rounded-full border-lightgreen bg-lightgreen text-white"
            htmlType="submit"
          />
        </Col>
      </Row> */}

      <Row className="items-center mb-4">
        <Col span={6}></Col>
        <Col span={18} className="flex justify-end">
          {showButtons ? (
            <FilledButton
              loading={generalReportState.isLoading}
              // disabled={platformData.length > 1}
              style={{ marginLeft: "auto" }}
              text="Save Report"
              className="rounded-full border-lightgreen bg-lightgreen text-white mr-4"
              onClick={handleSendGeneralReport}
              disabled={!platformDataEntered}
            />
          ) : (
            <FilledButton
              // disabled={platformData.length > 1}
              style={{ marginLeft: "auto" }}
              text="+ Add Data"
              className="rounded-full border-midnight bg-midnight text-white mr-4"
              onClick={() => setShowButtons(true)}
            />
          )}
        </Col>
      </Row>

      {/*-----------------------------------Own Platform Data (First Table)-------------------------------------*/}

      <OwnPlatformTable
        platformData={platformData}
        setPlatformData={setPlatformData}
        init_platform_data={init_platform_data}
        // showButtons={true}
        showButtons={showButtons}
        platformDataState={{
          platformDataEntered: platformDataEntered,
          setPlatformDataEntered: setPlatformDataEntered,
        }}
      />

      {/*-----------------------------------Fishing Density (Second Table)-------------------------------------*/}
      <FishingDensityTable
        fishingDensityData={fishingDensityData}
        setFishingDensityData={setFishingDensityData}
        showButtons={showButtons}
      />

      {/*-----------------------------------Fishing Observed (Third Table)-------------------------------------*/}
      <FishingObservedTable
        fishingObservedData={fishingObservedData}
        setFishingObservedData={setFishingObservedData}
        showButtons={showButtons}
      />

      {/* -----------------------------------Merchant Vessel (Fourth Table)------------------------------------- */}
      <MerchantObservedTable
        merchantObservedData={merchantObservedData}
        setMerchantObservedData={setMerchantObservedData}
        showButtons={showButtons}
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
