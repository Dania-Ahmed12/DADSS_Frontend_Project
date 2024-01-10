import React, { useEffect, useState } from "react";
import AntdTable from "../../src/components/table/AntdTable";
import { Tooltip } from "antd";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { fetchRegisteredMerchantVessel } from "../../src/redux/thunks/registerMerchantVesselDatas";
import { MerVesselColumn } from "../../src/helper/DataColumns";
import PageHeader from "../../src/components/pageheader/pageHeader";
function Index() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [searchData, setSearchData] = useState("");
  const { data, isLoading } = useSelector(
    (state) => state.fetchRegisteredMerchantVesselData
  );
  const columns = [
    {
      title: "Ship ID ",
      dataIndex: "mv_ship_id",
    },
    ...MerVesselColumn,
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
    router.push({
      pathname: `merchantvessel/${id}`,
      // Pass additional data as a query parameter (vessel) in stringified JSON format
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
      <div>
        <AntdTable columns={columns} data={data} loading={isLoading} />
      </div>
    </div>
  );
}

export default Index;
