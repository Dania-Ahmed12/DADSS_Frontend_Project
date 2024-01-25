import { Image } from "antd";
import React from "react";
import Heading from "../../src/components/title/Heading";
import axios from "axios";
import dayjs from "dayjs";
import { IntelColumns } from "../../src/helper/DataColumns";
import PageHeader from "../../src/components/pageheader/pageHeader";
import TableItemRenderer from "../../src/components/table/RenderTable";
import AntdTable from "../../src/components/table/AntdTable";





function IntelDetails({ data }) {
  const ownMacroDataFormColumns = [...IntelColumns];

    function transposeData(data) {
      if (!data) return [];

      const transposedData = [];
      transposedData.push({
        Field: "Platform ID",
        Value: data.ir_pf_id,
      });
      transposedData.push({
        Field: "Reporter Name",
        Value: data.ir_reporter_name,
      });

      transposedData.push({
        Field: "Reporting Time",
        Value: dayjs(data.ir_reporting_time).format("YYYY-MM-DD HH:mm:ss"),
      });

      transposedData.push({
        Field: "Jetty",
        Value: data.ir_jetty,
      });

      transposedData.push({
        Field: "Total Boats",
        Value: data.ir_total_boats,
      });

      return transposedData;
    }

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

  // Prepare transposed data
  const transposedData = transposeData(data);

  // Define columns for transposed data table
  const transposedColumns = [
    { title: "Data", dataIndex: "Field" },
    { title: "Value", dataIndex: "Value" },
  ];
  return (
    <div>
      <PageHeader showSearchBox={false} title="Intel Report " />
      <div className="mt-4 flex">
        <Heading className="ml-5 " level={5} text="Macro Data" />
      </div>
      <section className="mb-10">
        {/* <AntdTable
          columns={ownMacroDataFormColumns}
          data={[data]}
          pagination={false}
        /> */}
        <AntdTable
          // scrollConfig={{ y: "325px" }}
          columns={transposedColumns}
          data={transposedData} // Remove the square brackets
          pagination={false}
        />
      </section>
      {tableItems.map((item, index) => {
        return (
          <TableItemRenderer
            key={index}
            title={item.title}
            columns={item.columns}
            data={item.data}
            pagination={true}
            scrollConfig={{ x: "100%" }} // Adjust x-scroll as needed
          />
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
