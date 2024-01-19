import React, { useState } from "react";
import { Table, Tooltip } from "antd";
import PageHeader from "../../src/components/pageheader/pageHeader";
import axios from "axios";
import { decimalToDMS } from "../../src/helper/position";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import Heading from "../../src/components/title/Heading";
import { MerVesselColumn } from "../../src/helper/DataColumns";

function Details({ data }) {
  const router = useRouter();

  // Retrieve merchant vessel details from the query parameter
  const { id, vessel } = router.query;
  const parsedVesselData = JSON.parse(vessel);
  const Macrocolumns = [...MerVesselColumn];

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
      { title: "Average Speed", dataIndex: "mtd_awg_speed" },
      {
        title: "Heading",
        dataIndex: "mtd_heading",
      },
      {
        title: "Status",
        dataIndex: "mtd_status",
      },
      {
        title: "Course",
        dataIndex: "mtd_course",
      },
      {
        title: "Time Stamp",
        dataIndex: "mtd_timestamp",
        width: 150,
        ellipsis: true,
        render: (text) => {
          const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
          return dtg;
        },
      },
      {
        title: "Draught",
        dataIndex: "mtd_draught",
      },
      {
        title: "Distance To Go",
        dataIndex: "mtd_distance_to_go",
      },
      {
        title: "Distane Travelled",
        dataIndex: "mtd_distance_travelled",
      },
    ];
    return (
      <Table
        columns={columns}
        dataSource={record.expandedData}
        pagination={true}
      />
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
    // {
    //   title: "Details",
    //   dataIndex: "mt_key",
    //   // key: "mtd_key",/
    //   ellipsis: {
    //     showTitle: false,
    //   },
    //   render: (text, record) => (
    //     <Tooltip placement="topLeft" >
    //       <a
    //         className="text-midnight font-semibold"
    //         onClick={() => handleExpandRow(record.key)}
    //       >
    //         View
    //       </a>
    //     </Tooltip>
    //   ),
    // },
  ];

// const handleExpandRow = (key) => {
//   console.log(key);
//   setExpandedRowKeys((prevKeys) =>
//     prevKeys.includes(key)
//       ? prevKeys.filter((k) => k !== key)
//       : [...prevKeys, key]
//   );
// };


  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  return (
    <>
      <PageHeader
        title="Merchant Vessel Trip Details"
        showButton={false}
        showSearchBox={false}
      />
      <header className="flex">
        <Heading level={4} text="Vessel Details" />
      </header>
      <Table columns={Macrocolumns} dataSource={[parsedVesselData]} />
      <header className="flex">
        <Heading level={4} text="Trip Details" />
      </header>
      <Table
        pagination={true}
        columns={columns}
        dataSource={data}
        expandable={{
          expandedRowRender,
          defaultExpandedRowKeys: ["0"],
        }}
        // expandedRowRender={expandedRowRender}
        // expandable={{
        //   expandedRowKeys,
        //   onExpand: (expanded, record) => {
        //     if (expanded) {
        //       handleExpandRow(record.key);
        //     } else {
        //       handleExpandRow(null);
        //     }
        //   },
        // }}
        size="middle"
      />
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
