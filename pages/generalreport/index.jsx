import React, { useEffect, useState } from "react";
import AntdTable from "../../src/components/table/AntdTable.js";
import { useRouter } from "next/router.js";
import Link from "next/link.js";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { fetchGeneralReport } from "../../src/redux/thunks/generalReportData.js";
import { GeneralReportColumn } from "../../src/helper/DataColumns.js";
import PageHeader from "../../src/components/pageheader/pageHeader.js";

const IconsStylingWrap = styled.div`
  display: flex;
  .editIcon {
    color: #28387e;
    background-color: #f0f3f8;
    border-radius: 20px;
    font-size: 25px;
    padding: 5px;
    margin-right: 10px;
    cursor: pointer;
  }
  .deleteIcon {
    color: #e96162;
    background-color: #f9e7e8;
    border-radius: 20px;
    font-size: 25px;
    padding: 5px;
    cursor: pointer;
  }
  .details {
    color: #28387e;
    padding: 5px;
    cursor: pointer;
  }
`;

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
      render: (text, record) => {
        return (
          <IconsStylingWrap>
            <Link
              href={`/generalreport/${record.gr_key}`}
              className="text-midnight ml-2 font-semibold"
            >
              Details
            </Link>
          </IconsStylingWrap>
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
          onSearchChange={setSearchData}
          onNavigate={handleNavigate}
          placeholder="Search"
          showButton={true}
        />
      </div>
      <div>
        <AntdTable columns={columns} data={data} loading={isLoading} />
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
