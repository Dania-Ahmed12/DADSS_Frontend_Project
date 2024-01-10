import { useRouter } from "next/router";
import React, { useState } from "react";
import AntdTable from "../../src/components/table/AntdTable";
import { fetchRegisteredMerchantVessel } from "../../src/redux/thunks/registerMerchantVesselDatas";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Link from "next/link";
import { MerVesselColumn } from "../../src/helper/DataColumns";
import PageHeader from "../../src/components/pageheader/pageHeader";

function Index() {
  const router = useRouter();
  //handle button click and navigate to a new page
  const handleClick = () => {
    router.push("/registeredmerchantvessels/vesselmerchantregistration");
  };
  const dispatch = useDispatch();
  const [searchData, setSearchData] = useState("");
  const { data, isLoading } = useSelector(
    (state) => state.fetchRegisteredMerchantVesselData
  );

  // Columns configuration for the AntdTable component
  const columns = [
    ...MerVesselColumn,
    {
      title: "Details",
      dataIndex: "detail",
      key: "view",
      render: (text, record) => (
        <Link
          className="text-midnight font-semibold"
          href={`registeredmerchantvessels/${record.mv_key}`}
        >
          view
        </Link>
      ),
    },
  ];

  // Effect hook to dispatch the fetchRegisteredMerchantVessel action when searchData changes
  useEffect(() => {
    dispatch(fetchRegisteredMerchantVessel(searchData));
    //only re-run if the value of searchData changes between renders.
  }, [searchData]);

  return (
    <>
      <div>
        <PageHeader
          title="Registered Merchant Vessels (List View)"
          btnTitle="+ Register a Vessel"
          onSearchChange={setSearchData}
          onNavigate={handleClick}
          placeholder="Search by IMO or Ship Name or MMSI"
          showButton={true}
        />
        <div>
          <AntdTable columns={columns} data={data} loading={isLoading} />
        </div>
      </div>
    </>
  );
}

export default Index;

export async function getServerSideProps(context) {
  return {
    props: {
      data: {
        title: "Registered Merchant Vessel Data",
      },
    },
  };
}
