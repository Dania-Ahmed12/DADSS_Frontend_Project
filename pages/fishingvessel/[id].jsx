import { Col, Descriptions, Row } from "antd";
import React, { useEffect, useState } from "react";
import FilledButton from "../../src/components/button/FilledButton";
import Heading from "../../src/components/title/Heading";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { saveFishingVessel } from "../../src/redux/thunks/fishingVesselData";
import dayjs from "dayjs";
import NakwaTable from "../../src/components/specialTables/NakwaTable";
import OwnPlatformTable from "../../src/components/table/OwnPlatformTable";
import Cookies from "js-cookie";
import FishingTripTable from "../../src/components/specialTables/FishingTripTable";
import OwnerTable from "../../src/components/specialTables/OwnerTable";
import CrewTable from "../../src/components/specialTables/CrewTable";
import GoodsTable from "../../src/components/specialTables/GoodsTable";
import axios from "axios";
import { RegVesselColumn } from "../../src/helper/DataColumns";
import PageHeader from "../../src/components/pageheader/pageHeader";

function Details({ data }) {
  console.log(data);
  const [showButtons, setShowButtons] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { id, vessel } = router.query;
  const parsedVesselData = JSON.parse(vessel);
  const init_platform_data = { sr_pf_id: localStorage.getItem("u_pf_id") };

  const [platformData, setPlatformData] = useState(init_platform_data);
  const [platformDataEntered, setPlatformDataEntered] = useState(false);

  const [tripData, setTripData] = useState();
  const [tripDataEntered, setTripDataEntered] = useState(false);

  const [nakwaData, setNakwaData] = useState([]);
  const [nakwaDataEntered, setNakwaDataEntered] = useState(false);

  const [ownerData, setOwnerData] = useState([]);

  const [crewData, setCrewData] = useState([]);

  const [goodsData, setGoodsData] = useState([]);

  const vesselcolumns = [
    ...RegVesselColumn,
    {
      key: "rv_length",
      title: "Length (Meters)",
      dataIndex: "rv_length",
      ellipsis: false,
      width: 250,
    },
    {
      key: "rv_breadth",
      title: "Breadth (Meters)",
      dataIndex: "rv_breadth",
      ellipsis: false,
      width: 250,
    },
    {
      key: "rv_tonnage",
      title: "Gross Tonnage",
      dataIndex: "rv_tonnage",
      ellipsis: false,
      width: 250,
    },
    {
      key: "rv_rdt",
      title: "Registered ON",
      dataIndex: "rv_rdt",
      ellipsis: false,
      width: 250,
      render: (text, record) => {
          if (!text) return "---";

        const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
        return dtg;
      },
    },
  ];

  const handleFishingSave = () => {
    const finalData = {
      ...platformData,
      sr_rv_key: id,
      sr_movement: tripData.sr_movement,
      sr_dtg: platformData.sr_dtg.toISOString(),
      sr_position: {
        coordinates: platformData.sr_position.coordinates,
        type: "Point",
      },
      nakwaDetails: [nakwaData],
      goodDetails: goodsData.map((item) => ({
        ...item,
        srg_confiscated: item.srg_confiscated === "Yes" ? true : false,
      })),
      ownerDetails: ownerData.map((item) => ({
        ...item,
        sro_idexpdt: dayjs(item.sro_idexpdt).format("YYYY-MM-DD"),
      })),
      crewDetails: crewData.map((item) => ({
        ...item,
        src_idexpdt: dayjs(item.src_idexpdt).format("YYYY-MM-DD"),
      })),
      tripDetails: {
        sr_depdt: dayjs(tripData.sr_depdt).format("YYYY-MM-DD"),
        sr_depjetty: tripData.sr_depjetty,
        sr_pc: tripData.sr_pc,
        sr_pcdays: tripData.sr_pcdays,
        sr_pcissuedt: dayjs(tripData.sr_pcissuedt).format("YYYY-MM-DD"),
      },
    };

    const newFinal = {
      data: finalData,
      navigation: router,
    };
    dispatch(saveFishingVessel(newFinal));
    if (data) {
      router.push({
        pathname: "/fishingvessel",
      });
    }
  };
  useEffect(() => {
    if (data?.tripDetails) {
      setTripData({
        ...data.tripDetails,
        sr_movement: data.sr_movement,
        sr_depdt: dayjs(data.tripDetails.sr_depdt),
        sr_pcissuedt: dayjs(data.tripDetails.sr_pcissuedt),
      });
      setTripDataEntered(true);
    }

    if (data?.nakwaDetails) {
      setNakwaData(data.nakwaDetails[0]);
      setNakwaDataEntered(true);
    }
    if (data?.ownerDetails) {
      setOwnerData(
        data.ownerDetails.map((item) => ({
          ...item,
          sro_idexpdt: dayjs(item.sro_idexpdt),
        }))
      );
    }
    if (data?.crewDetails) {
      setCrewData(
        data.crewDetails.map((item) => ({
          ...item,
          src_idexpdt: dayjs(item.src_idexpdt),
        }))
      );
    }
    if (data?.goodDetails) {
      setGoodsData(
        data.goodDetails.map((item) => ({
          ...item,
          srg_confiscated: item.srg_confiscated ? "Yes" : "No",
        }))
      );
    }
  }, []);

  // Map vesselcolumns to extract label and children
  const items = vesselcolumns.map((column) => ({
    label: column.title,
    children:
      column.dataIndex === "rv_rdt" // Check if the current label is "Registered ON"
        ? dayjs(parsedVesselData[column.dataIndex]).format(
            "YYYY-MM-DD HH:mm:ss"
          ) // Format the date if it's "Registered ON"
        : parsedVesselData[column.dataIndex], // Otherwise, use the value as it is
  }));

  return (
    <>
      <div>
        <PageHeader
          title="Fishing Vessels Details"
          placeholder="Search by Vessel ID/Name or Reg No"
          showButton={false} // Pass true to show the button or false to hide it
          showSearchBox={false}
        />
      </div>
      <Row className="items-center mb-4">
        <Col span={6}></Col>
        <Col span={18} className="flex justify-end">
          {/* {showButtons ? (
            <FilledButton
              // disabled={platformData.length > 1}
              style={{ marginLeft: "auto" }}
              text="Save Fishing Data"
              className="rounded-full border-lightgreen bg-lightgreen text-white mr-4"
              onClick={handleFishingSave}
              disabled={!(platformDataEntered && tripDataEntered)}
            />
          ) : (
            <FilledButton
              style={{ marginLeft: "auto" }}
              text="+ Add Fishing Data"
              className="rounded-full border-midnight bg-midnight text-white mr-4"
              onClick={() => setShowButtons(true)}
            />
          )} */}
          <FilledButton
            // disabled={platformData.length > 1}
            style={{ marginLeft: "auto" }}
            text="Save Fishing Data"
            className="rounded-full border-lightgreen bg-lightgreen text-white mr-4"
            onClick={handleFishingSave}
            disabled={!(platformDataEntered && tripDataEntered)}
          />
        </Col>
      </Row>

      {/*----------------------------------- Vessel Data -------------------------------------*/}

      <div className=" flex">
        <Heading
          className="whitespace-nowrap ml-5 "
          level={5}
          text="Vessel Data"
        />
      </div>
      <section className="mb-10">
        {/* <Descriptions
          size="middle"
          className="mt-5 ml-4 mr-4 descriptionTable"
          bordered={true}
          column={{ xs: 1, sm: 2, md: 3, lg: 3 }}
        >
          {items.map((item, index) => (
            <Descriptions.Item key={index} label={item.label}>
              {item.children}
            </Descriptions.Item>
          ))}
        </Descriptions> */}
        <Descriptions
          size="small"
          className="p-2"
          bordered={true}
          colon={true}
          borderColor="transparent"
          column={{ xs: 1, sm: 2, md: 2, lg: 3 }}
        >
          {items.map((item, index) => (
            <Descriptions.Item
              key={index}
              className="flex-container justify-between "
              span={index === items.length - 1 ? 1 : undefined}
            >
              <Row className="flex">
                <Col span={10} className="flex justify-start ">
                  <div className="descriptionLabel ">{item.label}</div>
                </Col>
                <Col
                  span={14}
                  className="flex justify-end"
                  style={{
                    marginLeft: "-15px",
                  }}
                >
                  <div className="descriptionChildren mr-5 ">
                    {item.children}
                  </div>
                </Col>
              </Row>
              {/* </div> */}
            </Descriptions.Item>
          ))}
        </Descriptions>
      </section>

      {/*----------------------------------- Platform Data -------------------------------------*/}

      <OwnPlatformTable
        platformData={platformData}
        setPlatformData={setPlatformData}
        init_platform_data={init_platform_data}
        report_key={"sr"}
        platformDataState={{
          platformDataEntered: platformDataEntered,
          setPlatformDataEntered: setPlatformDataEntered,
        }}
        reportKeys={{
          dtg: "sr_dtg",
          pf_id: "sr_pf_id",
          position: "sr_position",
          fuel: "sr_fuelrem",
          info: "sr_info",
          patrolType: "sr_patroltype",
          action: "sr_action",
        }}
        // showButtons={showButtons}
      />

      {/*----------------------------------- Trip Data -------------------------------------*/}
      <FishingTripTable
        tripData={tripData}
        setTripData={setTripData}
        tripDataState={{
          tripDataEntered: tripDataEntered,
          setTripDataEntered: setTripDataEntered,
        }}
        // showButtons={showButtons}
      />

      {/*----------------------------------- Nakwa Data -------------------------------------*/}

      <NakwaTable
        nakwaData={nakwaData}
        setNakwaData={setNakwaData}
        nakwaDataState={{
          nakwaDataEntered: nakwaDataEntered,
          setNakwaDataEntered: setNakwaDataEntered,
        }}
        // showButtons={showButtons}
      />

      {/*----------------------------------- Owner Data -------------------------------------*/}

      <OwnerTable
        ownerData={ownerData}
        setOwnerData={setOwnerData}
        showButtons={showButtons}
      />

      {/*----------------------------------- Crew Data -------------------------------------*/}

      <CrewTable
        crewData={crewData}
        setCrewData={setCrewData}
        showButtons={showButtons}
        labelConfig="page1"
      />

      {/*----------------------------------- Goods Data -------------------------------------*/}

      <GoodsTable
        goodsData={goodsData}
        setGoodsData={setGoodsData}
        showButtons={showButtons}
      />
    </>
  );
}

export default Details;
export async function getServerSideProps(context) {
  const { id } = context.query;

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/fishing/rvkey/${id}`
    );

    if (response.status === 200) {
      return {
        props: {
          data: response.data,
          title: `Fishing Vessel Details`,
        },
      };
    }
  } catch {
    return {
      redirect: {
        permanent: false,
        destination: "/404",
      },
      props: {},
    };
  }
}
