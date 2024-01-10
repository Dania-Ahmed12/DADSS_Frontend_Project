import React, { useEffect, useState } from "react";
import AntdTable from "../../src/components/table/AntdTable.js";
import { useRouter } from "next/router.js";
import Link from "next/link.js";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { fetchMissionReport } from "../../src/redux/thunks/missionReportData.js";
import PageHeader from "../../src/components/pageheader/pageHeader.js";
import { Missioncolumns } from "../../src/helper/DataColumns.js";

function Index() {
  const [searchData, setSearchData] = useState("");
  const { data, isLoading } = useSelector((state) => state.fetchMissionReport);
  const dispatch = useDispatch();
  const router = useRouter();

  // Navigation handler to the add intel input page
  const handleNavigate = () => {
    router.push("/missionreport/addmissioninput");
  };

  // Table columns configuration, including additional "Details" action
  const columns = [
    ...Missioncolumns,
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <IconsStylingWrap>
            <Link
              href={`/missionreport/${record.mr_key}`}
              className="text-midnight ml-2 font-semibold"
            >
              Details
            </Link>
          </IconsStylingWrap>
        );
      },
    },
  ];

  // Effect hook to fetch mission report data when searchData changes
  useEffect(() => {
    dispatch(fetchMissionReport(searchData));
  }, [searchData]);

  return (
    <div>
      <PageHeader
        title="Mission Report (List View)"
        btnTitle="+ Add Mission Report"
        onSearchChange={setSearchData}
        onNavigate={handleNavigate}
        placeholder="Search by platform ID"
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

