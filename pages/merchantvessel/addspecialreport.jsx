import React, { useEffect, useState } from "react";
import AntdTable from "../../src/components/table/AntdTable";
import { Button, InputNumber, Select, Tooltip } from "antd";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { fetchRegisteredMerchantVessel } from "../../src/redux/thunks/registerMerchantVesselDatas";
import { MerVesselColumn } from "../../src/helper/DataColumns";
import PageHeader from "../../src/components/pageheader/pageHeader";
import ReactDragListView from "react-drag-listview"; // Import ReactDragListView
import { Checkbox } from "antd";

function SpecialMerchantReport() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [searchData, setSearchData] = useState("");
  const { data, isLoading } = useSelector(
    (state) => state.fetchRegisteredMerchantVesselData
  );

  const columns = [
    {
      title: "MMSI",
      key: "mv_mmsi",
      dataIndex: "mv_mmsi",
      width: 250,
      ellipsis: false,
      
    },
    {
      title: "IMO",
      key: "mv_imo",
      dataIndex: "mv_imo",
      width: 250,
      ellipsis: false,

    },
    {
      title: "Ship ID",
      width: 250,
      ellipsis: false,
      dataIndex: "mv_ship_id",
      key: "mv_ship_id",

    },
    {
      title: "Ship Name",
      width: 250,
      ellipsis: false,
      key: "mv_ship_name",
      dataIndex: "mv_ship_name",
     
    },
    {
      title: "Flag",
      dataIndex: "mv_flag",
      width: 250,
      ellipsis: false,
      key: "mv_flag",

    },
    {
      title: "Type",
      dataIndex: "mv_type_name",
      width: 250,
      ellipsis: false,
      key: "mv_type_name",

    },
    {
      title: "AIS Type",
      key: "mv_ais_type_summary",
      dataIndex: "mv_ais_type_summary",
      width: 250,
      ellipsis: false,

    },
    {
      title: "Details",
      dataIndex: "detail",
      key: "view",
      ellipsis: {
        showTitle: false,
      },
      render: (text, record) => {
        if (record.mv_key) {
          return (
            <Tooltip placement="topLeft" title={text}>
              <a
                className="text-midnight font-semibold"
                onClick={() => handleDetails(record?.mv_key, record)}
              >
                View/Add Special Report
              </a>
            </Tooltip>
          );
        }
      },
    },
  ];
  // Function to navigate to details page
  const handleDetails = (id, payload) => {
    console.log(id , payload)
    router.push({
      pathname: `/merchantvessel/${id}`,
      query: { vessel: JSON.stringify(payload) },
    });
  };

  // Fetch data when searchData changes
  useEffect(() => {
    dispatch(fetchRegisteredMerchantVessel(searchData));
  }, [searchData]);

  return (
    <div>
      <PageHeader
        title="Special Report Merchant Vessels (List View)"
        onSearchChange={(value) => setSearchData(value)}
        placeholder="Search by IMO or Ship Name"
        showButton={false} // Pass true to show the button or false to hide it
      />
        <AntdTable
          scrollConfig={{ x: true }}
           columns={columns}
           data={data}
          loading={isLoading}
        />
    
    </div>
  );
}

export default SpecialMerchantReport;
