import React, { useEffect, useState } from "react";
import AntdTable from "../../src/components/table/AntdTable";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { fetchRegisteredVessel } from "../../src/redux/thunks/registeredVesselData";
import Link from "next/link";
import PageHeader from "../../src/components/pageheader/pageHeader";
import { Button, InputNumber, Result, Select } from "antd";
import ReactDragListView from "react-drag-listview"; // Import ReactDragListView
import { Checkbox } from "antd";
function Index() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [searchData, setSearchData] = useState("");
  const [filterValueBtw, setFilterValueBtw] = useState([null, null]);
  const [filterValue, setFilterValue] = useState(null);
  const [filterOperator, setFilterOperator] = useState("eq");
  const [filteredDataSource, setFilteredDataSource] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [accessDeniedAdd, setAccessDeniedAdd] = useState(false);
  // Retrieve the stored permissions array from localStorage
  const storedPermissions = JSON.parse(localStorage.getItem("permissions"));
  const isSuperUser = JSON.parse(localStorage.getItem("is_superuser"));
  useEffect(() => {
    // Check if storedPermissions is an array and "view_platforms" exists in it
    if (
      isSuperUser === true ||
      (Array.isArray(storedPermissions) &&
        storedPermissions.includes("view_rvessels"))
    ) {
      // If "view_platforms" exists in the permissions array, set accessDenied to true
      setAccessDenied(false);
    } else {
      // If "view_platforms" does not exist in the permissions array or storedPermissions is not an array, set accessDenied to false
      setAccessDenied(true);
    }
  }, []);

  useEffect(() => {
    // Check if storedPermissions is an array and "view_platforms" exists in it
    if (
      isSuperUser === true ||
      (Array.isArray(storedPermissions) &&
        storedPermissions.includes("add_rvessels"))
    ) {
      // If "view_platforms" exists in the permissions array, set accessDenied to true
      setAccessDeniedAdd(false);
    } else {
      // If "view_platforms" does not exist in the permissions array or storedPermissions is not an array, set accessDenied to false
      setAccessDeniedAdd(true);
    }
  }, []);

  const { data, isLoading, error } = useSelector(
    (state) => state.fetchRegisteredVesselData
  );
  useEffect(() => {
    if (data) {
      setFilteredDataSource(data);
    }
  }, [data]);

  const extractUniqueValues = (data, attribute) => {
    if (!data || data.length === 0) {
      return [];
    }
    if (!Array.isArray(data)) {
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

  // Update the filtered data source state
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

  console.log(data);

  const columns = [
    {
      title: "Vessel ID Number",
      dataIndex: "rv_id",
      key: "rv_id",
      width: 250,
      ellipsis: false,
      // filterDropdown: () => renderFilterDropdown("rv_id", "Number"),
      sorter: (a, b) => a.rv_id.localeCompare(b.rv_id),
      render: (text) => {
        return text;
      },
    },
    {
      title: "Registration Number",
      key: "rv_regno",
      dataIndex: "rv_regno",
      width: 250,
      // filterDropdown: () => renderFilterDropdown("rv_regno", "Number"),
      sorter: (a, b) => a.rv_regno.localeCompare(b.rv_regno),
      ellipsis: false,
      render: (text) => {
        return text;
      },
    },
    {
      key: "rv_name",
      title: "Vessel Name",
      dataIndex: "rv_name",
      width: 250,
      ellipsis: false,
      filters: extractUniqueValues(data, "rv_name"),
      sorter: (a, b) => {
        const NameA = a.rv_name || ""; // Convert null to an empty string for comparison
        const NameB = b.rv_name || "";
        return NameA.localeCompare(NameB);
      },
      sortDirections: ["descend", "ascend"],
      filterSearch: true,
      onFilter: (value, record) => {
        if (value === "null") {
          return (
            !record.rv_name ||
            record.rv_name === "null" ||
            record.rv_name === undefined
          );
        }
        return record.rv_name === value;
      },
      render: (text) => {
        return text;
      },
    },
    {
      key: "rv_type",
      title: "Type",
      dataIndex: "rv_type",
      width: 250,
      ellipsis: false,
      filters: extractUniqueValues(data, "rv_type"),
      sorter: (a, b) => {
        const TypeA = a.rv_type || ""; // Convert null to an empty string for comparison
        const TypeB = b.rv_type || "";
        return TypeA.localeCompare(TypeB);
      },
      sortDirections: ["descend", "ascend"],
      filterSearch: true,
      onFilter: (value, record) => {
        if (value === "null") {
          return !record.rv_type || record.rv_type === "null";
        }
        return record.rv_type === value;
      },
      render: (text) => {
        return text;
      },
    },
    {
      key: "rv_flag",
      title: "Flag",
      dataIndex: "rv_flag",
      width: 250,
      filters: extractUniqueValues(data, "rv_flag"),

      sorter: (a, b) => {
        const FlagA = a.rv_flag || ""; // Convert null to an empty string for comparison
        const FlagB = b.rv_flag || "";
        return FlagA.localeCompare(FlagB);
      },
      sortDirections: ["descend", "ascend"],
      filterSearch: true,
      onFilter: (value, record) => {
        if (value === "null") {
          return !record.rv_flag || record.rv_flag === "null";
        }
        return record.rv_flag === value;
      },
      ellipsis: false,
    },
    {
      key: "rv_province",
      title: "Province",
      dataIndex: "rv_province",
      width: 250,
      ellipsis: false,
      filters: extractUniqueValues(data, "rv_province"),

      sorter: (a, b) => {
        const provinceA = a.rv_province || ""; // Convert null to an empty string for comparison
        const provinceB = b.rv_province || "";
        return provinceA.localeCompare(provinceB);
      },
      sortDirections: ["descend", "ascend"],
      filterSearch: true,
      onFilter: (value, record) => {
        if (value === "null") {
          return !record.rv_province || record.rv_province === "null";
        }
        return record.rv_province === value;
      },
    },
    {
      title: "Details",
      dataIndex: "action",
      key: "action",
      width: 250,
      ellipsis: false,
      render: (text, record) => (
        <Link
          className="text-midnight font-semibold"
          // href={`registeredvessels/${record.rv_key}`}
          href={{
            pathname: `registeredvessels/${record.rv_key}`,
            query: { rv_key: record.rv_key }, // Pass rv_key as a query parameter
          }}
        >
          view
        </Link>
      ),
    },
  ];

  const handleClick = () => {
    router.push("/registeredvessels/vesselregistration");
  };

  useEffect(() => {
    dispatch(fetchRegisteredVessel(searchData));
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
    <>
      {accessDenied ? (
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
      ) : (
        <>
          <PageHeader
            title="Registered Fishing Vessels (List View)"
            // btnTitle="+ Register Vessel"
            btnTitle={"Register Vessel"} // Render the button only if access is not denied
            btnTitleMedia="+ Add"
            onSearchChange={setSearchData}
            onNavigate={handleClick}
            placeholder="Search by Vessel ID, Name or Reg No"
            // showButton={true}
            currentData={currentData}
            showButton={accessDeniedAdd === false} // Show the button if access is not denied
          />

          <ReactDragListView.DragColumn {...dragProps}>
            <AntdTable
              // columns={columns}
              columns={dragColumns.filter((column) => !column.hidden)}
              // data={data}
              data={filteredDataSource}
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
      )}
    </>
  );
}

export default Index;
export async function getServerSideProps(context) {
  return {
    props: {
      data: {
        title: "Registered Vessel Data",
      },
    },
  };
}
