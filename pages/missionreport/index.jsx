import React, { useEffect, useState } from "react";
import AntdTable from "../../src/components/table/AntdTable.js";
import { useRouter } from "next/router.js";
import Link from "next/link.js";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { fetchMissionReport } from "../../src/redux/thunks/missionReportData.js";
import PageHeader from "../../src/components/pageheader/pageHeader.js";
import { Missioncolumns } from "../../src/helper/DataColumns.js";
import dayjs from "dayjs";
import ReactDragListView from "react-drag-listview"; // Import ReactDragListView
import { Checkbox } from "antd";
import { hasPermission } from "../../src/helper/permission.js";
import { Button, InputNumber, Result, Select, Space } from "antd";

function Index() {
  const [searchData, setSearchData] = useState("");
    const [filterValueBtw, setFilterValueBtw] = useState([null, null]);
    const [filterValue, setFilterValue] = useState(null);
    const [filterOperator, setFilterOperator] = useState("eq");
    const [filteredDataSource, setFilteredDataSource] = useState(null);
      const addPermission = hasPermission("add_missionreport");
      const viewPermission = hasPermission("view_missionreport");
  const { data, isLoading } = useSelector((state) => state.fetchMissionReport);
  const dispatch = useDispatch();
  const router = useRouter();

  // Navigation handler to the add intel input page
  const handleNavigate = () => {
    router.push("/missionreport/addmissioninput");
  };


    useEffect(() => {
      if (data) {
        setFilteredDataSource(data);
      }
    }, [data]);

    const extractUniqueValues = (data, attribute) => {
          if (!data) {
            return [];
          }
      return [...new Set(data.map((item) => item[attribute]))].map((value) => ({
        text: value,
        value: value,
      }));
    };



  // Table columns configuration, including additional "Details" action
  const columns = [
    // ...Missioncolumns,
    {
      title: "Platform ID",
      key: "mr_pf_id",
      dataIndex: "mr_pf_id",
      ellipsis: false,
      filters: extractUniqueValues(data, "mr_pf_id"),
      sorter: (a, b) => a.mr_pf_id.localeCompare(b.mr_pf_id),
      sortDirections: ["descend", "ascend"],
      filterSearch: true,
      onFilter: (value, record) => record.mr_pf_id.includes(value),
    },
    {
      title: "Date Time",
      dataIndex: "mr_dtg",
      key: "mr_dtg",
      ellipsis: false,
      sorter: (a, b) => new Date(a.mr_dtg) - new Date(b.mr_dtg),
      render: (text) => {
        if (!text) return "---";

        const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
        return dtg;
      },
    },
    {
      title: "Registered ON",
      key: "mr_rdt",
      dataIndex: "mr_rdt",
      sorter: (a, b) => new Date(a.mr_rdt) - new Date(b.mr_rdt),
      ellipsis: false,
      render: (text) => {
        if (!text) return "---";

        const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
        return dtg;
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <Link
          className="text-midnight font-semibold"
          // href={`registeredvessels/${record.rv_key}`}
          href={{
            pathname: `missionreport/${record.mr_key}`,
            query: { mr_key: record.mr_key }, // Pass rv_key as a query parameter
          }}
        >
          view
        </Link>
      ),
    },
  ];

  // Effect hook to fetch mission report data when searchData changes
  useEffect(() => {
    dispatch(fetchMissionReport(searchData));
  }, [searchData]);

  
  const [dragColumns, setDragColumns] = useState(columns);
  const defaultCheckedList = columns.map((item) => item.key);

  const [checkedList, setCheckedList] = useState(defaultCheckedList);

  // Set the default checkedList to include the keys of all columns
  const options = columns
    .filter((column) => column.key !== "action") // Exclude the "action" column
    .map(({ key, title }) => ({
      label: title,
      value: key,
    }));

  useEffect(() => {
    setCheckedList(columns.map((item) => item.key));
    setDragColumns(columns);
  }, []);

  // Inside the useEffect hook where you handle checkbox changes
  const handleCheckboxChange = (checkedValues) => {
    setCheckedList(checkedValues);
    const newDragColumns = dragColumns.map((item) => ({
      ...item,
      hidden: !checkedValues.includes(item.key) && item.key !== "action", // Exclude "action" column from hiding
    }));
    setDragColumns(newDragColumns);
  };

  const dragProps = {
    onDragEnd(fromIndex, toIndex) {
      console.log(`dragged from ${fromIndex} to ${toIndex}`);
      const newColumns = [...dragColumns];
      const item = newColumns.splice(fromIndex, 1)[0];
      newColumns.splice(toIndex, 0, item);
      setDragColumns(newColumns);
    },
    nodeSelector: "th",
  };
   const [currentData, setCurrentData] = useState(data);


  return (
    // viewPermission ? (
    viewPermission ? (
      <div>
        <PageHeader
          title="Mission Report (List View)"
          btnTitle="+ Add Report"
          onSearchChange={setSearchData}
          onNavigate={handleNavigate}
          placeholder="Search by platform ID"
          // showButton={true}
          showButton={addPermission}
          btnTitleMedia="+ Add"
          currentData={currentData}
        />
        <ReactDragListView.DragColumn {...dragProps}>
          <AntdTable
            data={data}
            columns={dragColumns.filter((column) => !column.hidden)}
            loading={isLoading}
            scrollConfig={{ x: true }}
            setCurrentData={setCurrentData}
          />
        </ReactDragListView.DragColumn>
        <div
          className="fixed-checkbox flex  justify-center "
          style={{
            backgroundColor: "#F5F5F5",
            padding: "20px",
            width: "100%",
            position: "sticky",
            bottom: "0px",
          }}
        >
          <Checkbox.Group
            value={checkedList}
            options={options}
            onChange={handleCheckboxChange}
          />
        </div>
      </div>
    ) : (
      <Result
        status="403"
        title="403 Forbidden"
        subTitle="You don't have permission to access this resource."
        extra={
          <Button type="primary" onClick={() => router.push("/dashboard")}>
            Back Home
          </Button>
        }
      />
    )
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

