import React, { useEffect, useState } from "react";
import AntdTable from "../../src/components/table/AntdTable.js";
import { useRouter } from "next/router.js";
import Link from "next/link.js";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { fetchIntelReport } from "../../src/redux/thunks/intelReportData.js";
import PageHeader from "../../src/components/pageheader/pageHeader.js";
import { IntelColumns } from "../../src/helper/DataColumns.js";

function Index() {
  const [searchData, setSearchData] = useState("");
  const { data, isLoading } = useSelector((state) => state.fetchIntelReport);
  const dispatch = useDispatch();
  const router = useRouter();

  // Navigation handler to the add intel input page
  const handleNavigate = () => {
    router.push("/intelreport/addintelinput");
  };

  // Table columns configuration, including additional "Details" action
  const columns = [
    ...IntelColumns,
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <IconsStylingWrap>
            <Link
              href={`/intelreport/${record.ir_key}`}
              className="text-midnight ml-2 font-semibold"
            >
              Details
            </Link>
          </IconsStylingWrap>
        );
      },
    },
  ];

  // Effect hook to fetch intel report data when searchData changes
  useEffect(() => {
    dispatch(fetchIntelReport(searchData));
  }, [searchData]);
  
  return (
    <div>
      <PageHeader
        title="Intel Report (List View)"
        btnTitle="+ Add Report"
        onSearchChange={setSearchData}
        onNavigate={handleNavigate}
        placeholder="Search by Reporter Name or Jetty"
        showButton={true}
      />
      <div>
        <AntdTable columns={columns} data={data} loading={isLoading} />
      </div>
    </div>
  );
}

export default Index;

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