import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import PageHeader from "../../src/components/pageheader/pageHeader";
import { Table, Tooltip } from "antd";
import { MerchantDetailColumns } from "../../src/helper/DataColumns";
import GoodsTable from "../../src/components/specialTables/GoodsTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchMerchantById } from "../../src/redux/thunks/merchantVesselData";
import TableItemRenderer from "../../src/components/table/RenderTable";
import Heading from "../../src/components/title/Heading";
import AntdTable from "../../src/components/table/AntdTable";
import { decimalToDMS } from "../../src/helper/position";
import dayjs from "dayjs";

function Specialreportdetails() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { msr_key } = router.query;
  //   const parsedVesselData = JSON.parse( msr_key );

    const { data, isLoading, error } = useSelector(
      (state) => state.fetchMerchantVessel
    );
    console.log(data)
    // Fetch vessel details based on rv_key
    useEffect(() => {

      if (msr_key) {
        dispatch(fetchMerchantById(msr_key));
      }
    }, [msr_key, dispatch]);
  console.log(msr_key);

  const [goodsData, setGoodsData] = useState([]);

  const GoodsData = [
    {
      title: "Item",
      key: "msrg_item",
      width: 250,
      ellipsis: false,
      dataIndex: "msrg_item",
    },
    {
      title: "Quantiity",
      key: "msrg_qty",
      width: 250,
      ellipsis: false,
      dataIndex: "msrg_qty",
    },
    {
      title: "Value",
      key: "msrg_value",
      width: 250,
      ellipsis: false,
      dataIndex: "msrg_value",
    },

    {
      title: "Denomination",
      key: "msrg_denomination",
      width: 250,
      ellipsis: false,
      dataIndex: "msrg_denomination",
    },
    {
      title: "Category",
      key: "msrg_category",
      width: 250,
      ellipsis: false,
      dataIndex: "msrg_category",
    },
    {
      title: "Sub-category",
      key: "msrg_subcategory",
      width: 250,
      ellipsis: false,
      dataIndex: "msrg_subcategory",
    },
    {
      title: "Source",
      key: "msrg_source",
      width: 250,
      ellipsis: false,
      dataIndex: "msrg_source",
    },
    {
      title: "Confiscated",
      key: "msrg_confiscated",
      width: 250,
      ellipsis: false,
      dataIndex: "msrg_confiscated",
      render: (confiscated) => (confiscated ? "Yes" : "No"),
    },
    {
      title: "Remarks",
      key: "msrg_remarks",
      width: 250,
      ellipsis: false,
      dataIndex: "msrg_remarks",
    },
  ];
    const TripData = [
      {
        title: "LPOC",
        key: "msr2_lpoc",
        width: 250,
        ellipsis: false,
        dataIndex: "msr2_lpoc",
      },
      {
        title: "LPOC DTG",
        key: "msr2_lpocdtg",
        width: 250,
        ellipsis: false,
        dataIndex: "msr2_lpocdtg",
      },
      {
        title: "NPOC",
        key: "msr2_npoc",
        width: 250,
        ellipsis: false,
        dataIndex: "msr2_npoc",
      },

      {
        title: "NPOC ETA",
        key: "msr2_npoceta",
        width: 250,
        ellipsis: false,
        dataIndex: "msr2_npoceta",
      },
      
    ];
  

      const vesselcolumns = [...MerchantDetailColumns];
      const PlatfromData = [
        {
          title: "Platfrom ID",
          key: "msr_pf_id",
          width: 250,
          ellipsis: false,
          dataIndex: "msr_pf_id",
        },
        {
          title: "DTG",
          key: "msr_dtg",
          width: 250,
          ellipsis: false,
          dataIndex: "msr_dtg",
          render: (text) => {
          if (!text) return "---";

            const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
            return dtg;
          },
        },
        {
          title: "Longitude",
          key: "msr_position",
          dataIndex: "msr_position",
          ellipsis: false,
          width: 250,
          render: (text, record) => {
            if (record.msr_position) {
              var val = record.msr_position.coordinates[0];
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
          dataIndex: "msr_position",
          key: "msr_position",
          ellipsis: false,
          width: 250,
          render: (text, record) => {
            if (record.msr_position) {
              var val = record.msr_position.coordinates[1];
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
          key: "msr_movement",
          width: 250,
          ellipsis: false,
          dataIndex: "msr_movement",
        },
        {
          title: "Action",
          key: "msr_action",
          width: 250,
          ellipsis: false,
          dataIndex: "msr_action",
        },
        {
          title: "Other Info",
          key: "msr_info",
          width: 250,
          ellipsis: false,
          dataIndex: "msr_info",
        },
        {
          title: "Fuel Remaining",
          key: "msr_fuelrem",
          width: 250,
          ellipsis: false,
          dataIndex: "msr_fuelrem",
        },
        {
          title: "Patrol Type",
          key: "msr_patroltype",
          width: 250,
          ellipsis: false,
          dataIndex: "msr_patroltype",
        },
        {
          title: "",
          key: "msr2_lpoc",
          width: 250,
          ellipsis: false,
          dataIndex: "msr2_lpoc",
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
        data: [data?.msr_mv_key],
        pagination: false,
      },
      {
        title: "Goods Data",
        columns: GoodsData,
        data: data?.goodDetails,
        pagination: false,
      },
      {
        title: "Goods Data",
        columns: TripData,
        data: [data?.tripDetails],
        pagination: false,
      },
    ];
    console.log(TableItemRenderer)
  return (
    <div>
      <PageHeader showSearchBox={false} title="Merchant Special Report Detail" />

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
