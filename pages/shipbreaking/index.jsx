import React, { useEffect, useState } from "react";
import AntdTable from "../../src/components/table/AntdTable.js";
import { useRouter } from "next/router.js";
import Link from "next/link.js";
import styled from "styled-components";
import PageHeader from "../../src/components/pageheader/pageHeader.js";
import { useDispatch, useSelector } from "react-redux";
import { fetchShipBreakingReport } from "../../src/redux/thunks/shipbreakingReportData.js";
import { MerchantShipColumn, shipBreakColumns } from "../../src/helper/DataColumns.js";
import dayjs from "dayjs";
import { Button, Checkbox, InputNumber, Result, Select } from "antd";
import ReactDragListView from "react-drag-listview"; // Import ReactDragListView


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
        storedPermissions.includes("view_shipbreaking"))
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
        storedPermissions.includes("add_shipbreaking"))
    ) {
      // If "view_platforms" exists in the permissions array, set accessDenied to true
      setAccessDeniedAdd(false);
    } else {
      // If "view_platforms" does not exist in the permissions array or storedPermissions is not an array, set accessDenied to false
      setAccessDeniedAdd(true);
    }
  }, []);
  const { data, isLoading } = useSelector(
    (state) => state.fetchShipBreakingReport
  );
  useEffect(() => {
    if (data) {
      setFilteredDataSource(data);
    }
  }, [data]);
  //handle button click and navigate to a new page
  const handleNavigate = () => {
    router.push("/shipbreaking/register");
  };

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
      // Handle Between fil ter
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

  const renderFilterDropdown = (attribute, placeholder) => {
    return (
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
              onChange={(value) =>
                setFilterValueBtw([value, filterValueBtw[1]])
              }
            />
            <span style={{ margin: "0 8px" }}>to</span>
            <InputNumber
              style={{ width: 95 }}
              placeholder="Max"
              value={filterValueBtw[1]}
              onChange={(value) =>
                setFilterValueBtw([filterValueBtw[0], value])
              }
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
  };
  // Columns configuration for the AntdTable component
  const columns = [
    {
      title: "Date Time",
      dataIndex: "sb_dtg",
      key: "sb_dtg",
      ellipsis: false,
      width: 220,
      sorter: (a, b) => new Date(a.sb_dtg) - new Date(b.sb_dtg),
      render: (text) => {
        const dtg = text ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") : "---";
        return dtg;
      },
    },
    {
      title: "IMO",
      key: "mv_imo",
      // filterDropdown: () => renderFilterDropdown("mv_imo", "Number"),
      sorter: (a, b) =>
        a.merchant_vessel?.mv_imo.localeCompare(b.merchant_vessel?.mv_imo),
      render: (record) => record?.merchant_vessel?.mv_imo,
    },
    {
      title: "IMO Verified",
      key: "sb_imo_verified",
      dataIndex: "sb_imo_verified",
      render: (value) => (value ? "Yes" : "No"),
      filters: [
        { text: "Yes", value: true },
        { text: "No", value: false },
      ],
      sorter: (a, b) =>
        a.sb_imo_verified === b.sb_imo_verified
          ? 0
          : a.sb_imo_verified
          ? 1
          : -1,
      sortDirections: ["descend", "ascend"],
      filterSearch: true,
      onFilter: (value, record) => record.sb_imo_verified === value,
    },

    {
      title: "LPOC",
      key: "sb_lpoc",

      dataIndex: "sb_lpoc",
      filters: extractUniqueValues(data, "sb_lpoc"),
      // sorter: (a, b) => a.sb_lpoc.localeCompare(b.sb_lpoc),
      sorter: (a, b) => (a.sb_lpoc ?? "").localeCompare(b.sb_lpoc ?? ""),

      sortDirections: ["descend", "ascend"],
      filterSearch: true,
      onFilter: (value, record) => record.sb_lpoc.includes(value),
    },
    {
      title: "Ex Name",
      key: "sb_ex_name",
      filters: extractUniqueValues(data, "sb_ex_name"),
      sorter: (a, b) => (a.sb_ex_name ?? "").localeCompare(b.sb_ex_name ?? ""),
      sortDirections: ["descend", "ascend"],
      filterSearch: true,
      onFilter: (value, record) => record.sb_ex_name.includes(value),
      dataIndex: "sb_ex_name",
    },
    {
      title: "Embossed",
      key: "sb_emb_name",
      dataIndex: "sb_emb_name",
      filters: extractUniqueValues(data, "sb_emb_name"),
      sorter: (a, b) =>
        (a.sb_emb_name ?? "").localeCompare(b.sb_emb_name ?? ""),
      sortDirections: ["descend", "ascend"],
      filterSearch: true,
      onFilter: (value, record) => (record.sb_emb_name ?? "").includes(value),
    },

    {
      title: "Action",
      dataIndex: "action",
      key: "action",
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

  const [dragColumns, setDragColumns] = useState(columns);
  const defaultCheckedList = columns.map((item) => item.key);

  const [checkedList, setCheckedList] = useState(defaultCheckedList);

  // Set the default checkedList to include the keys of all columns
  const optionss = columns.map(({ key, title }) => ({
    label: title,
    value: key,
  }));
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
  const handleCheckboxChanges = (checkedValues) => {
    setCheckedList(checkedValues);
    const newDragColumns = dragColumns.map((item) => ({
      ...item,
      hidden: !checkedValues.includes(item.key),
    }));
    setDragColumns(newDragColumns);
  };
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
    <div>
      <PageHeader
        title="Ship Breaking (List View)"
        btnTitle="+ Add Report"
        onSearchChange={setSearchData}
        onNavigate={handleNavigate}
        placeholder="Search by Ex Name"
        // showButton={true}
        showButton={accessDeniedAdd === false} // Show the button if access is not denied
        btnTitleMedia="+ Add"
        currentData={currentData}
      />

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
        <ReactDragListView.DragColumn {...dragProps}>
          <AntdTable
            // columns={columns}
            columns={dragColumns.filter((column) => !column.hidden)}
            // data={data}
            data={filteredDataSource || []}
            loading={isLoading}
            scrollConfig={{ x: true }}
            setCurrentData={setCurrentData}
          />
        </ReactDragListView.DragColumn>
      )}
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