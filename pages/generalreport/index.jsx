import React, { useEffect, useState } from "react";
import AntdTable from "../../src/components/table/AntdTable.js";
import { useRouter } from "next/router.js";
import Link from "next/link.js";
import { useDispatch, useSelector } from "react-redux";
import { fetchGeneralReport } from "../../src/redux/thunks/generalReportData.js";
import { GeneralReportColumn } from "../../src/helper/DataColumns.js";
import PageHeader from "../../src/components/pageheader/pageHeader.js";
import { decimalToDMS } from "../../src/helper/position.js";
import dayjs from "dayjs";
import ReactDragListView from "react-drag-listview"; // Import ReactDragListView
import { Button, Checkbox, InputNumber, Select, Tooltip } from "antd";

function Index() {
  const router = useRouter();
  const [searchData, setSearchData] = useState("");
  const { data, isLoading } = useSelector((state) => state.fetchGeneralReport);
  console.log(data);
  const dispatch = useDispatch();
  // const [filterValueBtw, setFilterValueBtw] = useState([null, null]);
  const [filterValue, setFilterValue] = useState(null);
  const [filterOperator, setFilterOperator] = useState();
  const [filteredDataSource, setFilteredDataSource] = useState(null);
  const [currentData, setCurrentData] = useState(data);

  const extractUniqueValues = (data, attribute) => {
    if (!data) {
      return [];
    }
    return [...new Set(data.map((item) => item[attribute]))].map((value) => ({
      text: value,
      value: value,
    }));
  };

  const resetFilter = () => {
    setFilterValue(null);
    // setFilterValueBtw([null, null]);
    setFilterOperator("eq");
    setFilteredDataSource(data);
  };

  const applyFilter = (attribute) => {
    let filteredData = data;
    console.log(attribute, filterValue);

    if (filterOperator === "btw") {
      // Handle Between filter
      // if (filterValueBtw.every((val) => val !== null)) {
      //   const min = parseFloat(filterValueBtw[0]);
      //   const max = parseFloat(filterValueBtw[1]);
      //   filteredData = filteredData.filter(
      //     (record) =>
      //       parseFloat(record[attribute]) >= min &&
      //       parseFloat(record[attribute]) <= max
      //   );
      // }
    } else {
      // Handle other filters
      if (filterValue !== null) {
        switch (filterOperator) {
          case "eq":
            filteredData = filteredData.filter(
              (record) => record[attribute] === filterValue
            );
            console.log(filteredData);
            console.log(filterOperator);
            break;
            // case "gt":
            //   filteredData = filteredData.filter(
            //     (record) => (record[attribute]) > filterValue
            //   );
            break;
            // case "lt":
            //   filteredData = filteredData.filter(
            //     (record) => (record[attribute]) < filterValue
            //   );
            break;
          default:
            console.warn("Invalid filter operator selected.");
        }
      }
    }
    console.log(filteredData);
    setFilteredDataSource(filteredData);
    console.log(filteredData);
  };

  console.log("before ", filterValue);

  const renderFilterDropdown = (attribute, placeholder) => (
    <div style={{ padding: 4, width: 200 }}>
      <Select
        value={filterOperator}
        style={{ width: 190, marginTop: 8 }}
        onChange={(value) => setFilterOperator(value)}
      >
        <Select.Option value="eq">Equal</Select.Option>
        {/* <Select.Option value="gt">Greater Than</Select.Option>
      <Select.Option value="lt">Less Than</Select.Option> */}
        {/* <Select.Option value="btw">Between</Select.Option> */}
      </Select>

      {/* {filterOperator === "btw" && (
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
    )} */}
      {/* {filterOperator !== "btw" && ( */}
      <div style={{ marginTop: 8 }}>
        <InputNumber
          style={{ width: 190 }}
          placeholder={placeholder}
          value={filterValue}
          // onChange={(value) => setFilterValue(value)}
          onChange={(value) => {
            setFilterValue(value);
            console.log(value);
          }}
        />
      </div>
      {/* )} */}
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
  console.log("after", filterValue);

  useEffect(() => {
    dispatch(fetchGeneralReport(searchData));
    // applyFilter();
    // renderFilterDropdown();
  }, [searchData]);
  const columns = [
    {
      title: "Platform ID",
      dataIndex: "gr_pf_id",
      key: "gr_pf_id",
      filters: extractUniqueValues(data, "gr_pf_id"),
      sorter: (a, b) => {
        const aValue = a.gr_pf_id || "";
        const bValue = b.gr_pf_id || "";
        return aValue.localeCompare(bValue);
      },
      sortDirections: ["descend", "ascend"],
      filterSearch: true,
      onFilter: (value, record) => {
        const recordValue = record.gr_pf_id || "";
        return recordValue.includes(value);
      },
      width: 250,
      ellipsis: false,
      render: (text) => {
        return text;
      },
    },
    {
      key: "latitude",
      title: "Latitude",
      dataIndex: "gr_position",
      sorter: (a, b) => {
        const latA = a.gr_position ? a.gr_position.coordinates[1] : null;
        const latB = b.gr_position ? b.gr_position.coordinates[1] : null;
        // Handle null or undefined values
        if (latA === null || latA === undefined) return -1;
        if (latB === null || latB === undefined) return 1;
        return latA - latB;
      },
      width: 250,
      ellipsis: false,
      render: (text, record) => {
        if (record.gr_position) {
          const val = record.gr_position.coordinates[1];
          const latitude = decimalToDMS(val, 1);
          return (
            <Tooltip title={`${val}`}>
              <span>{latitude}</span>
            </Tooltip>
          );
        } else {
          return "N/A"; // or any other placeholder for null or undefined data
        }
      },
    },
    {
      key: "longitude",
      title: "Longitude",
      dataIndex: "gr_position",
      sorter: (a, b) => {
        const latA = a.gr_position ? a.gr_position.coordinates[0] : null;
        const latB = b.gr_position ? b.gr_position.coordinates[0] : null;

        // Handle null or undefined values
        if (latA === null || latA === undefined) return -1;
        if (latB === null || latB === undefined) return 1;
        return latA - latB;
      },
      width: 250,
      ellipsis: false,
      render: (text, record) => {
        if (record.gr_position) {
          var val = record.gr_position.coordinates[0];
          const longitude = decimalToDMS(val, 0);
          // return latitude;
          return (
            <Tooltip title={`${val}`}>
              <span>{longitude}</span>
            </Tooltip>
          );
        }
      },
    },
    {
      key: "gr_patroltype",
      title: "Patrol Type",
      dataIndex: "gr_patroltype",
      width: 250,
      ellipsis: false,
      filters: extractUniqueValues(data, "gr_patroltype"),
      sorter: (a, b) => {
        const typeA = a.gr_patroltype || "";
        const typeB = b.gr_patroltype || "";
        return typeA.localeCompare(typeB);
      },
      sortDirections: ["descend", "ascend"],
      filterSearch: true,
      onFilter: (value, record) => {
        const recordType = record.gr_patroltype || "";
        return recordType.includes(value);
      },
    },
    {
      key: "gr_fuelrem",
      title: "Fuel Remaining (%)",
      dataIndex: "gr_fuelrem",
      // filterDropdown: () => renderFilterDropdown("gr_fuelrem", "Number"),
      sorter: (a, b) => {
        const fuelRemA = a.gr_fuelrem;
        const fuelRemB = b.gr_fuelrem;

        // Handle null or undefined values
        if (isNaN(fuelRemA)) return -1;
        if (isNaN(fuelRemB)) return 1;

        return fuelRemA - fuelRemB;
      },
      width: 250,
      ellipsis: false,
    },
    {
      key: "gr_dtg",
      title: "Date Time",
      dataIndex: "gr_dtg",
      sorter: (a, b) => {
        if (!a.gr_dtg && !b.gr_dtg) return 0;
        if (!a.gr_dtg) return 1;
        if (!b.gr_dtg) return -1;
        return new Date(a.gr_dtg) - new Date(b.gr_dtg);
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
      key: "action",
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
    <>
      <div>
        <PageHeader
          title="General Report (View/Add)"
          btnTitle="+ Add Report"
          btnTitleMedia="+ Add"
          onSearchChange={setSearchData}
          onNavigate={handleNavigate}
          placeholder="Search by Platform ID / Patrol Type"
          showButton={true}
          currentData={currentData}
        />
      </div>
      <ReactDragListView.DragColumn {...dragProps}>
        <AntdTable
          columns={dragColumns.filter((column) => !column.hidden)}
          data={filteredDataSource ? filteredDataSource : data} // Use filteredDataSource only when filters are applied
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
