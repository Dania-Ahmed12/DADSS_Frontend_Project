import React, { useEffect, useState } from "react";
import AntdTable from "../../src/components/table/AntdTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchVisReport } from "../../src/redux/thunks/visData";
import dayjs from "dayjs";
import PageHeader from "../../src/components/pageheader/pageHeader";

function VisFormTable() {
  const dispatch = useDispatch();
  const { data, isLoading } = useSelector((state) => state.fetchVisData);
  const [searchData, setSearchData] = useState("");

  // Effect hook to fetch VIS report data when searchData changes
  useEffect(() => {
    dispatch(fetchVisReport(searchData));
  }, [searchData]);

  //reusable function for rendering date values.
  function renderDate(text) {
    if (!text) {
      return <span></span>;
    }
    const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
    return dtg;
  }

  // Table columns configuration
  const columns = [
    {
      title: "Boat ID ",
      dataIndex: "boat_id",
    },
    {
      title: "Nakwa Name",
      dataIndex: "nakwa_name",
    },
    {
      title: "Crew",
      dataIndex: "crew",
    },
    {
      title: "Departure Date",
      dataIndex: "dep_date",
      ellipsis: {
        showTitle: false,
      },
      render: renderDate,
    },
    {
      title: "Arrival Data",
      dataIndex: "arrival_date",
      ellipsis: {
        showTitle: false,
      },
      render: renderDate,
    },

    {
      title: "PC Date",
      dataIndex: "pc_date",
    },
  ];
  return (
    <div>
      <PageHeader
        title="Special Report VIS Data (List View)"
        onSearchChange={(value) => setSearchData(value)}
        placeholder="Search by Boat ID or Nakwa Name"
        showButton={false} // Pass true to show the button or false to hide it
      />
      <div>
        <AntdTable columns={columns} data={data} loading={isLoading} />
      </div>
    </div>
  );
}

export default VisFormTable;
