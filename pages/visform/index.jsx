import React, { useEffect, useState } from "react";
import AntdTable from "../../src/components/table/AntdTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchVisReport } from "../../src/redux/thunks/visData";
import dayjs from "dayjs";
import PageHeader from "../../src/components/pageheader/pageHeader";
import { Button, InputNumber, Select } from "antd";
import ReactDragListView from "react-drag-listview"; // Import ReactDragListView
import { Checkbox } from "antd";

function VisFormTable() {
  const dispatch = useDispatch();
  const { data, isLoading } = useSelector((state) => state.fetchVisData);
  const [searchData, setSearchData] = useState("");
      const [filterValueBtw, setFilterValueBtw] = useState([null, null]);
      const [filterValue, setFilterValue] = useState(null);
      const [filterOperator, setFilterOperator] = useState("eq");
      const [filteredDataSource, setFilteredDataSource] = useState(null);

      console.log(data)
  // Effect hook to fetch VIS report data when searchData changes
  useEffect(() => {
    dispatch(fetchVisReport(searchData));
  }, [searchData]);
  useEffect(() => {
    if (data) {
      setFilteredDataSource(data);
    }
  }, [data]);
      const extractUniqueValues = (data, attribute) => {
            if (!data) {
              return [];
            }
        return [...new Set(data.map((item) => item[attribute]))].map(
          (value) => ({
            text: value,
            value: value,
          })
        );
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

  
  //reusable function for rendering date values.
  function renderDate(text) {
          if (!text) return "---";

    const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
    return dtg;
  }

  // Table columns configuration
  const columns = [
    {
      title: "Boat ID ",
      key: "boat_id",
      dataIndex: "boat_id",
      width: 250,
      ellipsis: false,
      // filterDropdown: () => renderFilterDropdown("boat_id", "Number"),
      // sorter: (a, b) => a.boat_id - b.boat_id,
      sorter: (a, b) => {
        // Convert boat_id values to numbers for comparison
        const boatIdA =
          a.boat_id !== null && a.boat_id !== undefined
            ? parseInt(a.boat_id)
            : 0;
        const boatIdB =
          b.boat_id !== null && b.boat_id !== undefined
            ? parseInt(b.boat_id)
            : 0;

        // Compare boat ids
        return boatIdA - boatIdB;
      },
    },
    {
      title: "Nakwa Name",
      key: "nakwa_name",
      dataIndex: "nakwa_name",
      width: 250,
      ellipsis: false,
      filters: extractUniqueValues(data, "nakwa_name"),
      sorter: (a, b) => {
        if (a.nakwa_name == null || b.nakwa_name == null) {
          return 0;
        }
        return a.nakwa_name.localeCompare(b.nakwa_name);
      },

      sortDirections: ["descend", "ascend"],
      filterSearch: true,
      onFilter: (value, record) => record.nakwa_name.includes(value),
    },
    {
      title: "Crew",
      key: "crew",
      // filterDropdown: () => renderFilterDropdown("crew", "Number"),
      // sorter: (a, b) => parseFloat(a.crew) - parseFloat(b.crew),
      sorter: (a, b) => {
        // Convert boat_id values to numbers for comparison
        const crewA =
          a.crew !== null && a.crew !== undefined
            ? parseInt(a.crew)
            : 0;
        const crewB =
          b.crew !== null && b.crew !== undefined
            ? parseInt(b.crew)
            : 0;

        // Compare boat ids
        return crewA - crewB;
      },
      dataIndex: "crew",
      width: 250,
      ellipsis: false,
    },
    {
      title: "Departure Date",
      dataIndex: "dep_date",
      key: "dep_date",
      sorter: (a, b) => {
        if (!a.dep_date || !b.dep_date) return 0;
        return new Date(a.dep_date) - new Date(b.dep_date);
      },

      width: 250,
      ellipsis: false,
      render: renderDate,
    },
    {
      title: "Arrival Date",
      dataIndex: "arrival_date",
      key: "arrival_date",
      // sorter: (a, b) => a.arrival_date - localeCompare(b.arrival_date),
      sorter: (a, b) => {
        if (!a.arrival_date || !b.arrival_date) return 0;
        return new Date(a.arrival_date) - new Date(b.arrival_date);
      },
      width: 250,
      ellipsis: false,
      render: renderDate,
    },

    {
      title: "PC Date",
      key: "pc_date",
      sorter: (a, b) => {
        if (!a.pc_date || !b.pc_date) return 0;
        return new Date(a.pc_date) - new Date(b.pc_date);
      },
      dataIndex: "pc_date",
      width: 250,
      ellipsis: false,
    },
  ];

  
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
    <div>
      <PageHeader
        title="Vessel Information System"
        onSearchChange={(value) => setSearchData(value)}
        placeholder="Search by Boat ID or Nakwa Name"
        showButton={false} // Pass true to show the button or false to hide it
        currentData={currentData}
      />
      <ReactDragListView.DragColumn {...dragProps}>
        <AntdTable
          columns={dragColumns.filter((column) => !column.hidden)}
          setCurrentData={setCurrentData}
          data={filteredDataSource !== null ? filteredDataSource : []}
          loading={isLoading}
          scrollConfig={{ x: true }}
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

export default VisFormTable;
