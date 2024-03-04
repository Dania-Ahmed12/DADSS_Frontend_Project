import { useRouter } from "next/router";
import React, { useState } from "react";
import AntdTable from "../../src/components/table/AntdTable";
import { fetchRegisteredMerchantVessel } from "../../src/redux/thunks/registerMerchantVesselDatas";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Link from "next/link";
import { MerVesselColumn } from "../../src/helper/DataColumns";
import PageHeader from "../../src/components/pageheader/pageHeader";
import { Button, InputNumber, Select, Spin } from "antd";
import ReactDragListView from "react-drag-listview"; // Import ReactDragListView
import { Checkbox } from "antd";
function Index() {
  const router = useRouter();
  //handle button click and navigate to a new page
  const handleClick = () => {
    router.push("/registeredmerchantvessels/vesselmerchantregistration");
  };
  const dispatch = useDispatch();
  const [searchData, setSearchData] = useState("");
  const [filterValueBtw, setFilterValueBtw] = useState([null, null]);
  const [filterValue, setFilterValue] = useState(null);
  const [filterOperator, setFilterOperator] = useState("eq");
  const [filteredDataSource, setFilteredDataSource] = useState(null);
 
 const [isDataLoaded, setIsDataLoaded] = useState(false); const { data, isLoading } = useSelector(
    (state) => state.fetchRegisteredMerchantVesselData
  );
  console.log(data)
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
      title: "MMSI",
      key: "mv_mmsi",
      dataIndex: "mv_mmsi",
      width: 250,
      ellipsis: false,
      // filterDropdown: () => renderFilterDropdown("mv_mmsi", "Number"),
      sorter: (a, b) => {
        const mmsiA = a.mv_mmsi || ""; // Convert null or undefined to an empty string
        const mmsiB = b.mv_mmsi || "";
        return mmsiA.localeCompare(mmsiB);
      },
    },
    {
      title: "IMO",
      key: "mv_imo",
      dataIndex: "mv_imo",
      width: 250,
      ellipsis: false,
      // filterDropdown: () => renderFilterDropdown("mv_imo", "Number"),
      sorter: (a, b) => {
        const imoA = a.mv_imo || ""; // Convert null or undefined to an empty string
        const imoB = b.mv_imo || "";
        return imoA.localeCompare(imoB);
      },
    },
    {
      title: "Ship ID",
      width: 250,
      ellipsis: false,
      dataIndex: "mv_ship_id",
      key: "mv_ship_id",
      // filterDropdown: () => renderFilterDropdown("mv_ship_id", "Number"),
      sorter: (a, b) => {
        const shipA = a.mv_ship_id || ""; // Convert null or undefined to an empty string
        const shipB = b.mv_ship_id || "";
        return shipA.localeCompare(shipB);
      },
    },
    {
      title: "Ship Name",
      width: 250,
      ellipsis: false,
      key: "mv_ship_name",
      dataIndex: "mv_ship_name",
      onFilter: (value, record) =>
        record.mv_ship_name && record.mv_ship_name.includes(value),
      filters: extractUniqueValues(data, "mv_ship_name"),
      sorter: (a, b) => {
        const shipNameA = a.mv_ship_name || ""; // Convert null or undefined to an empty string
        const shipNameB = b.mv_ship_name || "";
        return shipNameA.localeCompare(shipNameB);
      },
      sortDirections: ["descend", "ascend"],
      filterSearch: true,
    },
    {
      title: "Flag",
      dataIndex: "mv_flag",
      width: 250,
      ellipsis: false,
      key: "mv_flag",
      onFilter: (value, record) =>
        record.mv_flag && record.mv_flag.includes(value),
      filters: extractUniqueValues(data, "mv_flag"),
      sorter: (a, b) => {
        const flagA = a.mv_flag || ""; // Convert null or undefined to an empty string
        const flagB = b.mv_flag || "";
        return flagA.localeCompare(flagB);
      },
      sortDirections: ["descend", "ascend"],
      filterSearch: true,
    },
    {
      title: "Type",
      dataIndex: "mv_type_name",
      width: 250,
      ellipsis: false,
      key: "mv_type_name",
      onFilter: (value, record) =>
        record.mv_type_name && record.mv_type_name.includes(value),
      filters: extractUniqueValues(data, "mv_type_name"),
      sorter: (a, b) => {
        const typeA = a.mv_type_name || ""; // Convert null or undefined to an empty string
        const typeB = b.mv_type_name || "";
        return typeA.localeCompare(typeB);
      },
      sortDirections: ["descend", "ascend"],
      filterSearch: true,
    },
    {
      title: "AIS Type",
      key: "mv_ais_type_summary",
      dataIndex: "mv_ais_type_summary",
      width: 250,
      ellipsis: false,
      onFilter: (value, record) =>
        record.mv_ais_type_summary && record.mv_ais_type_summary.includes(value),
      filters: extractUniqueValues(data, "mv_ais_type_summary"),
      sorter: (a, b) => {
        const typeA = a.mv_ais_type_summary || ""; // Convert null or undefined to an empty string
        const typeB = b.mv_ais_type_summary || "";
        return typeA.localeCompare(typeB);
      },
      sortDirections: ["descend", "ascend"],
      filterSearch: true,
    },
    {
      title: "Details",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <Link
          className="text-midnight font-semibold"
          href={`registeredmerchantvessels/${record.mv_key}`}
        >
          view
        </Link>
      ),
    },
  ];

  // Effect hook to dispatch the fetchRegisteredMerchantVessel action when searchData changes
  useEffect(() => {
    dispatch(fetchRegisteredMerchantVessel(searchData));
    //  setIsDataLoaded(true);
    //only re-run if the value of searchData changes between renders.
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
      <div>
        <PageHeader
          title="Registered Merchant Vessels (List View)"
          btnTitle="+ Register Vessel"
          btnTitleMedia="+ Add"
          onSearchChange={setSearchData}
          onNavigate={handleClick}
          placeholder="Search by IMO or Ship Name or MMSI"
          showButton={true}
          currentData={currentData}
        />
        <ReactDragListView.DragColumn {...dragProps}>
          {/* <Spin spinning={isLoading}> */}
            <AntdTable
              scrollConfig={{ x: true }}
              // columns={columns}
              columns={dragColumns.filter((column) => !column.hidden)}
              // data={data}
              data={filteredDataSource || data}
              loading={isLoading}
              setCurrentData={setCurrentData}
            />
          {/* </Spin> */}
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
    </>
  );
}

export default Index;

export async function getServerSideProps(context) {
  return {
    props: {
      data: {
        title: "Registered Merchant Vessel Data",
      },
    },
  };
}
