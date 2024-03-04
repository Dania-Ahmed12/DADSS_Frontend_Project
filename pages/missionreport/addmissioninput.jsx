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
  const init_mission_data = { mr_pf_id: localStorage.getItem("u_pf_id") };
  const [missionData, setMissionData] = useState(init_mission_data);
  const dispatch = useDispatch();
  const MissionReportState = useSelector((state) => state.saveMissionReport);
  const [missionDataEntered, setMissionDataEntered] = useState(false);
  const [missionDetail, setMissionDetail] = useState([]);
  const [showButtons, setShowButtons] = useState(false);

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
      } catch (error) {}
    } else {
    }
  };

  return (
    <>
      <PageHeader showButton={false} showSearchBox={false} title="ADD Report" />

      <Row className="items-center mb-4">
        <Col span={6}></Col>
        <Col span={18} className="flex justify-end">
          {/* {showButtons ? (
            <FilledButton
              style={{ marginLeft: "auto" }}
              text="Save Mission Data"
              className="rounded-full border-lightgreen bg-lightgreen text-white mr-4"
              loading={MissionReportState.isLoading}
              disabled={!missionDataEntered}
              onClick={handleSendMissionReport}
            />
          ) : (
            <FilledButton
              style={{ marginLeft: "auto" }}
              text="+ Add Mission Macro Data"
              className="rounded-full border-midnight bg-midnight text-white mr-4"
              onClick={() => setShowButtons(true)}
            />
          )} */}
          <FilledButton
            style={{ marginLeft: "auto" }}
            text="Save Mission Data"
            className="rounded-full border-lightgreen bg-lightgreen text-white mr-4"
            loading={MissionReportState.isLoading}
            disabled={!missionDataEntered}
            onClick={handleSendMissionReport}
          />
        </Col>
      </Row>

      {/*-----------------------------------mission macro data data  (First Table)-------------------------------------*/}
      <MissionDataTable
        missionData={missionData}
        setMissionData={setMissionData}
        init_mission_data={init_mission_data}
        showButtons={showButtons}
        MissionDataState={{
          missionDataEntered: missionDataEntered,
          setMissionDataEntered: setMissionDataEntered,
        }}
      />
      {/*-----------------------------------mission detail data (Second Table)-------------------------------------*/}
      <MissionDetailDataTable
        // showButtons={showButtons}
        showButtons={true}
        missionDetail={missionDetail}
        setMissionDetail={setMissionDetail}
      />
    </>
  );
}

export default Addmissioninput;
