import { React, useState } from "react";
import FilledButton from "../../src/components/button/FilledButton";
import { Col, Row } from "antd";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { LoadingOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { saveMissionReport } from "../../src/redux/thunks/missionReportData";
import PageHeader from "../../src/components/pageheader/pageHeader";

const MissionDataTable = dynamic(
  () => import("../../src/components/table/MacroMissionDataTable"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);

const MissionDetailDataTable = dynamic(
  () => import("../../src/components/table/MissionDetailDataTable"),
  {
    ssr: false,
  }
);

function Addmissioninput() {
  const router = useRouter();
  const init_mission_data = { mr_pf_id: Cookies.get("u_pf_id") };
  const [missionData, setMissionData] = useState(init_mission_data);
  const dispatch = useDispatch();
  const MissionReportState = useSelector((state) => state.saveMissionReport);
  const [missionDataEntered, setMissionDataEntered] = useState(false);
  const [missionDetail, setMissionDetail] = useState([]);

  // Function to handle saving mission report
  const handleSendMissionReport = async () => {
    if (missionDataEntered) {
      try {
        // Combine mission data and details
        const finalData = {
          ...missionData,
          missionreportdetails: missionDetail,
        };

        // Create payload for dispatching
        const newFinal = {
          data: finalData,
          navigation: router,
        };

         dispatch(saveMissionReport(newFinal));
      } catch (error) {
      }
    } else {
    }
  };

  return (
    <>
      <PageHeader showButton={false} showSearchBox={false} title="ADD Report" />
      <Row>
        <Col span={23} className="flex items-center justify-end mb-8">
          <FilledButton
            text="Save Report"
            loading={MissionReportState.isLoading}
            disabled={!missionDataEntered}
            onClick={handleSendMissionReport}
            className="rounded-full border-lightgreen bg-lightgreen text-white"
            htmlType="submit"
          />
        </Col>
      </Row>
      {/*-----------------------------------mission macro data data  (First Table)-------------------------------------*/}
      <MissionDataTable
        missionData={missionData}
        setMissionData={setMissionData}
        init_mission_data={init_mission_data}
        MissionDataState={{
          missionDataEntered: missionDataEntered,
          setMissionDataEntered: setMissionDataEntered,
        }}
      />
      {/*-----------------------------------mission detail data (Second Table)-------------------------------------*/}
      <MissionDetailDataTable
        missionDetail={missionDetail}
        setMissionDetail={setMissionDetail}
      />
    </>
  );
}

export default Addmissioninput;

