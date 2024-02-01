import React, { useEffect, useState } from "react";
import AntdTable from "../../src/components/table/AntdTable";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { fetchRegisteredVessel } from "../../src/redux/thunks/registeredVesselData";
import Link from "next/link";
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
      width: 250,
      ellipsis: false,
      render: (text, record) => (
        <Link
          className="text-midnight font-semibold"
          href={`registeredvessels/${record.rv_key}`}
        >
          view
        </Link>
      ),
    },
  ];

  const handleClick = () => {
    router.push("/registeredvessels/vesselregistration");
  };


  useEffect(() => {
    dispatch(fetchRegisteredVessel(searchData));
  }, [searchData]);

  return (
    <>
      <PageHeader
        title="Registered Fishing Vessels (List View)"
        btnTitle="+ Register Vessel"
        btnTitleMedia="+ Add"
        onSearchChange={setSearchData}
        onNavigate={handleClick}
        placeholder="Search by Vessel ID, Name or Reg No"
        showButton={true}
      />
      <div>
        <AntdTable
          columns={columns}
          data={data}
          loading={isLoading}
          scrollConfig={{ x: true }}
        />
      </div>
    </>
  );
}

export default Index;
export async function getServerSideProps(context) {
  return {
    props: {
      data: {
        title: "Registered Vessel Data",
      },
    },
  };
}
