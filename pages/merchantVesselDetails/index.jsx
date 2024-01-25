import React, { useEffect, useState } from "react";
import { Tooltip } from "antd";
import PageHeader from "../../src/components/pageheader/pageHeader";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { fetchMerchantDetails } from "../../src/redux/thunks/merchantVesselDetailsData";
import AntdTable from "../../src/components/table/AntdTable";
import { MerVesselColumn } from "../../src/helper/DataColumns";

const index = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [searchData, setSearchData] = useState("");
  const { data, isLoading } = useSelector(
    (state) => state.fetchMerchantVesselDetails
  );

  const columns = [
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
                View
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
      pathname: `merchantVesselDetails/${id}`,
      // Pass additional data as a query parameter (vessel) in stringified JSON format
      query: { vessel: JSON.stringify(payload) },
    });
  };

  // Fetch data when searchData changes
  useEffect(() => {
    dispatch(fetchMerchantDetails(searchData));
  }, [searchData]);

  return (
    <>
      <div>
        <PageHeader
          title="Merchant Vessel Details"
          showButton={false}
          onSearchChange={(value) => setSearchData(value)}
          placeholder="Search by IMO"
        />
      </div>
      <div>
        <AntdTable columns={columns} data={data} loading={isLoading} />
      </div>
    </>
  );
};
export default index;
