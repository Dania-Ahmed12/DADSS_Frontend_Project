import React from "react";
import dynamic from "next/dynamic";
import { LoadingOutlined } from "@ant-design/icons";
import FilledButton from "../../src/components/button/FilledButton.js";
import { Modal, Table } from "antd";
import { useState } from "react";
import { coordinatesToDMS } from "../../src/helper/position.js";
import SituationTable from "../../src/components/table/SituationTable.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import LostReportTable from "../../src/components/table/LostReportTable.js";
import PnscTable from "../../src/components/table/PnscReportTable.js";
import PageHeader from "../../src/components/pageheader/pageHeader.js";

dayjs.extend(utc);

const SituationUploadComponent = dynamic(
  () => import("../../src/components/button/SituationButton.js"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);
const JmisPNSCDatatUploadComponent = dynamic(
  () => import("../../src/components/button/PNSCButton.js"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);

const CosposUploadComponent = dynamic(
  () => import("../../src/components/button/CosposButton.js"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);
const JmisLostReportUploadComponent = dynamic(
  () => import("../../src/components/button/JmisLostReportButton.js"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);

function Index() {
  // State variables for modal visibility and data
  const [situationModalVisible, setSituationModalVisible] = useState(false);
  const [jmisPNSCModalVisible, setJmisPNSCModalVisible] = useState(false);
  const [jmisLostReportModalVisible, setJmisLostReportModalVisible] =
    useState(false);
  const [cosposModalVisible, setCosposModalVisible] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  // state variable fro setting up the data
  const [situationData, setSituationData] = useState([]); // Add this state variable
  const [pnscReport, setPnscReport] = useState([]);
  const [lostReport, setLostReport] = useState([]); // State to store uploaded data

  // State variables for modal type and active table
  const [type, setType] = useState(); // Add this state variable
  const [activeTable, setActiveTable] = useState(null);

  // Function to handle button clicks and set the active table
  const handleButtonClick = (tableName) => {
    setActiveTable(tableName);
  };

  // Function to open a modal based on the provided type
  const openModal = (type) => {
    //  Update the type state with the provided type
    setType(type);
    const modalMap = {
      cospos: setCosposModalVisible,
      jmisLostReport: setJmisLostReportModalVisible,
      jmisPNSC: setJmisPNSCModalVisible,
      situation: setSituationModalVisible,
    };
    // Call the appropriate visibility state setter based on the provided type
    modalMap[type](true);
  };

  // Function to close a modal based on the provided type
  const closeModal = (type) => {
    const modalMap = {
      cospos: setCosposModalVisible,
      jmisLostReport: setJmisLostReportModalVisible,
      jmisPNSC: setJmisPNSCModalVisible,
      situation: setSituationModalVisible,
    };
    modalMap[type](false);
  };

  // Function to handle loaded data and update state variables
  const onDataLoad = (loadedData, type) => {
    let updatedData = [];
    switch (type) {
      case "jmisLostReport":
        // Process and update lost report data
        updatedData = loadedData.map((item) => {
          if (item.lr_position && item.lr_position.coordinates) {
            // Destructure longitude and latitude from lr_position.coordinates
            const [longitude, latitude] = item.lr_position.coordinates;
            // Convert coordinates to DMS (Degrees, Minutes, Seconds)
            const updatedLongitude = coordinatesToDMS([longitude], 0);
            const updatedLatitude = coordinatesToDMS([latitude], 1);
            // Create updated position object with DMS coordinates
            const updatedPosition = {
              ...item.lr_position,
              dms: [updatedLongitude, updatedLatitude],
            };
            // Function to parse date fields
            // Parse the date using dayjs if the field exists, otherwise return null
            const parseDateField = (fieldName) => {
              const inputValue = item[fieldName];
              return inputValue ? dayjs(inputValue) : null;
            };
            const parsedReportingDate = parseDateField("lr_reporting_date");
            const parsedCreatedOnDate = parseDateField("lr_created_on");
            // Return the item with updated position and parsed dates
            return {
              ...item,
              lr_position: updatedPosition,
              lr_reporting_date: parsedReportingDate,
              lr_created_on: parsedCreatedOnDate,
            };
          }

          return { item };
        });
        // Set the state with the updated lost report data
        setLostReport(updatedData);
        break;
      case "jmisPNSC":
        // Process and update pnsc report data

        updatedData = loadedData.map((item) => {
          if (item.ps_position && item.ps_position.coordinates) {
            const [longitude, latitude] = item.ps_position.coordinates;

            const updatedLongitude = coordinatesToDMS([longitude], 0);
            const updatedLatitude = coordinatesToDMS([latitude], 1);
            const updatedPosition = {
              ...item.ps_position,
              dms: [updatedLongitude, updatedLatitude],
            };
            const parseDateField = (fieldName) => {
              const inputValue = item[fieldName];
              return inputValue ? dayjs(inputValue) : null;
            };

            const parsedDatetimestamp = parseDateField("ps_timestamp");
            const parsedDateAssignedTimed = parseDateField(
              "ps_status_symbol_assigned_time"
            );

            return {
              ...item,
              ps_position: updatedPosition,
              ps_timestamp: parsedDatetimestamp,
              ps_status_symbol_assigned_time: parsedDateAssignedTimed,
            };
          }

          return { item };
        });
        setPnscReport(updatedData);
        break;
      case "situation":
        // Process and update situation report data

        updatedData = loadedData.map((item) => {
          if (item.sit_position && item.sit_position.coordinates) {
            const [longitude, latitude] = item.sit_position.coordinates;

            const updatedLongitude = coordinatesToDMS([longitude], 0);
            const updatedLatitude = coordinatesToDMS([latitude], 1);
            const updatedPosition = {
              ...item.sit_position,
              dms: [updatedLongitude, updatedLatitude],
            };
            const parseDateField = (fieldName) => {
              const inputValue = item[fieldName];
              return inputValue ? dayjs(inputValue) : null;
            };
            const parsedDtg = parseDateField("sit_dtg");

            return {
              ...item,
              sit_position: updatedPosition,
              sit_dtg: parsedDtg,
            };
          }

          return { item };
        });
        setSituationData(updatedData);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div>
        <PageHeader
          placeholder="Search by Vessel ID or Vessel Name"
          showSearchBox={false}
          showButton={false} // Pass true to show the button or false to hide it
        />
      </div>
      <div className="flex justify-center flex-wrap mt-5">
        <div className="grid grid-cols-12 grid-rows-1 gap-2">
          {/*-----------------------------------Cospos Report button-------------------------------------*/}

          <div className="col-span-2 col-start-3">
            <FilledButton
              type="primary"
              onClick={() => openModal("cospos")}
              text="Cospos Data"
              className="border-midnight bg-midnight text-white m-2 "
            />
            <Modal
              title="Cospos Data"
              visible={cosposModalVisible} // Update this line
              onCancel={() => closeModal("cospos")} // Pass the correct type to closeModal
              footer={null}
              l
            >
              <CosposUploadComponent />
            </Modal>
          </div>

          {/*-----------------------------------Lost Report  button-------------------------------------*/}

          <div className="col-span-2 col-start-5">
            <FilledButton
              type="primary"
              onClick={() => {
                openModal("jmisLostReport");
                handleButtonClick("jmisLostReport");
              }}
              text="Lost Report"
              className="border-midnight bg-midnight text-white m-2 "
            />
            <Modal
              title="Lost Report"
              visible={jmisLostReportModalVisible} // Update this line
              onCancel={() => closeModal("jmisLostReport")} // Pass the correct type to closeModal
              footer={null}
              l
            >
              <JmisLostReportUploadComponent
                onDataLoad={(data) => onDataLoad(data, "jmisLostReport")}
              />
            </Modal>
          </div>

          {/*-----------------------------------PNSC Report  button-------------------------------------*/}

          <div className="col-span-2 col-start-7">
            <FilledButton
              type="primary"
              onClick={() => {
                openModal("jmisPNSC");
                handleButtonClick("jmisPNSC");
              }}
              text="PNSC Data"
              className="border-midnight bg-midnight text-white m-2 "
            />
            <Modal
              title="JMIS PNSC "
              visible={jmisPNSCModalVisible} // Update this line
              onCancel={() => closeModal("jmisPNSC")} // Pass the correct type to closeModal
              footer={null}
              l
            >
              <JmisPNSCDatatUploadComponent
                onDataLoad={(data) => onDataLoad(data, "jmisPNSC")}
              />
            </Modal>
          </div>

          {/*-----------------------------------Situation Report  button-------------------------------------*/}

          <div className="col-span-2 col-start-9">
            <FilledButton
              type="primary"
              onClick={() => {
                openModal("situation");
                handleButtonClick("situation");
              }}
              text="Situation Report"
              className="border-midnight bg-midnight text-white m-2 "
            />
            <Modal
              title="Upload Situation Report"
              visible={situationModalVisible} // Update this line
              onCancel={() => closeModal("situation")} // Pass the correct type to closeModal
              footer={null}
            >
              <SituationUploadComponent
                onDataLoad={(data) => onDataLoad(data, "situation")}
              />
            </Modal>
          </div>
        </div>
      </div>

      {/* Render the active table based on the state */}
      {activeTable === "situation" && (
        <SituationTable
          situationData={situationData}
          setSituationData={setSituationData}
        />
      )}
      {activeTable === "jmisLostReport" && (
        <LostReportTable
          lostReport={lostReport}
          setLostReport={setLostReport}
        />
      )}
      {activeTable === "jmisPNSC" && (
        <PnscTable pnscReport={pnscReport} setPnscReport={setPnscReport} />
      )}
      {activeTable === null && (
        <Table
          className="mt-5"
          dataSource={[]}
          columns={[]}
          pagination={false}
        />
      )}
    </>
  );
}

export default Index;
