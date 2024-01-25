import { Col, Row, Table } from "antd";
import React, { useEffect, useState } from "react";
import FilledButton from "../../src/components/button/FilledButton";
import Heading from "../../src/components/title/Heading";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { saveMerchantVessel } from "../../src/redux/thunks/merchantVesselData";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import OwnPlatformTable from "../../src/components/table/OwnPlatformTable";
import Cookies from "js-cookie";
import MerchantTripTable from "../../src/components/merchantSpecialTable/merchantTripTable";
import axios from "axios";
import { MerchantDetailColumns } from "../../src/helper/DataColumns";
import GoodsTable from "../../src/components/specialTables/GoodsTable";
import PageHeader from "../../src/components/pageheader/pageHeader";
import AntdTable from "../../src/components/table/AntdTable";

function Details({ data }) {
  const [showButtons, setShowButtons] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { id, vessel } = router.query;
  const parsedVesselData = JSON.parse(vessel);
  console.log(vessel);
  const init_platform_data = { msr_pf_id: Cookies.get("u_pf_id") };
  const [platformData, setPlatformData] = useState(init_platform_data);
  const [platformDataEntered, setPlatformDataEntered] = useState(false);
  const [tripData, setTripData] = useState();
  const [tripDataEntered, setTripDataEntered] = useState(false);
  const [goodsData, setGoodsData] = useState([]);

  // Table columns for displaying merchant vessel details
  const vesselcolumns = [...MerchantDetailColumns];

  // Transpose the data
  const transposeData = vesselcolumns.map((column) => ({
    Field: column.title,
    Value: parsedVesselData[column.dataIndex],
  }));

  // Function to handle saving merchant report
  const handleMerchantSave = () => {
    const finalData = {
      //platform data
      ...platformData,
      msr_mv_key: id,
      msr_movement: tripData.msr_movement,
      //The toISOString() method is then called on the msr_dtg object to convert it into a string in the ISO 8601 format.
      msr_dtg: platformData.msr_dtg.toISOString(),
      msr_position: {
        coordinates: platformData.msr_position.coordinates,
        type: "Point",
      },

      //good details data
      goodDetails: goodsData.map((item) => ({
        ...item,
        // If msrg_confiscated is equal to the string "Yes," it sets msrg_confiscated to true; otherwise, it sets it to false.
        msrg_confiscated: item.msrg_confiscated === "Yes" ? true : false,
      })),

      //trip details data
      tripDetails: {
        msr2_lpoc: tripData.msr2_lpoc,
        msr2_lpocdtg: dayjs(tripData.msr2_lpocdtg).format("YYYY-MM-DD"),
        msr2_npoc: tripData.msr2_npoc,
        msr2_npoceta: dayjs(tripData.msr2_npoceta).format("YYYY-MM-DD"),
      },
    };

    // Dispatching the saveMerchantVessel action
    const newFinal = {
      data: finalData,
      navigation: router,
    };
    dispatch(saveMerchantVessel(newFinal));

    // Redirect to the merchantvessel page after saving
    if (data) {
      router.push({
        pathname: "/merchantvessel",
      });
    }
  };

  useEffect(() => {
    processTripDetails();
    processGoodDetails();
  }, []);

  const processTripDetails = () => {
    //   // Process tripDetails if it exists and has not been processed before
    if (data?.tripDetails && !tripDataEntered) {
      //     // Update tripData state with spread properties of data.tripDetails
      setTripData({
        ...data.tripDetails,
        //       // Additional modifications to specific properties using dayjs
        msr_movement: data.msr_movement,
        msr2_lpocdtg: dayjs(data.tripDetails.msr2_lpocdtg),
        msr2_npoceta: dayjs(data.tripDetails.msr2_npoceta),
      });
      setTripDataEntered(true);
    }
  };

  const processGoodDetails = () => {
    //   // Process goodDetails if it exists
    if (data?.goodDetails) {
      //     // Update goodsData state by mapping over each item and modifying msrg_confiscated
      setGoodsData(
        data.goodDetails.map((item) => ({
          ...item,
          //   If item is equal to the string "Yes," it sets msrg_confiscated to true; otherwise, it sets it to false.
          msrg_confiscated: item.msrg_confiscated ? "Yes" : "No",
        }))
      );
    }
  };

  return (
    <div>
      <PageHeader showSearchBox={false} title="Merchant Vessels Details" />
      <Row className="items-center mb-4">
        <Col span={6}></Col>
        <Col span={18} className="flex justify-end">
          {/*
  Conditional rendering using the ternary operator:
  If 'showButtons' is true, render the "Save Merchant Report" button.
  If 'showButtons' is false, render the "Add Merchant Data" button.
*/}
          {showButtons ? (
            <FilledButton
              // disabled={platformData.length > 1}
              style={{ marginLeft: "auto" }}
              text="Save Merchant Data"
              className="rounded-full border-lightgreen bg-lightgreen text-white mr-4"
              onClick={handleMerchantSave}
              disabled={!(platformDataEntered && tripDataEntered)}
            />
          ) : (
            <FilledButton
              // disabled={platformData.length > 1}
              style={{ marginLeft: "auto" }}
              text="+ Add Merchant Data"
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
          showHeader={true}
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
        report_key={"msr"}
        platformDataState={{
          platformDataEntered: platformDataEntered,
          setPlatformDataEntered: setPlatformDataEntered,
        }}
        reportKeys={{
          dtg: "msr_dtg",
          pf_id: "msr_pf_id",
          position: "msr_position",
          fuel: "msr_fuelrem",
          info: "msr_info",
          patrolType: "msr_patroltype",
          action: "msr_action",
        }}
        showButtons={showButtons}
      />

      {/*----------------------------------- Trip Data -------------------------------------*/}
      <MerchantTripTable
        tripData={tripData}
        setTripData={setTripData}
        tripDataState={{
          tripDataEntered: tripDataEntered,
          setTripDataEntered: setTripDataEntered,
        }}
        showButtons={showButtons}
      />

      {/*----------------------------------- Good Detail Data -------------------------------------*/}

      <GoodsTable
        goodsData={goodsData}
        setGoodsData={setGoodsData}
        showButtons={showButtons}
        reportKeys={{
          item: "msrg_item",
          qty: "msrg_qty",
          denomination: "msrg_denomination",
          category: "msrg_category",
          subcategory: "msrg_subcategory",
          confiscated: "msrg_confiscated",
          value: "msrg_value",
          source: "msrg_source",
        }}
      />
    </div>
  );
}

export default Details;

export async function getServerSideProps(context) {
  // a special Next.js function that is used to fetch data for server-side rendering.
  // The line const { id } = context.query; is extracting the id parameter from the context.query object. In Next.js
  // , when you define a dynamic route like [id].js or [slug].js,
  //  the values inside the square brackets become parameters that can be accessed through the context.query object.
  const { id } = context.query;

  try {
    // Fetching data from the backend API based on the 'id' parameter
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/merchant/mv_key/${id}`
    );

    if (response.status === 200) {
      return {
        props: {
          data: response.data,
          title: `Merchant Vessel Details ${id}`,
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
