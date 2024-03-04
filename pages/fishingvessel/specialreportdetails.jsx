import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import PageHeader from "../../src/components/pageheader/pageHeader";
import { Table, Tooltip } from "antd";
import { MerchantDetailColumns, RegVesselColumn } from "../../src/helper/DataColumns";
import GoodsTable from "../../src/components/specialTables/GoodsTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchMerchantById } from "../../src/redux/thunks/merchantVesselData";
import TableItemRenderer from "../../src/components/table/RenderTable";
import Heading from "../../src/components/title/Heading";
import AntdTable from "../../src/components/table/AntdTable";
import { decimalToDMS } from "../../src/helper/position";
import dayjs from "dayjs";
import { fetchFishingById } from "../../src/redux/thunks/fishingVesselData";

function Specialreportdetails() {

   const router = useRouter();
   const dispatch = useDispatch();

const { sr_key } = router.query;
console.log("Router Query:", router.query);
console.log("sr_key:", sr_key);

   //   const parsedVesselData = JSON.parse( msr_key );

   const { data, isLoading, error } = useSelector(
     (state) => state.fetchFishingVessel
   );
   console.log("api data",data);
   // Fetch vessel details based on rv_key
   useEffect(() => {
     if (sr_key) {
       dispatch(fetchFishingById(sr_key));
     }
   }, [sr_key, dispatch]);
   console.log(sr_key);

   

   const nakwacolumns = [
     {
       title: "Nakwa Name",
       key: "src_name",
       width: 250,
       ellipsis: false,
       dataIndex: "src_name",
     },
     {
       key: "src_nationality",
       title: "CO Nationality",
       width: 250,
       ellipsis: false,
       dataIndex: "src_nationality",
     },
     {
       key: "src_ethnicity",
       title: "CO Ethnicity",
       width: 250,
       ellipsis: false,
       dataIndex: "src_ethnicity",
     },
     {
       key: "src_cell",
       title: "CO Cell Number",
       width: 250,
       ellipsis: false,
       dataIndex: "src_cell",
     },
   ];
   const ownercolumns = [
     {
       title: "Name",
       width: 250,
       ellipsis: false,
       key: "sro_name",
       dataIndex: "sro_name",
     },
     {
       title: "Nationality",
       key: "sro_nationality",
       width: 250,
       ellipsis: false,
       dataIndex: "sro_nationality",
     },
     {
       key: "sro_idtype",
       title: "ID Type",
       width: 250,
       ellipsis: false,
       dataIndex: "sro_idtype",
     },
     {
       key: "sro_id",
       title: "ID Number",
       width: 250,
       ellipsis: false,
       dataIndex: "sro_id",
     },
     {
       key: "sro_idexpdt",
       title: "ID Exp. Date",
       width: 250,
       ellipsis: false,
       dataIndex: "sro_idexpdt",
     },
     {
       key: "sro_ethnicity",
       title: "Ethnicity",
       width: 250,
       ellipsis: false,
       dataIndex: "sro_ethnicity",
     },
     {
       key: "sro_share",
       title: "Share (%)",
       width: 250,
       ellipsis: false,
       dataIndex: "sro_share",
     },
     {
       key: "sro_cell",
       title: "Mobile Number",
       width: 250,
       ellipsis: false,
       dataIndex: "sro_cell",
     },
   ];

    const crewcolumns = [
      {
        title: "Name",
        width: 250,
        ellipsis: false,
        key: "src_name",
        dataIndex: "src_name",
      },
      
      {
        title: "Nationality",
        key: "src_nationality",
        width: 250,
        ellipsis: false,
        dataIndex: "src_nationality",
      },
      {
        key: "src_idtype",
        title: "ID Type",
        width: 250,
        ellipsis: false,
        dataIndex: "src_idtype",
      },
      {
        key: "src_id",
        title: "ID Number",
        width: 250,
        ellipsis: false,
        dataIndex: "src_id",
      },
      {
        key: "src_idexpdt",
        title: "ID Exp. Date",
        width: 250,
        ellipsis: false,
        dataIndex: "src_idexpdt",
      },
      {
        key: "src_ethnicity",
        title: "Ethnicity",
        width: 250,
        ellipsis: false,
        dataIndex: "src_ethnicity",
      },
      {
        key: "src_cell",
        title: "Mobile Number",
        width: 250,
        ellipsis: false,
        dataIndex: "src_cell",
      },
    ];



  const GoodsData = [
    {
      title: "Item",
      key: "srg_item",
      width: 250,
      ellipsis: false,
      dataIndex: "srg_item",
    },
    {
      title: "Quantiity",
      key: "srg_qty",
      width: 250,
      ellipsis: false,
      dataIndex: "srg_qty",
    },
    {
      title: "Value",
      key: "srg_value",
      width: 250,
      ellipsis: false,
      dataIndex: "srg_value",
    },

    {
      title: "Denomination",
      key: "srg_denomination",
      width: 250,
      ellipsis: false,
      dataIndex: "srg_denomination",
    },
    {
      title: "Category",
      key: "srg_category",
      width: 250,
      ellipsis: false,
      dataIndex: "srg_category",
    },
    {
      title: "Sub-category",
      key: "srg_subcategory",
      width: 250,
      ellipsis: false,
      dataIndex: "srg_subcategory",
    },
    {
      title: "Source",
      key: "srg_source",
      width: 250,
      ellipsis: false,
      dataIndex: "srg_source",
    },
    {
      title: "Confiscated",
      key: "srg_confiscated",
      width: 250,
      ellipsis: false,
      dataIndex: "srg_confiscated",
      render: (confiscated) => (confiscated ? "Yes" : "No"),
    },
    {
      title: "Remarks",
      key: "srg_remarks",
      width: 250,
      ellipsis: false,
      dataIndex: "srg_remarks",
    },
  ];
  const TripData = [
    {
      title: "Departure Jetty ",
      key: "sr_depjetty",
      width: 250,
      ellipsis: false,
      dataIndex: "sr_depjetty",
    },
    {
      title: "Departure DTG",
      key: "sr_depdt",
      width: 250,
      ellipsis: false,
      dataIndex: "sr_depdt",
    },
    {
      title: "PC",
      key: "sr_pc",
      width: 250,
      ellipsis: false,
      dataIndex: "sr_pc",
    },

    {
      title: "PC Issue Date",
      key: "sr_pcissuedt",
      width: 250,
      ellipsis: false,
      dataIndex: "sr_pcissuedt",
    },
    {
      title: "PC Days",
      key: "sr_pcdays",
      width: 250,
      ellipsis: false,
      dataIndex: "sr_pcdays",
    },
  ];
    const PlatfromData = [
      {
        title: "Platfrom ID",
        key: "sr_pf_id",
        width: 250,
        ellipsis: false,
        dataIndex: "sr_pf_id",
      },
      {
        title: "DTG",
        key: "sr_dtg",
        width: 250,
        ellipsis: false,
        dataIndex: "sr_dtg",
        render: (text) => {
          if (!text) return "---";

          const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
          return dtg;
        },
      },
      {
        title: "Longitude",
        key: "sr_position",
        dataIndex: "sr_position",
        ellipsis: false,
        width: 250,
        render: (text, record) => {
          if (record.sr_position) {
            var val = record.sr_position.coordinates[0];
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
        title: "Latitude",
        dataIndex: "sr_position",
        key: "sr_position",
        ellipsis: false,
        width: 250,
        render: (text, record) => {
          if (record.sr_position) {
            var val = record.sr_position.coordinates[1];
            const latitude = decimalToDMS(val, 0);
            return (
              <Tooltip placement="topLeft" title={val.toFixed(4)}>
                {latitude}
              </Tooltip>
            );
          }
        },
      },
      {
        title: "Movement",
        key: "sr_movement",
        width: 250,
        ellipsis: false,
        dataIndex: "sr_movement",
      },
      {
        title: "Action",
        key: "sr_action",
        width: 250,
        ellipsis: false,
        dataIndex: "sr_action",
      },
      {
        title: "Other Info",
        key: "sr_info",
        width: 250,
        ellipsis: false,
        dataIndex: "sr_info",
      },
      {
        title: "Fuel Remaining",
        key: "sr_fuelrem",
        width: 250,
        ellipsis: false,
        dataIndex: "sr_fuelrem",
      },
      {
        title: "Patrol Type",
        key: "sr_patroltype",
        width: 250,
        ellipsis: false,
        dataIndex: "sr_patroltype",
      },
    ];
      const vesselcolumns = [
        ...RegVesselColumn,
        {
          title: "Length (meters)",
          key: "rv_length",
          width: 250,
          ellipsis: false,
          dataIndex: "rv_length",
        },
        {
          title: "Breadth  (meters)",
          key: "rv_breadth",
          width: 250,
          ellipsis: false,
          dataIndex: "rv_breadth",
        },
        {
          key: "rv_tonnage",
          title: "Gross Tonnage",
          width: 250,
          ellipsis: false,
          dataIndex: "rv_tonnage",
        },
        {
          key: "rv_rdt",
          title: "Registered ON ",
          width: 250,
          ellipsis: false,
          dataIndex: "rv_rdt",
          render: (text) => {
          if (!text) return "---";

            const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
            return dtg;
          },
        },
      ];

     const tableItems = [
       {
         title: "Own Platform Data",
         columns: PlatfromData,
         data: [data],
         pagination: false,
       },
       {
         title: "Vessel Data",
         columns: vesselcolumns,
         data: [data?.sr_rv_key],
         pagination: false,
       },
       {
         title: "Nawka Data",
         columns: nakwacolumns,
         data: data?.nakwaDetails,
         pagination: false,
       },
       {
         title: "Owner Data",
         columns: ownercolumns,
         data: data?.ownerDetails,
         pagination: false,
       },
       {
         title: "Crew Data",
         columns: crewcolumns,
         data: data?.crewDetails,
         pagination: false,
       },
       {
         title: "Trip Data",
         columns: TripData,
         data: [data?.tripDetails],
         pagination: false,
       },
       {
         title: "Goods Data",
         columns: GoodsData,
         data: data?.goodDetails,
         pagination: false,
       },
     ];
  return (
    <div>
      <PageHeader showSearchBox={false} title="Fishing Special Report Detail" />
      <div className="mt-2">
        {tableItems.map((item, index) => (
          <>
            <TableItemRenderer
              scrollConfig={{ x: true }}
              key={index}
              title={item.title}
              columns={item.columns}
              data={item.data}
              pagination={false}
            />
          </>
        ))}
      </div>
    </div>
  );
}

export default Specialreportdetails;
