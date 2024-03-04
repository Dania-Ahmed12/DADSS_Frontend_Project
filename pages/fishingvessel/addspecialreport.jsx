import React, { useEffect, useState } from "react";
import AntdTable from "../../src/components/table/AntdTable";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { fetchRegisteredVessel } from "../../src/redux/thunks/registeredVesselData";
import PageHeader from "../../src/components/pageheader/pageHeader";

function AddSpecialReport() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [searchData, setSearchData] = useState("");
  const { data, isLoading } = useSelector(
    (state) => state.fetchRegisteredVesselData
  );


  const columns = [
    {
      title: "Vessel ID Number",
      dataIndex: "rv_id",
      key: "rv_id",
      width: 250,
      ellipsis: false,
      render: (text) => {
        return text;
      },
    },
    {
      title: "Registration Number",
      key: "rv_regno",
      dataIndex: "rv_regno",
      width: 250,
      ellipsis: false,
      render: (text) => {
        return text;
      },
    },
    {
      key: "rv_name",
      title: "Vessel Name",
      dataIndex: "rv_name",
      width: 250,
      ellipsis: false,
      render: (text) => {
        return text;
      },
    },
    {
      key: "rv_type",
      title: "Type",
      dataIndex: "rv_type",
      width: 250,
      ellipsis: false,
      render: (text) => {
        return text;
      },
    },
    {
      key: "rv_flag",
      title: "Flag",
      dataIndex: "rv_flag",
      width: 250,
      ellipsis: false,
    },
    {
      key: "rv_province",
      title: "Province",
      dataIndex: "rv_province",
      width: 250,
      ellipsis: false,

    },
    {
      title: "Details",
      dataIndex: "action",
      key: "action",
      width: 250,
      ellipsis: false,
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
      pathname: `/fishingvessel/${id}`,
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
        <AntdTable
          columns={columns}
           data={data}
          loading={isLoading}
          scrollConfig={{ x: true }}
        />
    
    </div>
  );
}

export default AddSpecialReport;
export async function getServerSideProps(context) {
  return {
    props: {
      data: {
        title: "Special Report(Fishing Vessel)",
      },
    },
  };
}
