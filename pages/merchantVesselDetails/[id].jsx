import React, { useState } from "react";
import styled from "styled-components";
import { Col, Descriptions, Row, Tooltip, theme } from "antd";
import PageHeader from "../../src/components/pageheader/pageHeader";
import axios from "axios";
import { decimalToDMS } from "../../src/helper/position";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import Heading from "../../src/components/title/Heading";
import {
  MerVesselColumn,
  MerchantDetailColumns,
} from "../../src/helper/DataColumns";
import AntdTable from "../../src/components/table/AntdTable";
import { Modal } from "antd";

const ExpandedTableBody = styled.div`
  .ant-table-thead {
    .ant-table-cell {
    background-color: #0942a5 !important;
      color: white;
    }
  }

  .ant-table-tbody {
    .ant-table-cell {
      background:transparent
      border-color: transparent !important;
      border-top-color:transparent
      border-radius: 0% !important;
    }

    .ant-table-row:hover > .ant-table-cell {
      background: #191970 !important;
      color: white;
      border-color: transparent !important;
      border-top-color:transparent !important
      border-radius: 0% !important;
    }
      .ant-table-row:hover .custom-a{
      color:white !important;
      cursor:pointer
    }
  }
`;

function Details({ data }) {
  const router = useRouter();
  // Retrieve merchant vessel details from the query parameter
  const { id, vessel } = router.query;
  const [modalVisible, setModalVisible] = useState(false);
  const [clickedRowData, setClickedRowData] = useState(null);

  const parsedVesselData = JSON.parse(vessel);
  const Macrocolumns = [
    { title: "ID", dataIndex: "mv_key" },
    ...MerchantDetailColumns,
  ];

  // Map vesselcolumns to extract label and children
  const items = Macrocolumns.map((column) => ({
    label: column.title,
    children:
      column.dataIndex === "rv_rdt" // Check if the current label is "Registered ON"
        ? dayjs(parsedVesselData[column.dataIndex]).format(
            "YYYY-MM-DD HH:mm:ss"
          ) // Format the date if it's "Registered ON"
        : parsedVesselData[column.dataIndex], // Otherwise, use the value as it is
  }));

  const expandedRowRender = (record, condition, index) => {
    const columns = [
      {
        title: "Longitude",
        key: "mtd_longitude",
        dataIndex: "mtd_longitude",
        width: 120,
        ellipsis: true,
        render: (text, record) => {
          if (record.mtd_longitude) {
            var val = record.mtd_longitude;
            const longitude = decimalToDMS(val, 0);
            return longitude;
          }
        },
      },
      {
        title: "Latitude",
        key: "mtd_latitude",

        dataIndex: "mtd_latitude",
        width: 120,
        ellipsis: true,
        render: (text, record) => {
          if (record.mtd_latitude) {
            var val = record.mtd_latitude;
            const latitude = decimalToDMS(val, 1);
            return latitude;
          }
        },
      },
      {
        title: "Speed",
        key: "mtd_speed",

        dataIndex: "mtd_speed",
      },
      {
        title: "Heading",
        key: "mtd_heading",

        dataIndex: "mtd_heading",
      },
      {
        title: "Time Stamp",
        key: "mtd_timestamp",

        dataIndex: "mtd_timestamp",
        ellipsis: true,
        render: (text) => {
          const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
          return dtg;
        },
      },
      {
        title: "Details",
        key: "mtd_key",

        dataIndex: "mtd_key",
        ellipsis: {
          showTitle: false,
        },
        render: (text, record) => (
          <div
            className="text-midnight font-semibold custom-a"
            onClick={() => {
              setClickedRowData(record.mtd_key);
              setModalVisible(true);
            }}
          >
            View
          </div>
        ),
      },
    ];
    const firstTable = (
      <ExpandedTableBody>
        <AntdTable
          components={{
            body: {
              wrapper: ExpandedTableBody,
            },
          }}
          pagination={true}
          columns={columns}
          scrollConfig={{ x: true }}
          data={record.expandedData}
          size="small"
          style={{ float: "right", backgroundColor: "black" }}
        />
      </ExpandedTableBody>
    );
    const secondTable = (
      <ExpandedTableBody>
        <AntdTable
          components={{
            body: {
              wrapper: ExpandedTableBody,
            },
          }}
          pagination={false}
          columns={columns}
          scrollConfig={{ x: true }}
          data={record.expandedData.length > 0 ? [record.expandedData[0]] : []}
          size="small"
          style={{ float: "right", backgroundColor: "black" }}
        />
      </ExpandedTableBody>
    );
    if (index === 0) {
      return firstTable;
    } else {
      return secondTable;
    }
  };

  const columns = [
    {
      title: "DSRC",
      dataIndex: "mt_dsrc",
      key:"mt_dsrc",
    },
    {
      title: "Destination",
      dataIndex: "mt_destination",
      key:"mt_destination",
    },
    {
      title: "ETA",
      key:"mt_eta",
      dataIndex: "mt_eta",
      width: 150,
      ellipsis: true,
      render: (text) => {
        const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
        return dtg;
      },
    },

    {
      title: "First Observed At",
      key:"mt_first_observed_at",
      dataIndex: "mt_first_observed_at",
      width: 150,
      ellipsis: true,
      render: (text) => {
        const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
        return dtg;
      },
    },
    {
      title: "Last Observed At",
      key:"mt_last_observed_at",
      dataIndex: "mt_last_observed_at",
      width: 150,
      ellipsis: true,
      render: (text) => {
        const dtg = text ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") : null;
        return dtg;
      },
    },
    {
      title: "Observed Duration",
      key:"mt_observed_duration",
      dataIndex: "mt_observed_duration",
    },
    {
      title: "Trip Status",
      key:"mt_trip_status",
      dataIndex: "mt_trip_status",
    },
  ];

  const expandedDetailColumns = [
    {
      title: "Longitude",
      key: "mrd_long",
      dataIndex: "mtd_longitude",
      ellipsis: true,
      render: (text, record) => {
        if (record.expandedData && record.expandedData.length > 0) {
          const val = record.expandedData[0]?.mtd_longitude;
          if (val !== null && val !== undefined) {
            const longitude = decimalToDMS(val, 0);
            return longitude;
          }
        }
        return null;
      },
    },
    {
      title: "Latitude",
      key: "mtd_latitude",
      dataIndex: "mtd_latitude",
      ellipsis: true,
      render: (text, record) => {
        if (record.expandedData && record.expandedData.length > 0) {
          const val = record.expandedData[0]?.mtd_latitude;
          if (val !== null && val !== undefined) {
            const latitude = decimalToDMS(val, 1);
            return latitude;
          }
        }
        return null;
      },
    },
    {
      title: "Speed",
      key: "mtd_speed",
      dataIndex: "mtd_speed",
      render: (text, record) => record.expandedData?.[0]?.mtd_speed,
    },
    {
      title: "Heading",
      key: "mtd_speed",
      dataIndex: "mtd_heading",
      render: (text, record) => record.expandedData?.[0]?.mtd_heading,
    },
    {
      title: "Status",
      key: "mtd_status",
      dataIndex: "mtd_status",
      render: (text, record) => record.expandedData?.[0]?.mtd_status,
    },
    {
      title: "Course",
      key: "mtd_course",
      dataIndex: "mtd_course",
      render: (text, record) => record.expandedData?.[0]?.mtd_course,
    },
    {
      title: "Timestamp",
      key: "mtd_timestamp",
      dataIndex: "mtd_timestamp",
      render: (_text, record) => {
        if (record.expandedData && record.expandedData.length > 0) {
          const time = record.expandedData[0]?.mtd_timestamp;
          if (time) {
            const dtg = dayjs(time).format("YYYY-MM-DD HH:mm:ss");
            return dtg;
          } else {
            return "No date";
          }
        } else {
          return null;
        }
      },
    },

    {
      title: "UTC Seconds",
      key: "mtd_utc_seconds",
      dataIndex: "mtd_utc_seconds",
      render: (text, record) => record.expandedData?.[0]?.mtd_utc_seconds,
    },

    {
      title: "Draught",
      key: "mtd_draught",
      dataIndex: "mtd_draught",
      render: (text, record) => record.expandedData?.[0]?.mtd_draught,
    },
    {
      title: "ROT",
      key: "mtd_rot",
      dataIndex: "mtd_rot",
      render: (text, record) => record.expandedData?.[0]?.mtd_rot,
    },

    {
      title: "Last Port",
      key: "mtd_last_port",
      dataIndex: "mtd_last_port",
      render: (text, record) => record.expandedData?.[0]?.mtd_last_port,
    },
    {
      title: "Current Port ID",
      key: "mtd_current_id",
      dataIndex: "mtd_current_id",
      render: (text, record) => record.expandedData?.[0]?.mtd_current_id,
    },
    {
      title: "Current Port",
      key: "mtd_current_port",

      dataIndex: "mtd_current_port",
      render: (text, record) => record.expandedData?.[0]?.mtd_current_port,
    },
    {
      title: "Current Port Unlocode",
      key: "mtd_current_port_unlocode",

      dataIndex: "mtd_current_port_unlocode",
      render: (text, record) =>
        record.expandedData?.[0]?.mtd_current_port_unlocode,
    },
    {
      title: "Current Port Country",
      key: "mtd_current_port_country",

      dataIndex: "mtd_current_port_country",
      render: (text, record) =>
        record.expandedData?.[0]?.mtd_current_port_country,
    },
    {
      title: "Next Port ID",
      key: "mtd_next_port_id",

      dataIndex: "mtd_next_port_id",
      render: (text, record) => record.expandedData?.[0]?.mtd_next_port_id,
    },
    {
      title: "Next Port",
      key: "mtd_next_port_name",

      dataIndex: "mtd_next_port_name",
      render: (text, record) => record.expandedData?.[0]?.mtd_next_port_name,
    },
    {
      title: "Next Port Unlocode",
      key: "mtd_next_port_unlocode",

      dataIndex: "mtd_next_port_unlocode",
      render: (text, record) =>
        record.expandedData?.[0]?.mtd_next_port_unlocode,
    },
    {
      title: "Next Port Country",
      key: "mtd_next_port_name",

      dataIndex: "mtd_next_port_country",
      render: (text, record) => record.expandedData?.[0]?.mtd_next_port_country,
    },
    {
      title: "ETA Calculated",
      key: "mtd_eta_calc",

      dataIndex: "mtd_eta_calc",
      render: (_text, record) => {
        if (record.expandedData && record.expandedData.length > 0) {
          const time = record.expandedData[0]?.mtd_eta_calc;
          if (time) {
            const dtg = dayjs(time).format("YYYY-MM-DD HH:mm:ss");
            return dtg;
          } else {
            return "-";
          }
        } else {
          return null;
        }
      },
    },

    {
      title: "ETA Updated",
      key: "mtd_eta_updated",

      dataIndex: "mtd_eta_updated",
      render: (_text, record) => {
        if (record.expandedData && record.expandedData.length > 0) {
          const time = record.expandedData[0]?.mtd_eta_updated;
          if (time) {
            const dtg = dayjs(time).format("YYYY-MM-DD HH:mm:ss");
            return dtg;
          } else {
            return "-";
          }
        } else {
          return null;
        }
      },
    },
    {
      title: "Distance to go",
      key: "mtd_distance_to_go",

      dataIndex: "mtd_distance_to_go",
      render: (text, record) => record.expandedData?.[0]?.mtd_distance_to_go,
    },
    {
      title: "Distance Travelled",
      key: "mtd_distance_travelled",

      dataIndex: "mtd_distance_travelled",
      render: (text, record) =>
        record.expandedData?.[0]?.mtd_distance_travelled,
    },
    {
      title: "Average Speed",
      key: "mtd_awg_speed",

      dataIndex: "mtd_awg_speed",
      render: (text, record) => record.expandedData?.[0]?.mtd_awg_speed,
    },
    {
      title: "Maximum Speed",
      key: "mtd_max_speed",

      dataIndex: "mtd_max_speed",
      render: (text, record) => record.expandedData?.[0]?.mtd_max_speed,
    },
  ];

  const filteredData = data
    .filter((item) => {
      const filteredExpandedData = item.expandedData.filter((expandedItem) => {
        return expandedItem.mtd_key === clickedRowData;
      });
      return (
        filteredExpandedData.length > 0 &&
        filteredExpandedData[0].mtd_max_speed !== null
      );
    })
    .map((item) => {
      const filteredExpandedData = item.expandedData.filter((expandedItem) => {
        return expandedItem.mtd_key === clickedRowData;
      });
      return {
        ...item,
        expandedData: filteredExpandedData,
      };
    });

  return (
    <>
      <div>
        <PageHeader
          title="Merchant Vessel"
          showButton={false}
          showSearchBox={false}
        />
      </div>

      <div className="mb-4 descriptionTable">
        <Descriptions
          // size="middle"
          size="small"
          bordered={true}
          colon={true}
          borderColor="transparent"
          column={{ xs: 1, sm: 2, md: 2, lg: 3 }}
        >
          {items.map((item, index) => (
            <Descriptions.Item
              key={index}
              className="flex-container justify-between "
            >
              <Row className="flex">
                <Col span={8} className="flex justify-start  ">
                  <div className="descriptionLabel  ">{item.label}</div>
                </Col>
                <Col
                  span={14}
                  className="flex justify-end  "
                  style={{
                    marginLeft: "-15px",
                  }}
                >
                  <div className="descriptionChildren mr-5">
                    {item.children}
                  </div>
                </Col>
              </Row>
              {/* </div> */}
            </Descriptions.Item>
          ))}
        </Descriptions>
      </div>

      <div className="flex mb-4">
        <Heading
          className="whitespace-nowrap ml-5 "
          level={5}
          text="Last/Current Port"
        />
      </div>
      <section>
        <AntdTable
          scrollConfig={{ x: true }}
          pagination={true}
          columns={columns}
          data={data.length > 0 ? [data[0]] : []}
          expandable={{
            // expandedRowRender,
            // defaultExpandedRowKeys: ["0"],
            expandedRowRender: (record, index) =>
              expandedRowRender(record, index, 1),
            defaultExpandedRowKeys: ["0"],
          }}
        />
      </section>

      <div className="flex mb-4">
        <Heading className="whitespace-nowrap ml-5 " level={5} text="History" />
      </div>
      <section className="mb-10">
        <AntdTable
          scrollConfig={{ x: true }}
          pagination={true}
          columns={columns}
          data={data}
          expandable={{
            // expandedRowRender,
            // defaultExpandedRowKeys: ["0"],
            expandedRowRender: (record, index) =>
              expandedRowRender(record, index, 0),
            defaultExpandedRowKeys: ["0"],
          }}
        />
      </section>

      <div className="descriptionTable">
        <Modal
          width={"85%"}
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
        >
          <Heading
            className="whitespace-nowrap ml-1"
            level={4}
            text="Observations"
          />
          <Descriptions
            size="small"
            className="p-2"
            bordered={true}
            colon={true}
            borderColor="transparent"
            column={{ xs: 1, sm: 2, md: 2, lg: 3 }}
          >
            {filteredData.map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                {expandedDetailColumns.map((column, colIndex) => (
                  <Descriptions.Item
                    key={colIndex}
                    className="flex-container justify-between  "
                    // Conditionally set the colspan for the last column
                    span={
                      colIndex === expandedDetailColumns.length - 1
                        ? 1
                        : undefined
                    }
                  >
                    <Row className="flex ">
                      <Col span={10} className="flex justify-start  ">
                        <div className="descriptionLabel">{column.title}</div>
                      </Col>
                      <Col
                        span={14}
                        className=" flex justify-end  "
                        style={{
                          marginLeft: "-5px",
                        }}
                      >
                        <div className="descriptionChildren mr-5">
                          {column.render(null, {
                            expandedData: row.expandedData,
                          })}
                        </div>
                      </Col>
                    </Row>
                  </Descriptions.Item>
                ))}
              </React.Fragment>
            ))}
          </Descriptions>
        </Modal>
      </div>
    </>
  );
}

export default Details;

export async function getServerSideProps(context) {
  const { id } = context.query;

  try {
    // Fetching data from the backend API based on the 'id' parameter
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/merchant_vessels/${id}`
    );

    if (response.status === 200) {
      const data = response.data;

      // Fetch additional details for each row using mt_key
      const expandedDataPromises = data.map(async (row) => {
        const expandedRowResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/merchant_vessels/${row.mt_mv_key}/${row.mt_key}`
        );

        if (expandedRowResponse.status === 200) {
          return expandedRowResponse.data;
        }
        return null;
      });

      // Wait for all expanded data promises to resolve
      const expandedData = await Promise.all(expandedDataPromises);

      // Add the expandedData to each row in the data array
      const dataWithExpandedData = data.map((row, index) => ({
        ...row,
        expandedData: expandedData[index],
      }));

      return {
        props: {
          data: dataWithExpandedData,
        },
      };
    }
  } catch (error) {
    return {
      redirect: {
        permanent: false,
        destination: "/404",
      },
      props: {},
    };
  }
}
