import { Col, DatePicker, Input, Pagination, Row, Select, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { RxArrowLeft } from "react-icons/rx";
import Heading from "../../src/components/title/Heading";
import AntdTable from "../../src/components/table/AntdTable";
import { useRouter } from "next/router";
import { decimalToDMS } from "../../src/helper/position";
import axios from "axios";
import dayjs from "dayjs";
import { GeneralReportColumn } from "../../src/helper/DataColumns";
import PageHeader from "../../src/components/pageheader/pageHeader";

function GeneralDetails({ data }) {
  console.log(data);
  const router = useRouter();
  const vesselcolumns = [
    ...GeneralReportColumn,
    {
      title: "Other Info",
      dataIndex: "gr_info",
    },
  ];

  function transposeData(data) {
    if (!data) return [];

    const transposedData = [];
    transposedData.push({
      Field: "Platform ID",
      Value: data.gr_pf_id,
    });
    transposedData.push({
      Field: "Date Time",
      Value: dayjs(data.gr_dtg).format("YYYY-MM-DD HH:mm:ss"),
    });

    const longitude = data.gr_position.coordinates[0];
    const formattedLongitude = decimalToDMS(longitude, 0);
    transposedData.push({
      Field: "Latitude",
      Value: formattedLongitude,
    });
    const latitude = data.gr_position.coordinates[1];
    const formattedLatitude = decimalToDMS(latitude, 1);
    transposedData.push({
      Field: "Latitude",
      Value: formattedLatitude,
    });

    transposedData.push({
      Field: "Fuel Remaining ",
      Value: data.gr_fuelrem,
    });

    transposedData.push({
      Field: "Patrol Type",
      Value: data.gr_patroltype,
    });

    return transposedData;
  }

  // Prepare transposed data
  const transposedData = transposeData(data);

  // Define columns for transposed data table
  const transposedColumns = [
    { title: "Data", dataIndex: "Field" },
    { title: "Value", dataIndex: "Value" },
  ];
  const fishingColumns = [
    {
      title: "Latitude",
      dataIndex: "grd_position",
      ellipsis: {
        showTitle: false,
      },
      render: (text, record) => {
        if (record.grd_position) {
          var val = record.grd_position.coordinates[1];
          const latitude = decimalToDMS(val, 1);
          return (
            <Tooltip placement="topLeft" title={val.toFixed(4)}>
              {latitude}
            </Tooltip>
          );
        }
      },
    },
    {
      title: "Longitude",
      dataIndex: "grd_position",
      ellipsis: {
        showTitle: false,
      },
      render: (text, record) => {
        if (record.grd_position) {
          var val = record.grd_position.coordinates[0];
          const longitude = decimalToDMS(val, 0);
          return (
            <Tooltip placement="topLeft" title={val.toFixed(4)}>
              {longitude}
            </Tooltip>
          );
        }
      },
    },
    {
      title: "Number of Vessels",
      dataIndex: "grd_qty",
    },
    {
      title: "Vessel Type",
      dataIndex: "grd_type",
    },
    {
      title: "Vessel Movement",
      dataIndex: "grd_movement",
    },
  ];
  const fishingObservedColumns = [
    {
      title: "Latitude",
      dataIndex: "grf_position",
      ellipsis: {
        showTitle: false,
      },
      render: (text, record) => {
        if (record.grf_position) {
          var val = record.grf_position.coordinates[1];
          const latitude = decimalToDMS(val, 1);
          return (
            <Tooltip placement="topLeft" title={val.toFixed(4)}>
              {latitude}
            </Tooltip>
          );
        }
      },
    },
    {
      title: "Longitude",
      dataIndex: "grf_position",
      ellipsis: {
        showTitle: false,
      },
      render: (text, record) => {
        if (record.grf_position) {
          var val = record.grf_position.coordinates[0];
          const longitude = decimalToDMS(val, 0);
          return (
            <Tooltip placement="topLeft" title={val.toFixed(4)}>
              {longitude}
            </Tooltip>
          );
        }
      },
    },
    {
      title: "Vessel Name",
      dataIndex: "grf_name",
    },
    {
      title: "Type of Vessel",
      dataIndex: "grf_type",
    },
    {
      title: "Vessel Movement",
      dataIndex: "grf_movement",
    },
  ];
  const merchantObservedColumns = [
    {
      title: "Latitude",
      dataIndex: "grm_position",
      ellipsis: {
        showTitle: false,
      },
      render: (text, record) => {
        if (record.grm_position) {
          var val = record.grm_position.coordinates[1];
          const latitude = decimalToDMS(val, 1);
          return (
            <Tooltip placement="topLeft" title={val.toFixed(4)}>
              {latitude}
            </Tooltip>
          );
        }
      },
    },
    {
      title: "Longitude",
      dataIndex: "grm_position",
      ellipsis: {
        showTitle: false,
      },
      render: (text, record) => {
        if (record.grm_position) {
          var val = record.grm_position.coordinates[0];
          const longitude = decimalToDMS(val, 0);
          return (
            <Tooltip placement="topLeft" title={val.toFixed(4)}>
              {longitude}
            </Tooltip>
          );
        }
      },
    },
    {
      title: "Vessel Name",
      dataIndex: "grm_name",
    },
    {
      title: "Type of Vessel",
      dataIndex: "grm_type",
    },
    {
      title: "Vessel Movement",
      dataIndex: "grm_movement",
    },
    {
      title: "LPOC",
      dataIndex: "grm_lpoc",
    },
    {
      title: "NPOC",
      dataIndex: "grm_npoc",
    },
  ];
  const tableItems = [
    {
      title: "Fishing Densities",
      columns: fishingColumns,
      data: data?.fishingDensities,
    },
    {
      title: "Fishing Vessels Observed",
      columns: fishingObservedColumns,
      data: data?.fishingVesselObserved,
    },
    {
      title: "Merchant Vessels Observed",
      columns: merchantObservedColumns,
      data: data?.merchantVesselObserved,
    },
  ];

  return (
    <>
      <PageHeader
        showButton={false}
        showSearchBox={false}
        title="ADD General Report"
      />
      {/* <div className="flex items-center mt-14">
        <RxArrowLeft
          cursor={"pointer"}
          onClick={() => router.back()}
          className="ml-12"
          fontSize={25}
        />
        <span
          className=" ml-2 text-sm font-medium"
          style={{ cursor: "pointer" }}
        >
          Back
        </span>
      </div>

      <div className="mx-12 mb-8 mt-4">
        <Heading level={4} text="Report Details" />
      </div> */}
      {/* <Row className="mb-8 flex items-center justify-end"></Row>
      <header className="flex">
        <Heading level={4} text="Vessel Data" />
      </header> */}
      <div className="mt-4 flex">
        <Heading className="ml-5 " level={5} text="Vessel Data" />
      </div>
      <section className="mb-10">
        {/* <AntdTable
          scrollConfig={{ x: true }} // Set the scroll property as per your requirements
          columns={vesselcolumns}
          data={[data]}
          pagination={false}
        /> */}
        <AntdTable
          scrollConfig={{ x: true }} // Set the scroll property as per your requirements
          // scrollConfig={{ y: "325px" }}
          columns={transposedColumns}
          data={transposedData} // Remove the square brackets
          pagination={false}
        />
      </section>
      {tableItems.map((item, index) => {
        return (
          <div key={index}>
            <header className="flex">
              <Heading level={4} text={item.title} />
            </header>
            <div className="mb-12">
              <AntdTable columns={item.columns} data={item.data} />
            </div>
          </div>
        );
      })}
    </>
  );
}

export default GeneralDetails;
export async function getServerSideProps(context) {
  const { id } = context.query;
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/greport/${id}`
    );
    if (response.status === 200) {
      return {
        props: {
          data: response.data,
          title: `General Report Details (${id})`,
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
