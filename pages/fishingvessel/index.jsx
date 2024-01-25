import React, { useEffect, useState } from "react";
import AntdTable from "../../src/components/table/AntdTable";
import { Tooltip } from "antd";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { fetchRegisteredVessel } from "../../src/redux/thunks/registeredVesselData";
import { RegVesselColumn } from "../../src/helper/DataColumns";
import PageHeader from "../../src/components/pageheader/pageHeader";

function Index() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [searchData, setSearchData] = useState("");
  const { data, isLoading } = useSelector(
    (state) => state.fetchRegisteredVesselData
  );
  const columns = [
    ...RegVesselColumn,
    {
      title: "Details",
      dataIndex: "detail",
      key: "view",
      ellipsis: {
        showTitle: false,
      },
      render: (text, record) => {
        if (record.rv_key) {
          return (
            <div>
              <a
                className="text-midnight font-semibold"
                onClick={() => handleDetails(record?.rv_key, record)}
              >
                View/Add Special Report
              </a>
            </div>
          );
        }
      },
    },
  ];
  const handleDetails = (id, payload) => {
    router.push({
      pathname: `fishingvessel/${id}`,
      query: { vessel: JSON.stringify(payload) },
    });
  };
 
  useEffect(() => {
    dispatch(fetchRegisteredVessel(searchData));
  }, [searchData]);

  return (
    <div>
      <PageHeader
        title="Special Report Fishing Vessels (List View)"
        onSearchChange={(value) => setSearchData(value)}
        placeholder="Search by Vessel ID/Name or Reg No"
        showButton={false} // Pass true to show the button or false to hide it
      />
      <div>
        <AntdTable
          scrollConfig={{ x: true }}
          columns={columns}
          data={data}
          loading={isLoading}
        />
      </div>
    </div>
  );
}

export default Index;
export async function getServerSideProps(context) {
  return {
    props: {
      data: {
        title: "Special Report(Fishing Vessel)",
      },
    },
  };
}
