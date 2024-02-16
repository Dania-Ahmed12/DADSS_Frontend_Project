import { Col, Descriptions, Image, Row } from "antd";
import React from "react";
import Heading from "../../src/components/title/Heading";
import axios from "axios";
import dayjs from "dayjs";
import { IntelColumns } from "../../src/helper/DataColumns";
import PageHeader from "../../src/components/pageheader/pageHeader";
import TableItemRenderer from "../../src/components/table/RenderTable";

function IntelDetails({ data }) {
  // Map vesselcolumns to extract label and children
  const items = [
    {
      label: "Platform ID",
      children: data?.ir_pf_id || "",
    },
    {
      label: "Reporter Name",
      children: data?.ir_reporter_name || "",
    },
    {
      label: "Reporting Time ",
      children:
        dayjs(data?.ir_reporting_time).format("YYYY-MM-DD HH:mm:ss") || "",
    },
    {
      label: "Jetty",
      children: data?.ir_jetty || "",
    },
    {
      label: "Total Boats",
      children: data?.ir_total_boats || "",
    },
  ];
  const jettyDataColumns = [
    {
      title: "Type of Boat",
      ellipsis: false,
      width: 250,
      key: "ird_boat_types",
      dataIndex: "ird_boat_types",
    },
    {
      title: "No. of Boats",
      ellipsis: false,
      width: 250,

      dataIndex: "ird_total_boats",
      key: "ird_total_boats",
    },

    {
      title: "Detected From",
      ellipsis: false,
      width: 250,
      key: "ird_detected_from",

      dataIndex: "ird_detected_from",
      render: (text) => {
        const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
        return dtg;
      },
    },

    {
      title: "Detected To",
      ellipsis: false,
      width: 250,
      key: "ird_detected_to",

      dataIndex: "ird_detected_to",
      render: (text) => {
        const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
        return dtg;
      },
    },

    {
      title: "Action Observed",
      ellipsis: false,
      width: 250,
      key: "ird_act_observed",

      dataIndex: "ird_act_observed",
    },

    {
      title: "Transferring",
      ellipsis: false,
      width: 250,
      key: "ird_transferring_loc",

      dataIndex: "ird_transferring_loc",
    },

    {
      title: "Probability",
      ellipsis: false,
      width: 250,
      key: "ird_probability",

      dataIndex: "ird_probability",
    },
    {
      title: "Picture",
      ellipsis: false,
      width: 250,
      key: "ird_boat_picture",

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
      ellipsis: false,
      width: 250,
      key: "ird_nakwa_name",

      dataIndex: "ird_nakwa_name",
    },

    {
      title: "Owner Name",
      ellipsis: false,
      width: 250,
      key: "ird_owner_name",

      dataIndex: "ird_owner_name",
    },

    {
      title: "No. of Crew",
      ellipsis: false,
      width: 250,
      key: "ird_number_of_crew",

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
    <div>
      <PageHeader showSearchBox={false} title="Intel Report " />
      <div className="mt-4 flex">
        <Heading
          className="whitespace-nowrap ml-5 "
          level={5}
          text="Macro Data"
        />
      </div>
      <section className="mb-10">
        {/* <Descriptions
          size="middle"
          className="mt-5 ml-4 mr-4 descriptionTable"
          bordered={true}
          column={{ xs: 1, sm: 2, md: 3, lg: 3 }}
        >
          {items.map((item, index) => (
            <Descriptions.Item key={index} label={item.label}>
              {item.children}
            </Descriptions.Item>
          ))}
        </Descriptions> */}
        <Descriptions
          size="small"
          className="p-2"
          bordered={true}
          colon={true}
          borderColor="transparent"
          column={{ xs: 1, sm: 2, md: 2, lg: 3 }}
        >
          {items.map((item, index) => (
            <Descriptions.Item
              key={index}
              className="flex-container justify-between "
              span={index === items.length - 1 ? 1 : undefined}
            >
              <Row className="flex">
                <Col span={10} className="flex justify-start ">
                  <div className="descriptionLabel ">{item.label}</div>
                </Col>
                <Col
                  span={14}
                  className="flex justify-end"
                  style={{
                    // marginLeft: "1px",
                  }}
                >
                  <div className="descriptionChildren mr-5 ">
                    {item.children}
                  </div>
                </Col>
              </Row>
              {/* </div> */}
            </Descriptions.Item>
          ))}
        </Descriptions>
      </section>
      {tableItems.map((item, index) => {
        return (
          <TableItemRenderer
            key={index}
            title={item.title}
            columns={item.columns}
            data={item.data}
            pagination={true}
            scrollConfig={{ x: true }} // Adjust x-scroll as needed
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
