import { Col, Row, Table, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import FilledButton from "../../src/components/button/FilledButton";
import { RxArrowLeft } from "react-icons/rx";
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
import AntdTable from "../../src/components/table/AntdTable";

function Details({ data }) {
  const [showButtons, setShowButtons] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { id, vessel } = router.query;
  const parsedVesselData = JSON.parse(vessel);
  const init_platform_data = { sr_pf_id: Cookies.get("u_pf_id") };

  const [platformData, setPlatformData] = useState(init_platform_data);
  const [platformDataEntered, setPlatformDataEntered] = useState(false);

  const [tripData, setTripData] = useState();
  const [tripDataEntered, setTripDataEntered] = useState(false);

  const [nakwaData, setNakwaData] = useState();
  const [nakwaDataEntered, setNakwaDataEntered] = useState(false);

  const [ownerData, setOwnerData] = useState([]);

  const [crewData, setCrewData] = useState([]);

  const [goodsData, setGoodsData] = useState([]);

  const vesselcolumns = [
    ...RegVesselColumn,
    {
      title: "Length (Meters)",
      dataIndex: "rv_length",
      ellipsis: true,
    },
    {
      title: "Breadth (Meters)",
      dataIndex: "rv_breadth",
      ellipsis: true,
    },
    {
      title: "Tonnage (Gross Tonnage)",
      dataIndex: "rv_tonnage",
      ellipsis: true,
    },
    {
      title: "Registered ON",
      dataIndex: "rv_rdt",
      ellipsis: true,
      render: (text, record) => {
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

const transposeData = vesselcolumns.map((column) => {
  let value = parsedVesselData[column.dataIndex];
  // Check if the value is a string and contains 'T'
  if (typeof value === "string" && value.includes("T")) {
    // Parse the value into a Date object
    const dateObj = new Date(value);
    // Extract the desired parts
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Month is zero-based, so we add 1
    const date = String(dateObj.getDate()).padStart(2, "0");
    const hour = String(dateObj.getHours()).padStart(2, "0");
    const minute = String(dateObj.getMinutes()).padStart(2, "0");
    const second = String(dateObj.getSeconds()).padStart(2, "0");
    // Construct the formatted date string
    value = `${year}-${month}-${date} ${hour}:${minute}:${second}`;
  }
  return {
    Field: column.title,
    Value: value,
  };
});


  return (
    <div>
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
          {showButtons ? (
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
              // disabled={platformData.length > 1}
              style={{ marginLeft: "auto" }}
              text="+ Add Fishing Data"
              className="rounded-full border-midnight bg-midnight text-white mr-4"
              onClick={() => setShowButtons(true)}
            />
          )}
        </Col>
      </Row>

      {/*----------------------------------- Vessel Data -------------------------------------*/}

      <div className=" flex">
        <Heading className="ml-5 " level={5} text="Vessel Data" />
      </div>
      <section className="mb-10">
        {/* <AntdTable
          scrollConfig={{ x: true }}
          columns={vesselcolumns}
          data={[parsedVesselData]}
          pagination={false}
        /> */}
        <AntdTable
          scrollConfig={{ y: "325px" }}
          pagination={false}
          columns={[
            { title: "Field", dataIndex: "Field" },
            { title: "Value", dataIndex: "Value" },
          ]}
          data={transposeData}
        />
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
        showButtons={showButtons}
      />

      {/*----------------------------------- Trip Data -------------------------------------*/}
      <FishingTripTable
        tripData={tripData}
        setTripData={setTripData}
        tripDataState={{
          tripDataEntered: tripDataEntered,
          setTripDataEntered: setTripDataEntered,
        }}
        showButtons={showButtons}
      />

      {/*----------------------------------- Nakwa Data -------------------------------------*/}

      <NakwaTable
        nakwaData={nakwaData}
        setNakwaData={setNakwaData}
        nakwaDataState={{
          nakwaDataEntered: nakwaDataEntered,
          setNakwaDataEntered: setNakwaDataEntered,
        }}
        showButtons={showButtons}
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
    </div>
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
