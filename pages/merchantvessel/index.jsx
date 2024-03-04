import React, { useEffect, useState } from "react";
import PageHeader from "../../src/components/pageheader/pageHeader";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { Button, Checkbox, InputNumber, Select, Tooltip } from "antd";
import { fetchFishingData } from "../../src/redux/thunks/fishingVesselData";
import ReactDragListView from "react-drag-listview"; // Import ReactDragListView
import AntdTable from "../../src/components/table/AntdTable";
import { fetchMerchantData } from "../../src/redux/thunks/merchantVesselData";
import dayjs from "dayjs";
import { decimalToDMS } from "../../src/helper/position";
import Link from "next/link";
function SpecialReportMerchant() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [searchData, setSearchData] = useState("");
  const [filterValueBtw, setFilterValueBtw] = useState([null, null]);
  const [filterValue, setFilterValue] = useState(null);
  const [filterOperator, setFilterOperator] = useState("eq");
  const [filteredDataSource, setFilteredDataSource] = useState(null);
  const { data, isLoading } = useSelector(
    (state) => state.fetchMerchantVesselReport
  );
  console.log(data);
  useEffect(() => {
    dispatch(fetchMerchantData(searchData));
  }, [searchData]);

  const extractUniqueValues = (data, attribute) => {
    if (!data) {
      return [];
    }
    return [...new Set(data.map((item) => item[attribute]))].map((value) => ({
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

  const columns = [
    {
      title: "Platfrom ID",
      dataIndex: "msr_pf_id",
      key: "msr_pf_id",
      width: 250,
      ellipsis: false,
      filterDropdown: () => renderFilterDropdown("msr_pf_id", "Number"),
      sorter: (a, b) => {
        const pfIdA = a.msr_pf_id || ""; // Convert null or undefined to an empty string for comparison
        const pfIdB = b.msr_pf_id || "";
        return pfIdA.localeCompare(pfIdB);
      },

      render: (text) => {
        return text;
      },
    },
    {
      title: "Date Time",
      key: "msr_dtg",
      dataIndex: "msr_dtg",
      width: 250,
      filterDropdown: () => renderFilterDropdown("msr_dtg", "Number"),
      ellipsis: false,
      sorter: (a, b) => {
        // Convert sr_dtg values to Date objects for comparison
        const dateA = a.msr_dtg ? new Date(a.msr_dtg) : null;
        const dateB = b.msr_dtg ? new Date(b.msr_dtg) : null;

        // Check for null or invalid dates
        if (!dateA && !dateB) {
          return 0; // Both dates are invalid or null, consider them equal
        } else if (!dateA) {
          return 1; // DateA is invalid or null, DateB is valid, place DateA after DateB
        } else if (!dateB) {
          return -1; // DateB is invalid or null, DateA is valid, place DateB after DateA
        } else if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) {
          return 0; // Both dates are NaN, consider them equal
        } else if (isNaN(dateA.getTime())) {
          return 1; // DateA is NaN, DateB is valid, place DateA after DateB
        } else if (isNaN(dateB.getTime())) {
          return -1; // DateB is NaN, DateA is valid, place DateB after DateA
        }

        // Compare valid dates using getTime method
        return dateA.getTime() - dateB.getTime();
      },
      // render: renderDate,
      render: (text) => {
        if (!text) return "---";

        const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
        return dtg;
      },
    },
    {
      key: "latitude",
      title: "Latitude",
      dataIndex: "msr_position",
      sorter: (a, b) => {
        const latA = a.msr_position ? a.msr_position.coordinates[1] : null;
        const latB = b.msr_position ? b.msr_position.coordinates[1] : null;
        return latA - latB;
      },
      width: 250,
      ellipsis: false,
      render: (text, record) => {
        if (record.msr_position) {
          var val = record.msr_position.coordinates[1];
          const latitude = decimalToDMS(val, 1);
          // return latitude;
          return (
            <Tooltip title={`${val}`}>
              <span>{latitude}</span>
            </Tooltip>
          );
        }
      },
    },
    {
      key: "longitude",
      title: "Longitude",
      dataIndex: "msr_position",
      sorter: (a, b) => {
        const latA = a.msr_position ? a.msr_position.coordinates[0] : null;
        const latB = b.msr_position ? b.msr_position.coordinates[0] : null;
        return latA - latB;
      },
      width: 250,
      ellipsis: false,
      render: (text, record) => {
        if (record.msr_position) {
          var val = record.msr_position.coordinates[0];
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
      key: "msr_patroltype",
      title: "Patrol Type",
      dataIndex: "msr_patroltype",
      width: 250,
      ellipsis: false,
      filters: extractUniqueValues(data, "msr_patroltype"),
      // sorter: (a, b) => a.msr_patroltype.localeCompare(b.msr_patroltype),
      // sorter: (a, b) => a.msr_action.localeCompare(b.msr_action),
      sorter: (a, b) => {
        // Convert sr_patroltype values to strings for comparison
        const patrolTypeA = a.msr_patroltype || "";
        const patrolTypeB = b.msr_patroltype || "";

        // Compare patrol types using localeCompare
        return patrolTypeA.localeCompare(patrolTypeB);
      },
      sortDirections: ["descend", "ascend"],
      filterSearch: true,
      onFilter: (value, record) => record.msr_patroltype.includes(value),
      render: (text) => {
        return text;
      },
    },
    {
      key: "msr_action",
      title: "Action",
      dataIndex: "msr_action",
      width: 250,
      ellipsis: false,
      filters: extractUniqueValues(data, "msr_action"),
      sorter: (a, b) => {
        // Convert sr_patroltype values to strings for comparison
        const actionA = a.msr_action || "";
        const actionB = b.msr_action || "";

        // Compare patrol types using localeCompare
        return actionA.localeCompare(actionB);
      },

      sortDirections: ["descend", "ascend"],
      filterSearch: true,
      onFilter: (value, record) => record.msr_action.includes(value),
      render: (text) => {
        return text;
      },
    },
    {
      title: "Details",
      dataIndex: "action",
      key: "action",
      width: 250,
      ellipsis: false,
      render: (text, record) => {
        if (record.msr_key) {
          console.log(record);
          console.log(record.msr_key);
          return (
            <div>
              <a
                className="text-midnight font-semibold"
                onClick={() => handleDetails(record?.msr_key, record)}
              >
                View
              </a>
            </div>
          );
        }
      },
    },
  ];


      const handleDetails = (msr_key, payload) => {
        console.log(msr_key , payload)
        router.push({
          pathname: `/merchantvessel/specialreportdetails`,
          query: {
            msr_key: msr_key,
            vessel: payload,
          },
        });
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

     const handleClick = () => {
       router.push("/merchantvessel/addspecialreport");
     };

   const [currentData, setCurrentData] = useState(data);

  return (
    <div>
      <PageHeader
        title="Special Report Merchant Vessels (List View)"
        onSearchChange={(value) => setSearchData(value)}
        placeholder="Search by Vessel ID/Name or Reg No"
        btnTitle="+ Add Special Report"
        onNavigate={handleClick}
        showButton={true} // Pass true to show the button or false to hide it
        currentData={currentData}
      />
      <ReactDragListView.DragColumn {...dragProps}>
        <AntdTable
          // columns={columns}
          columns={dragColumns.filter((column) => !column.hidden)}
          data={data}
          // data={filteredDataSource || []}
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
  );
}

export default SpecialReportMerchant;
