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
import TableItemRenderer from "../../src/components/table/RenderTable";
import { Descriptions } from "antd";
import styled from "styled-components";



function GeneralDetails({ data }) {

  const itemss = [
    {
      key: "1",
      label: "UserName",
      children: "Zhou Maomao",
    },
    {
      key: "2",
      label: "Telephone",
      children: "1810000000",
    },
    {
      key: "3",
      label: "Live",
      children: "Hangzhou, Zhejiang",
    },
    {
      key: "4",
      label: "Remark",
      children: "empty",
    },
    {
      key: "5",
      label: "Address",
      children:
        "No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China",
    },
  ];
  const items = [
    {
      label: "Platform ID",
      children: data?.gr_pf_id || "", 
    },
    {
      label: "Date Time",
      children: dayjs(data?.gr_dtg).format("YYYY-MM-DD HH:mm:ss") || "", 
    },
    {
      label: "Latitude",
      children: decimalToDMS(data?.gr_position?.coordinates[1], 1) || "",  
    },
    {
      label: "Longitude",
      children: decimalToDMS(data?.gr_position?.coordinates[0], 0) || "",  
    },
    {
      label: "Fuel Remaining",
      children: data?.gr_fuelrem || "", 
    },
    {
      label: "Patrol Type",
      children: data?.gr_patroltype || "", 
    },
    {
      label: "Other Info",
      children: data?.gr_info || "", 
    },
  ];



  function transposeData(data) {
  if (!data || data.length < 2) return []; 

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
        transposedData.push({
          Field: "Other Info",
          Value: data.gr_info,
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
      width:250,
      dataIndex: "grd_position",
      ellipsis:false,
      render: (text, record) => {
        if (record.grd_position) {
          var val = record.grd_position.coordinates[1];
          const latitude = decimalToDMS(val, 1);
          return latitude
        }
      },
    },
    {
      title: "Longitude",
      width:250,
      dataIndex: "grd_position",
      ellipsis:false,
      render: (text, record) => {
        if (record.grd_position) {
          var val = record.grd_position.coordinates[0];
          const longitude = decimalToDMS(val, 0);
          return longitude
        }
      },
    },
    {
      title: "Number of Vessels",
      width:250,
      ellipsis:false,
      dataIndex: "grd_qty",
    },
    {
      title: "Vessel Type",
      width:250,
      ellipsis:false,
      dataIndex: "grd_type",
    },
    {
      title: "Vessel Movement",
      width:250,
      ellipsis:false,
      dataIndex: "grd_movement",
    },
  ];
  const fishingObservedColumns = [
    {
      title: "Latitude",
      width:250,
      ellipsis:false,
      dataIndex: "grf_position",
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
      width:250,
      ellipsis:false,
      dataIndex: "grf_position",
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
      width:250,
      ellipsis:false,
      dataIndex: "grf_name",
    },
    {
      title: "Type of Vessel",
      width:250,
      ellipsis:false,
      dataIndex: "grf_type",
    },
    {
      title: "Vessel Movement",
      width:250,
      ellipsis:false,
      dataIndex: "grf_movement",
    },
  ];
  const merchantObservedColumns = [
    {
      title: "Latitude",
      width:250,
      ellipsis:false,
      dataIndex: "grm_position",
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
      width:250,
      ellipsis:false,
      dataIndex: "grm_position",
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
      width:250,
      ellipsis:false,
      dataIndex: "grm_name",
    },
    {
      title: "Type of Vessel",
      width:250,
      ellipsis:false,
      dataIndex: "grm_type",
    },
    {
      title: "Vessel Movement",
      width:250,
      ellipsis:false,
      dataIndex: "grm_movement",
    },
    {
      title: "LPOC",
      width:250,
      ellipsis:false,
      dataIndex: "grm_lpoc",
    },
    {
      title: "NPOC",
      width:250,
      ellipsis:false,
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

      <div className="mt-4 flex">
        <Heading className="ml-5 " level={5} text="Vessel Data" />
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
                <Col span={14} className="flex justify-end">
                  <div className="descriptionChildren ">{item.children}</div>
                </Col>
              </Row>
              {/* </div> */}
            </Descriptions.Item>
          ))}
        </Descriptions>
      </section>

      {tableItems.map((item, index) => {
        return (
          <TableItemRenderer
            key={index}
            title={item.title}
            columns={item.columns}
            data={item.data}
            pagination={true}
            scrollConfig={{ x: true }} // Adjust x-scroll as needed
          />
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
