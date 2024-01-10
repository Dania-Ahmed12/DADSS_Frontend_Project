import {
  Row,
  Table,
  Tooltip,
} from "antd";
import React from "react";
import { RxArrowLeft } from "react-icons/rx";
import Heading from "../../src/components/title/Heading";
import { useRouter } from "next/router";
import axios from "axios";
import dayjs from "dayjs";
import {  decimalToDMS } from "../../src/helper/position";
import { Missioncolumns } from "../../src/helper/DataColumns";
import PageHeader from "../../src/components/pageheader/pageHeader";
import TableItemRenderer from "../../src/components/table/RenderTable";

function MissDetails({ data }) {
  const ownMissionDataFormColumns = [...Missioncolumns];
  const missionDetailsDataColumns = [
    {
      title: "MMSI",
      dataIndex: "mrd_mmsi",
      ellipsis: true,
    },
    {
      title: "Longitude",
      dataIndex: "mrd_long",
      ellipsis: true,
      render: (text, record) => {
        if (record.mrd_position) {
          var val = record.mrd_position.coordinates[0];
          const longitude = decimalToDMS(val, 0);
          return (
            <Tooltip placement="topLeft" title={val.toFixed(4)}>
              {longitude}
            </Tooltip>
          );
        }
      },
    },
    {
      title: "Latitude",
      dataIndex: "mrd_lat",
      ellipsis: true,
      render: (text, record) => {
        if (record.mrd_position) {
          var val = record.mrd_position.coordinates[1];
          const latitude = decimalToDMS(val, 0);
          return (
            <Tooltip placement="topLeft" title={val.toFixed(4)}>
              {latitude}
            </Tooltip>
          );
        }
      },
    },
    {
      title: "Course",
      dataIndex: "mrd_course",
      ellipsis: true,
    },

    {
      title: "Speed",
      dataIndex: "mrd_speed",
      ellipsis: true,
    },
    {
      title: "Vessel Name",
      dataIndex: "mrd_vessel_name",
      ellipsis: true,
    },

    {
      title: "NPOC",
      dataIndex: "mrd_npoc",
      ellipsis: true,
    },

    {
      title: "LPOC",
      dataIndex: "mrd_lpoc",
      ellipsis: true,
    },

    {
      title: "Activity Description",
      dataIndex: "mrd_act_desc",
      ellipsis: true,
    },

    {
      title: "AIS Status",
      dataIndex: "mrd_ais_status",
      ellipsis: true,
    },

    {
      title: "Call Details",
      dataIndex: "mrd_call_details",
      ellipsis: true,
    },

    {
      title: "Response",
      dataIndex: "mrd_response",
      ellipsis: true,
    },

    {
      title: "Remarks",
      dataIndex: "mrd_remarks",
      ellipsis: true,
    },

    {
      title: "Vessel Type",
      dataIndex: "mrd_vessel_type",
    },

    {
      title: "Date Time",
      dataIndex: "mrd_dtg",
      ellipsis: true,
      render: (text) => {
        const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
        return dtg;
      },
    },
  ];

  const tableItems = [
    {
      title: "Mission Report Details",

      columns: missionDetailsDataColumns,
      data: data?.missionreportdetails,
    },
  ];

  return (
    <div className="mx-2">
      <PageHeader showSearchBox={false} title="Report Details" />

        <header className="flex">
        <Heading level={4} text="Mission Report" />
      </header>
      <section className="shadow border-tableborder border-2 mb-12 rounded-md">
        <Table
          columns={ownMissionDataFormColumns}
          dataSource={[data]}
          pagination={false}
          scroll={{ x: "auto" }} // Set the scroll property as per your requirements
        />
      </section>
      {tableItems.map((item, index) => {
        return (
          // <div key={index}>
          //   <header className="flex">
          //     <Heading level={4} text={item.title} />
          //   </header>
          //   <div className="mb-12">
          //     <Table
          //       columns={item.columns}
          //       dataSource={item.data}
          //       scroll={{ x: "auto" }} // Set the scroll property as per your requirements
          //     />
          //   </div>
          // </div>
          <TableItemRenderer
            key={index}
            title={item.title}
            columns={item.columns}
            data={item.data}
            pagination={item.pagination}
          />
        );
      })}
    </div>
  );
}

export default MissDetails;
export async function getServerSideProps(context) {
  const { id } = context.query;
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/misrep/${id}`
    );
    if (response.status === 200) {
      return {
        props: {
          data: response.data,
          title: `Intel Report Details (${id})`,
        },
      };
    }
  } catch {
    return {
      redirect: {
        permanent: false,
        destination: "/404",
      },
      props: {},
    };
  }
}
