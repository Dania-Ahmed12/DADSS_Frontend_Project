import {
  Image,
  Row,
  Table,
} from "antd";
import React from "react";
import Heading from "../../src/components/title/Heading";
import { useRouter } from "next/router";
import axios from "axios";
import dayjs from "dayjs";
import { IntelColumns } from "../../src/helper/DataColumns";
import PageHeader from "../../src/components/pageheader/pageHeader";
import TableItemRenderer from "../../src/components/table/RenderTable";

function IntelDetails({ data }) {

  const ownMacroDataFormColumns = [...IntelColumns];

  const jettyDataColumns = [
    {
      title: "Type of Boat",
      ellipsis: true,

      dataIndex: "ird_boat_types",
    },
    {
      title: "No. of Boats",
      ellipsis: true,

      dataIndex: "ird_total_boats",
    },

    {
      title: "Detected From",
      ellipsis: true,

      dataIndex: "ird_detected_from",
      render: (text) => {
        const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
        return dtg;
      },
    },

    {
      title: "Detected To",
      ellipsis: true,

      dataIndex: "ird_detected_to",
      render: (text) => {
        const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
        return dtg;
      },
    },

    {
      title: "Action Observed",
      ellipsis: true,

      dataIndex: "ird_act_observed",
    },

    {
      title: "Transferring",
      ellipsis: true,

      dataIndex: "ird_transferring_loc",
    },

    {
      title: "Probability",
      ellipsis: true,

      dataIndex: "ird_probability",
    },
    {
      title: "Picture",
      ellipsis: true,
      dataIndex: "ird_boat_picture",
      render: (text) =>
        text ? (
          <Image
            src={text}
            alt="Boat"
            style={{ maxWidth: "100px", maxHeight: "100px" }}
          />
        ) : (
          <span>No picture</span>
        ),
    },

    {
      title: "Name of Nakwa",
      ellipsis: true,

      dataIndex: "ird_nakwa_name",
    },

    {
      title: "Owner Name",
      ellipsis: true,

      dataIndex: "ird_owner_name",
    },

    {
      title: "No. of Crew",
      ellipsis: true,

      dataIndex: "ird_number_of_crew",
    },
  ];

  const tableItems = [
    {
      title: "Jetty Details",

      columns: jettyDataColumns,
      data: data?.intelreportdetails,
    },
  ];

  return (
    <div className="mx-2">
      <PageHeader showSearchBox={false} title="Report Details" />

      <header className="flex">
        <Heading level={4} text="Intel Report" />
      </header>
      <section className="shadow border-tableborder border-2 mb-12 rounded-md">
        <Table
          columns={ownMacroDataFormColumns}
          dataSource={[data]}
          pagination={false}
          scroll={{ x: "auto" }} // Set the scroll property as per your requirements
        />
      </section>
      {tableItems.map((item, index) => {
        return (
          <TableItemRenderer
            key={index}
            title={item.title}
            columns={item.columns}
            data={item.data}
            pagination={item.pagination}
          />
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
        );
      })}
    </div>
  );
}

export default IntelDetails;
export async function getServerSideProps(context) {
  const { id } = context.query;
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/ireport/${id}`
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
