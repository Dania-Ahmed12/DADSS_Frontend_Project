import React, { useEffect, useState } from "react";
import AntdTable from "../../src/components/table/AntdTable.js";
import { useRouter } from "next/router.js";
import Link from "next/link.js";
import styled from "styled-components";
import PageHeader from "../../src/components/pageheader/pageHeader.js";
import { useDispatch, useSelector } from "react-redux";
import { fetchShipBreakingReport } from "../../src/redux/thunks/shipbreakingReportData.js";
import { MerchantShipColumn, shipBreakColumns } from "../../src/helper/DataColumns.js";

function Index() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [searchData, setSearchData] = useState("");
  const { data, isLoading } = useSelector(
    (state) => state.fetchShipBreakingReport
  );

  //handle button click and navigate to a new page
  const handleNavigate = () => {
    router.push("/shipbreaking/register");
  };

  // Columns configuration for the AntdTable component
  const columns = [
    ...shipBreakColumns,

    ...MerchantShipColumn,

    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <IconsStylingWrap>
            <Link
              href={`/shipbreaking/${record.sb_key}`}
              className="text-midnight ml-2 font-semibold"
            >
              Details
            </Link>
          </IconsStylingWrap>
        );
      },
    },
  ];

  // Effect hook to dispatch the fetchRegisteredMerchantVessel action when searchData changes
  useEffect(() => {
    dispatch(fetchShipBreakingReport(searchData));
  }, [searchData]);

  return (
    <div>
      <PageHeader
        title="Ship Breaking (List View)"
        btnTitle="+ Add Report"
        onSearchChange={setSearchData}
        onNavigate={handleNavigate}
        placeholder="Search by Ex Name"
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