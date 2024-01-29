import React, { useState } from "react";
import styled from "styled-components";
import { Tooltip, theme } from "antd";
import PageHeader from "../../src/components/pageheader/pageHeader";
import axios from "axios";
import { decimalToDMS } from "../../src/helper/position";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import Heading from "../../src/components/title/Heading";
import { MerVesselColumn } from "../../src/helper/DataColumns";
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
  const Macrocolumns = [...MerVesselColumn];
  // Transpose the data
  const transposedData = Macrocolumns.map((column) => ({
    Field: column.title,
    Value: parsedVesselData[column.dataIndex],
  }));

  const expandedRowRender = (record) => {
    const columns = [
      {
        title: "Longitude",
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
        dataIndex: "mtd_speed",
      },
      {
        title: "Heading",
        dataIndex: "mtd_heading",
      },
      {
        title: "Time Stamp",
        dataIndex: "mtd_timestamp",
        ellipsis: true,
        render: (text) => {
          const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
          return dtg;
        },
      },
      {
        title: "Details",
        dataIndex: "mtd_key",
        ellipsis: {
          showTitle: false,
        },
        render: (text, record) => (
          <div 
          // >
            // {/* <a */}
              className="text-midnight font-semibold custom-a"
              onClick={() => {
                console.log(record.mtd_key); // Log the expanded data to see its structure
                setClickedRowData(record.mtd_key);
                setModalVisible(true);
              }}
            >
              View
            {/* </a> */}
          </div>
        ),
      },
    ];
    return (
      <ExpandedTableBody>
        <AntdTable
          components={{
            body: {
              wrapper: ExpandedTableBody, // Use the styled component here
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
  };

  const columns = [
    {
      title: "DSRC",
      dataIndex: "mt_dsrc",
    },
    {
      title: "Destination",
      dataIndex: "mt_destination",
    },
    {
      title: "ETA",
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
      dataIndex: "mt_observed_duration",
    },
    {
      title: "Trip Status",
      dataIndex: "mt_trip_status",
    },
  ];

  const expandedDetailColumns = [
    { title:"key",
      dataIndex:"mtd_key",
      render: (text, record) => record.expandedData?.[0]?.mtd_key },
    {
      title: "Longitude",
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
      dataIndex: "mtd_speed",
      render: (text, record) => record.expandedData?.[0]?.mtd_speed,
    },
    {
      title: "Heading",
      dataIndex: "mtd_heading",
      render: (text, record) => record.expandedData?.[0]?.mtd_heading,
    },
    {
      title: "Status",
      dataIndex: "mtd_status",
      render: (text, record) => record.expandedData?.[0]?.mtd_status,
    },
    {
      title: "Course",
      dataIndex: "mtd_course",
      render: (text, record) => record.expandedData?.[0]?.mtd_course,
    },

    // {

    //   title: "Timestamp ",
    //   dataIndex: "mtd_timestamp",
    //   render: (text, record) => {
    //     const time = record.expandedData?.[0]?.mtd_timestamp;
    //     const dtg = dayjs(time).format("YYYY-MM-DD HH:mm:ss");
    //     return dtg;
    //   },
    // },
    {
      title: "Timestamp",
      dataIndex: "mtd_timestamp",
      render: (text, record) => {
        if (record.expandedData && record.expandedData.length > 0) {
          const time = record.expandedData[0].mtd_timestamp;
          const dtg = dayjs(time).format("YYYY-MM-DD HH:mm:ss");
          return dtg;
        }
        return null; // or any default value if timestamp data is not available
      },
    },
    // {
    //   title: "UTC Seconds",
    //   dataIndex: "mtd_utc_seconds",
    //   render: (text, record) => record.expandedData?.[0]?.mtd_utc_seconds,
    // },

    {
      title: "Draught",
      dataIndex: "mtd_draught",
      render: (text, record) => record.expandedData?.[0]?.mtd_draught,
    },
    {
      title: "ROT",
      dataIndex: "mtd_rot",
      render: (text, record) => record.expandedData?.[0]?.mtd_rot,
    },

    // {
    //   title: "Last Port",
    //   dataIndex: "mtd_last_port",
    //   render: (text, record) => record.expandedData?.[0]?.mtd_last_port,
    // },
    // {
    //   title: "Last Port Unlocode",
    //   dataIndex: "mtd_last_port_unlocode",
    //   render: (text, record) =>
    //     record.expandedData?.[0]?.mtd_last_port_unlocode,
    // },
    // {
    //   title: "Last Port Country",
    //   dataIndex: "mtd_last_port_country",
    //   render: (text, record) => record.expandedData?.[0]?.mtd_last_port_country,
    // },

    // {
    //   title: "Last Port Time",
    //   dataIndex: "mtd_last_port_time",
    //   render: (text, record) => {
    //     if (record.expandedData && record.expandedData.length > 0) {
    //       const time = record.expandedData[0].mtd_last_port_time;
    //       const dtg = dayjs(time).format("YYYY-MM-DD HH:mm:ss");
    //       return dtg;
    //     }
    //     return null; // or any default value if timestamp data is not available
    //   },
    // },
    // {
    //   title: "Current Port",
    //   dataIndex: "mtd_current_port",
    //   render: (text, record) => record.expandedData?.[0]?.mtd_current_port,
    // },
    // {
    //   title: "Current Port Unlocode",
    //   dataIndex: "mtd_current_port_unlocode",
    //   render: (text, record) =>
    //     record.expandedData?.[0]?.mtd_current_port_unlocode,
    // },
    // {
    //   title: "Current Port Country",
    //   dataIndex: "mtd_current_port_country",
    //   render: (text, record) =>
    //     record.expandedData?.[0]?.mtd_current_port_country,
    // },
    // {
    //   title: "Next Port",
    //   dataIndex: "mtd_next_port_name",
    //   render: (text, record) => record.expandedData?.[0]?.mtd_next_port_name,
    // },
    // {
    //   title: "Next Port Unlocode",
    //   dataIndex: "mtd_next_port_unlocode",
    //   render: (text, record) =>
    //     record.expandedData?.[0]?.mtd_next_port_unlocode,
    // },
    // {
    //   title: "Next Port Country",
    //   dataIndex: "mtd_next_port_country",
    //   render: (text, record) => record.expandedData?.[0]?.mtd_next_port_country,
    // },

    // {
    //   title: "ETA Calculated",
    //   dataIndex: "mtd_eta_calc",
    //   render: (text, record) => {
    //     if (record.expandedData && record.expandedData.length > 0) {
    //       const time = record.expandedData[0].mtd_eta_calc;
    //       const dtg = dayjs(time).format("YYYY-MM-DD HH:mm:ss");
    //       return dtg;
    //     }
    //     return null; // or any default value if timestamp data is not available
    //   },
    // },

    // {
    //   title: "ETA Updated",
    //   dataIndex: "mtd_eta_updated",
    //   render: (text, record) => {
    //     if (record.expandedData && record.expandedData.length > 0) {
    //       const time = record.expandedData[0].mtd_eta_updated;
    //       const dtg = dayjs(time).format("YYYY-MM-DD HH:mm:ss");
    //       return dtg;
    //     }
    //     return null; // or any default value if timestamp data is not available
    //   },
    // },
    {
      title: "Distance to go",
      dataIndex: "mtd_distance_to_go",
      render: (text, record) => record.expandedData?.[0]?.mtd_distance_to_go,
    },
    {
      title: "Distance Travelled",
      dataIndex: "mtd_distance_travelled",
      render: (text, record) =>
        record.expandedData?.[0]?.mtd_distance_travelled,
    },
    // {
    //   title: "Average Speed",
    //   dataIndex: "mtd_awg_speed",
    //   render: (text, record) => record.expandedData?.[0]?.mtd_awg_speed,
    // },
    // {
    //   title: "Maximum Speed",
    //   dataIndex: "mtd_max_speed",
    //   render: (text, record) => record.expandedData?.[0]?.mtd_max_speed,
    // },
  ];

  const filteredData = data.map((item) => {
    console.log(item);
    console.log(item.expandedData.map((expandedItem) => expandedItem.mtd_key));

    const filteredExpandedData = item.expandedData.filter((expandedItem) => {
      return expandedItem.mtd_key === clickedRowData;
    });

    filteredExpandedData.map((expandedItem) => {
      console.log(expandedItem.mtd_key);
      console.log(expandedItem);
      console.log(expandedItem[3])
    });

    return {
      ...item,
      expandedData: filteredExpandedData,
    };
  });

  // console.log(data.[3].mtd_timestamp)
const {
  token: { rowExpandedBg, rowHoverBg },
} = theme.useToken();
const ExpandedRow = styled.div`
  background-color: ${(props) => rowExpandedBg};
  background: #e6f7ff !important;
`;
  return (
    <>
      <div>
        <PageHeader
          title="Merchant Vessel"
          showButton={false}
          showSearchBox={false}
        />
      </div>
      <div className="mb-4">
        <AntdTable
          scrollConfig={{ x: true }}
          pagination={false}
          columns={[
            { title: "Field", dataIndex: "Field" },
            { title: "Value", dataIndex: "Value" },
          ]}
          data={transposedData}
        />
      </div>

      <div className="mt-10">
        <div className="flex">
          <Heading className="ml-5 " level={5} text="Trip Details" />
        </div>
        <AntdTable
          scrollConfig={{ x: true }}
          pagination={true}
          columns={columns}
          data={data}
          expandable={{
            expandedRowRender,
            defaultExpandedRowKeys: ["0"],
          }}
        />
      </div>
      <div>
        <Modal
          width={"70%"}
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
        >
            <AntdTable
              pagination={false}
              className="customize-antTable" // Use the className prop here
              scrollConfig={{ x: true }}
              columns={expandedDetailColumns}
              data={filteredData}
            />
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
