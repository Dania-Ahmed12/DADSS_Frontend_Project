import React, { useEffect, useState } from "react";
import AntdTable from "../../src/components/table/AntdTable.js";
import { useRouter } from "next/router.js";
import Link from "next/link.js";
import { useDispatch, useSelector } from "react-redux";
import { fetchGeneralReport } from "../../src/redux/thunks/generalReportData.js";
import { GeneralReportColumn } from "../../src/helper/DataColumns.js";
import PageHeader from "../../src/components/pageheader/pageHeader.js";

function Index() {
  const router = useRouter();
  const [searchData, setSearchData] = useState("");
  const { data, isLoading } = useSelector((state) => state.fetchGeneralReport);
  const dispatch = useDispatch();

  const columns = [
    ...GeneralReportColumn,
    {
      title: "Action",
      dataIndex: "action",
      width: 250,
      ellipsis: false,
      render: (text, record) => {
        return (
            <Link
              href={`/generalreport/${record.gr_key}`}
              className="text-midnight ml-2 font-semibold"
            >
              Details
            </Link>
        );
      },
    },
  ];
  const handleNavigate = () => {
    router.push("/generalreport/addgeneralinput");
  };
  useEffect(() => {
    dispatch(fetchGeneralReport(searchData));
  }, [searchData]);
  return (
    <>
      <div>
        <PageHeader
          title="General Report (View/Add)"
          btnTitle="+ Add Report"
          btnTitleMedia="+"
          onSearchChange={setSearchData}
          onNavigate={handleNavigate}
          placeholder="Search"
          showButton={true}
        />
      </div>
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
export async function getServerSideProps() {
  return {
    props: {
      data: {
        title: "General Report",
      },
    },
  };
}
