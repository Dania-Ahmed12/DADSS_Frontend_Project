import React, { useEffect, useState } from "react";
import { Button, Checkbox, InputNumber, Select, Tooltip } from "antd";
import PageHeader from "../../src/components/pageheader/pageHeader";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { fetchMerchantDetails } from "../../src/redux/thunks/merchantVesselDetailsData";
import AntdTable from "../../src/components/table/AntdTable";

const Index = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [filterValueBtw, setFilterValueBtw] = useState([null, null]);
  const [filterValue, setFilterValue] = useState(null);

  const [filterOperator, setFilterOperator] = useState("eq");
  const [filteredDataSource, setFilteredDataSource] = useState(null);
  const [searchData, setSearchData] = useState("");
  const { data, isLoading } = useSelector(
    (state) => state.fetchMerchantVesselDetails
  );
  console.log(data);
  useEffect(() => {
    if (data) {
      setFilteredDataSource(data);
    }
  }, [data]);

  //  const extractUniqueShipNames = () => {
  //    return [...new Set(data.map((item) => item.mv_ship_name))].map((name) => ({
  //      text: name,
  //      value: name,
  //    }));
  //  };

  //  const extractUniqueFlags = () => {
  //    return [...new Set(data.map((item) => item.mv_flag))].map((flag) => ({
  //      text: flag,
  //      value: flag,
  //    }));
  //  };
  //  const extractUniqueTypes = () => {
  //    return [...new Set(data.map((item) => item.mv_type_name))].map((type) => ({
  //      text: type,
  //      value: type,
  //    }));
  //  };
  //     const extractUniqueAISTypes = () => {
  //       return [...new Set(data.map((item) => item.mv_ais_type_summary))].map(
  //         (type) => ({
  //           text: type,
  //           value: type,
  //         })
  //       );
  //     };

  const extractUniqueValues = (data, attribute) => {
    return [...new Set(data.map((item) => item[attribute]))].map((value) => ({
      text: value,
      value: value,
    }));
  };

  //  const applyFilter = () => {
  //    let filteredData = [...data];
  //    // Handle potential invalid filterValue (not required in prompt, but good practice)
  //    if (filterValue === null ) {
  //      console.warn("Invalid filter value. Please enter a value.");
  //      return;
  //    }

  //    if (filterOperator === "eq") {
  //         filteredData = filteredData.filter(
  //           (record) => record.mv_mmsi.toString() === filterValue[0].toString()
  //         );
  //    }
  //     else if (filterOperator === "gt") {
  //       try {
  //         const parsedValue = parseFloat(filterValue);
  //         filteredData = filteredData.filter(
  //           (record) => record.mv_mmsi.toString() > parsedValue
  //         );
  //       } catch (error) {
  //         console.error(
  //           "Invalid filter value for 'gt' operator. Please enter a number."
  //         );
  //       }
  //     }

  //     else if (filterOperator === "btw" && filterValue.every((val) => val !== null)) {
  //       filteredData = filteredData.filter(
  //         (record) =>
  //           record.mv_mmsi >= filterValue[0] && record.mv_mmsi <= filterValue[1]
  //       );
  //     } else if (filterOperator === "lt") {
  //       try {
  //         const parsedValue = parseFloat(filterValue);
  //         filteredData = filteredData.filter(
  //           (record) => record.mv_mmsi.toString() < parsedValue
  //         );
  //       } catch (error) {
  //         console.error(
  //           "Invalid filter value for 'lt' operator. Please enter a number."
  //         );
  //       }
  //     } else {
  //       console.warn("Invalid filter operator selected.");
  //     }

  //    setFilteredDataSource(filteredData);
  //  };

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
      filterDropdown: () => renderFilterDropdown("mv_mmsi", "Number"),
      sorter: (a, b) => a.mv_mmsi.localeCompare(b.mv_mmsi),
      // filterDropdown: () => (
      //   <div style={{ padding: 4, width: 200 }}>
      //     <div>
      //       <Select
      //         defaultValue="eq"
      //         style={{ width: 190, marginTop: 8 }}
      //         onChange={(value) => setFilterOperator(value)}
      //       >
      //         <Select.Option value="eq">Equal</Select.Option>
      //         <Select.Option value="gt">Greater Than</Select.Option>
      //         <Select.Option value="lt">Less Than</Select.Option>
      //         <Select.Option value="btw">Between</Select.Option>
      //       </Select>
      //       <div>
      //         {filterOperator === "btw" && (
      //           <div style={{ display: "flex", marginTop: 8 }}>
      //             <InputNumber
      //               style={{ width: 95 }}
      //               placeholder="Min"
      //               value={filterValue[0]}
      //               onChange={(value) =>
      //                 setFilterValue([value, filterValue[1]])
      //               }
      //             />
      //             <span style={{ margin: "0 8px" }}>to</span>
      //             <InputNumber
      //               style={{ width: 95 }}
      //               placeholder="Max"
      //               value={filterValue[1]}
      //               onChange={(value) =>
      //                 setFilterValue([filterValue[0], value])
      //               }
      //             />
      //           </div>
      //         )}
      //         {filterOperator !== "btw" && (
      //           <div style={{ marginTop: 8 }}>
      //             <InputNumber
      //               style={{ width: 190 }}
      //               placeholder="Value"
      //               value={filterValue[0]}
      //               onChange={(value) => setFilterValue([value, null])}
      //             />
      //           </div>
      //         )}
      //       </div>
      //     </div>
      //     <div className="ant-table-filter-dropdown-btns">
      //       <Button
      //         className="ant-btn ant-btn-primary ant-btn-sm"
      //         onClick={applyFilter}
      //       >
      //         OK
      //       </Button>
      //       <Button
      //         className="ant-btn ant-btn-link ant-btn-sm"
      //         disabled={!filterValue}
      //         onClick={resetFilter}
      //       >
      //         Reset
      //       </Button>
      //     </div>
      //   </div>
      // ),
    },
    {
      title: "IMO",
      key: "mv_imo",
      dataIndex: "mv_imo",
      width: 250,
      ellipsis: false,
      filterDropdown: () => renderFilterDropdown("mv_imo", "Number"),
      sorter: (a, b) => a.mv_imo.localeCompare(b.mv_imo),
    },
    {
      title: "Ship ID",
      width: 250,
      ellipsis: false,
      dataIndex: "mv_ship_id",
      key: "mv_ship_id",
      filterDropdown: () => renderFilterDropdown("mv_imo", "Number"),
      sorter: (a, b) => a.mv_imo.localeCompare(b.mv_imo),
    },
    {
      title: "Ship Name",
      width: 250,
      ellipsis: false,
      key: "mv_ship_name",
      dataIndex: "mv_ship_name",
      filters: extractUniqueValues(data, "mv_ship_name"),
      sorter: (a, b) => a.mv_ship_name.localeCompare(b.mv_ship_name),
      sortDirections: ["descend", "ascend"],
      filterSearch: true,
      onFilter: (value, record) => record.mv_ship_name.includes(value),
    },
    {
      title: "Ship Type",
      dataIndex: "mv_ship_type",
      width: 250,
      key:"mv_ship_type",
      ellipsis: false,
      filterDropdown: () => renderFilterDropdown("mv_ship_type", "Number"),
      sorter: (a, b) => a.mv_ship_type.localeCompare(b.mv_ship_type),
    },
    {
      title: "Flag",
      dataIndex: "mv_flag",
      width: 250,
      ellipsis: false,
      key: "mv_flag",
      filters: extractUniqueValues(data, "mv_flag"),
      sorter: (a, b) => a.mv_flag.localeCompare(b.mv_flag),
      sortDirections: ["descend", "ascend"],
      filterSearch: true,
      onFilter: (value, record) => record.mv_flag.includes(value),
    },
    {
      title: "Type",
      dataIndex: "mv_type_name",
      width: 250,
      ellipsis: false,
      key: "mv_type_name",
      filters: extractUniqueValues(data, "mv_type_name"),
      sorter: (a, b) => a.mv_type_name.localeCompare(b.mv_type_name),
      sortDirections: ["descend", "ascend"],
      filterSearch: true,
      onFilter: (value, record) => record.mv_type_name.includes(value),
    },
    {
      title: "AIS Type",
      key: "mv_ais_type_summary",
      dataIndex: "mv_ais_type_summary",
      width: 250,
      ellipsis: false,
      filters: extractUniqueValues(data, "mv_ais_type_summary"),
      sorter: (a, b) =>
        a.mv_ais_type_summary.localeCompare(b.mv_ais_type_summary),
      sortDirections: ["descend", "ascend"],
      filterSearch: true,
      onFilter: (value, record) => record.mv_ais_type_summary.includes(value),
    },
    {
      title: "Details",
      dataIndex: "detail",
      key: "view",
      ellipsis: {
        showTitle: false,
      },
      render: (text, record) => {
        if (record.mv_key) {
          return (
            <Tooltip placement="topLeft" title={text}>
              <a
                className="text-midnight font-semibold"
                onClick={() => handleDetails(record?.mv_key, record)}
              >
                View
              </a>
            </Tooltip>
          );
        }
      },
    },
  ];

  const handleDetails = (id, payload) => {
    router.push({
      pathname: `merchantVesselDetails/${id}`,
      query: { vessel: JSON.stringify(payload) },
    });
  };

  useEffect(() => {
    dispatch(fetchMerchantDetails(searchData));
  }, [searchData]);

const defaultCheckedList = columns.map((item) => item.key);
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const options = columns.map(({ key, title }) => ({
    label: title,
    value: key,
  }));

    // const newColumns = columns.map((item) => ({
    //   ...item,
    //   hidden: !checkedList.includes(item.key),
    // }));

    const newColumns = columns.map((item) => {
      if (item.key === "view") {
        // Return the "Detail" column as is without applying hidden property
        return item;
      }
      return {
        ...item,
        hidden: !checkedList.includes(item.key),
      };
    });


  return (
    <>
      <div>
        <PageHeader
          title="Merchant Vessel Details"
          showButton={false}
          onSearchChange={(value) => setSearchData(value)}
          placeholder="Search by IMO"
        />
      </div>
{/* 
      <div className="flex  justify-start  mt-10  ml-5 mr-5">
        <Checkbox.Group
          className="flex flex-wrap"
          value={checkedList}
          options={options}
          onChange={(value) => {
            setCheckedList(value);
          }}
        />
      </div> */}
      <div>
        <AntdTable
          columns={columns}
          // columns={newColumns.filter((column) => !column.hidden)}
          data={filteredDataSource || []}
          loading={isLoading}
          scrollConfig={{ x: true }}
        />
      </div>
    </>
  );
};

export default Index;
