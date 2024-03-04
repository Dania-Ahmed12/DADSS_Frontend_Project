import React, { useEffect, useRef, useState } from "react";
import AntdTable from "../../src/components/table/AntdTable.js";
import { useRouter } from "next/router.js";
import Link from "next/link.js";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { fetchIntelReport } from "../../src/redux/thunks/intelReportData.js";
import PageHeader from "../../src/components/pageheader/pageHeader.js";
import { IntelColumns } from "../../src/helper/DataColumns.js";
import { Button, InputNumber, Result, Select, Space } from "antd";
import dayjs from "dayjs";
import ReactDragListView from "react-drag-listview"; // Import ReactDragListView
import { Checkbox } from "antd";
import { DatePicker } from "antd";
import moment from "moment";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { hasPermission } from "../../src/helper/permission.js";

// Inside your component
const { RangePicker } = DatePicker;
function Index() {
  const [searchData, setSearchData] = useState("");
  const { data, isLoading } = useSelector((state) => state.fetchIntelReport);
  const dispatch = useDispatch();
  const router = useRouter();
  const [filterValueBtw, setFilterValueBtw] = useState([null, null]);
  const [filterValue, setFilterValue] = useState(null);
  const [filterOperator, setFilterOperator] = useState("eq");
  const [filteredDataSource, setFilteredDataSource] = useState(null);
  const componentRef = useRef();
  const addPermission = hasPermission('add_intelreport');
  const viewPermission = hasPermission('view_intelreport');

  // Navigation handler to the add intel input page
  const handleNavigate = () => {
    router.push("/intelreport/addintelinput");
  };

  useEffect(() => {
    if (data) {
      setFilteredDataSource(data);
    }
  }, [data]);

  // const extractUniqueValues = (data, attribute) => {
  //   if (!data) {
  //     return [];
  //   }
  //   return [...new Set(data.map((item) => item[attribute]))].map((value) => ({
  //     text: value,
  //     value: value,
  //   }));
  // };
  const extractUniqueValues = (data, attribute) => {
    console.log(data, attribute);
    // Check if data is an array and has length
    if (!Array.isArray(data) || data.length === 0) {
      console.log("Yes");
      return [];
    }

    // Now that we've confirmed data is an array, proceed with original logic
    const uniqueValues = [...new Set(data.map((item) => item[attribute]))];
    return uniqueValues.map((value) => ({
      text: value,
      value: value,
    }));
  };


  const applyFilter = (attribute) => {
    let filteredData = [...data];

    if (filterOperator === "btw") {
      // Handle Between filter
      if (filterValueBtw.every((val) => val !== null)) {
        const min = parseFloat(filterValueBtw[0]);
        const max = parseFloat(filterValueBtw[1]);
        filteredData = filteredData.filter(
          (record) =>
            parseFloat(record[attribute]) >= min &&
            parseFloat(record[attribute]) <= max
        );
      }
    } else {
      // Handle other filters
      if (filterValue !== null) {
        switch (filterOperator) {
          case "eq":
            filteredData = filteredData.filter(
              (record) => parseFloat(record[attribute]) === filterValue
            );
            break;
          case "gt":
            filteredData = filteredData.filter(
              (record) => parseFloat(record[attribute]) > filterValue
            );
            break;
          case "lt":
            filteredData = filteredData.filter(
              (record) => parseFloat(record[attribute]) < filterValue
            );
            break;
          default:
            console.warn("Invalid filter operator selected.");
        }
      }
    }

    setFilteredDataSource(filteredData);
  };

  const resetFilter = () => {
    setFilterValue(null);
    setFilterValueBtw([null, null]);
    setFilterOperator("eq");
    setFilteredDataSource(data);
  };

  const renderFilterDropdown = (attribute, placeholder) => (
    <div style={{ padding: 4, width: 200 }}>
      <Select
        defaultValue="eq"
        style={{ width: 190, marginTop: 8 }}
        onChange={(value) => setFilterOperator(value)}
      >
        <Select.Option value="eq">Equal</Select.Option>
        <Select.Option value="gt">Greater Than</Select.Option>
        <Select.Option value="lt">Less Than</Select.Option>
        <Select.Option value="btw">Between</Select.Option>
      </Select>
      {filterOperator === "btw" && (
        <div style={{ display: "flex", marginTop: 8 }}>
          <InputNumber
            style={{ width: 95 }}
            placeholder="Min"
            value={filterValueBtw[0]}
            onChange={(value) => setFilterValueBtw([value, filterValueBtw[1]])}
          />
          <span style={{ margin: "0 8px" }}>to</span>
          <InputNumber
            style={{ width: 95 }}
            placeholder="Max"
            value={filterValueBtw[1]}
            onChange={(value) => setFilterValueBtw([filterValueBtw[0], value])}
          />
        </div>
      )}
      {filterOperator !== "btw" && (
        <div style={{ marginTop: 8 }}>
          <InputNumber
            style={{ width: 190 }}
            placeholder={placeholder}
            value={filterValue}
            onChange={(value) => setFilterValue(value)}
          />
        </div>
      )}
      <div className="ant-table-filter-dropdown-btns">
        <Button
          className="ant-btn ant-btn-primary ant-btn-sm"
          onClick={() => applyFilter(attribute)}
        >
          OK
        </Button>
        <Button
          className="ant-btn ant-btn-link ant-btn-sm"
          onClick={resetFilter}
        >
          Reset
        </Button>
      </div>
    </div>
  );

  // Table columns configuration, including additional "Details" action
  const columns = [
    {
      title: "Platform ID",
      dataIndex: "ir_pf_id",
      key: "ir_pf_id",
      filters: extractUniqueValues(data, "ir_pf_id"),
      sorter: (a, b) => {
        const pfIdA = a.ir_pf_id || ""; // Convert null or undefined to an empty string
        const pfIdB = b.ir_pf_id || "";
        return pfIdA.localeCompare(pfIdB);
      },
      sortDirections: ["descend", "ascend"],
      filterSearch: true,
      onFilter: (value, record) => {
        // Handle case when record.ir_pf_id is null or undefined
        const pfId = record.ir_pf_id || "";
        return pfId.includes(value);
      },
      width: 250,
      ellipsis: false,
      render: (text) => {
        return text;
      },
    },
    {
      title: "Reporter Name",
      dataIndex: "ir_reporter_name",
      key: "ir_reporter_name",
      width: 250,
      ellipsis: false,
      filters: extractUniqueValues(data, "ir_reporter_name"),
      sorter: (a, b) => {
        const pfIdA = a.ir_reporter_name || ""; // Convert null or undefined to an empty string
        const pfIdB = b.ir_reporter_name || "";
        return pfIdA.localeCompare(pfIdB);
      },
      sortDirections: ["descend", "ascend"],
      filterSearch: true,
      onFilter: (value, record) => {
        // Handle case when record.ir_pf_id is null or undefined
        const pfId = record.ir_reporter_name || "";
        return pfId.includes(value);
      },
      render: (text, record) => {
        return text;
      },
    },
    {
      title: "Reporting Time",
      dataIndex: "ir_reporting_time",
      key: "ir_reporting_time",
      sorter: (a, b) => {
        if (!a.ir_reporting_time || !b.ir_reporting_time) return 0;
        return new Date(a.ir_reporting_time) - new Date(b.ir_reporting_time);
      },
      width: 250,
      ellipsis: false,
      render: (text) => {
        if (!text) return "---";
        const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
        return dtg;
      },
    },
    {
      title: "Jetty",
      key: "ir_jetty",
      filters: extractUniqueValues(data, "ir_jetty"),
      sorter: (a, b) => a.ir_jetty.localeCompare(b.ir_jetty),
      sortDirections: ["descend", "ascend"],
      filterSearch: true,
      onFilter: (value, record) => record.ir_jetty.includes(value),
      dataIndex: "ir_jetty",
      width: 250,
      ellipsis: false,
    },
    {
      title: "Boats",
      key: "ir_total_boats",
      // filterDropdown: () => renderFilterDropdown("ir_total_boats", "Number"),
      // sorter: (a, b) => a.ir_total_boats - b.ir_total_boats,
      sorter: (a, b) => {
        // Convert ir_total_boats values to numbers for comparison
        const totalBoatsA =
          typeof a.ir_total_boats === "number" ? a.ir_total_boats : 0;
        const totalBoatsB =
          typeof b.ir_total_boats === "number" ? b.ir_total_boats : 0;

        // Compare total boats
        return totalBoatsA - totalBoatsB;
      },

      dataIndex: "ir_total_boats",
      width: 250,
      ellipsis: false,
    },
    {
      title: "Details",
      key: "action",
      dataIndex: "action",
      render: (text, record) => (
        <Link
          className="text-midnight font-semibold"
          href={{
            pathname: `intelreport/${record.ir_key}`,
            query: { ir_key: record.ir_key }, // Pass rv_key as a query parameter
          }}
        >
          view
        </Link>
      ),
    },
  ];

  // Effect hook to fetch intel report data when searchData changes
  useEffect(() => {
    dispatch(fetchIntelReport(searchData));
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
  

  return (
    viewPermission ? (
    <div>
      <PageHeader
        title="Intel Report (List View)"
        btnTitle="+ Add Report"
        btnTitleMedia="+ Add"
        onSearchChange={setSearchData}
        onNavigate={handleNavigate}
        placeholder="Search by Reporter Name or Jetty"
        showButton={addPermission}
        currentData={filteredDataSource}
        componentRef={componentRef}
      />
      <ReactDragListView.DragColumn {...dragProps}>
      <div ref={componentRef}>
        <AntdTable
          columns={dragColumns.filter((column) => !column.hidden)}
          data={filteredDataSource}
          loading={isLoading}
          scrollConfig={{ x: true }}
        />
        </div>
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
