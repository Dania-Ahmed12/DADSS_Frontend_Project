import React from "react";
import Heading from "../../src/components/title/Heading";
import AntdTable from "../../src/components/table/AntdTable";
import axios from "axios";
import { shipBreakColumns } from "../../src/helper/DataColumns";
import PageHeader from "../../src/components/pageheader/pageHeader";
import TableItemRenderer from "../../src/components/table/RenderTable";
import dayjs from "dayjs";
import { Col, Descriptions, Row } from "antd";


  const ShippingDetailcolumns = [
    ...shipBreakColumns,
    {
      title: "Master Name",
      dataIndex: "sb_mast_name",
    },
    {
      title: "Buyer Company Name",
      dataIndex: "sb_buyer_comp_name",
    },
    {
      title: "Owner Name",
      dataIndex: "sb_owner_name",
    },
    {
      title: "Localshipping Company Name",
      dataIndex: "sb_locshipping_comp_name",
    },
    {
      title: "Localshipping Agent Name",
      dataIndex: "sb_locshipping_agent_name",
    },
    {
      title: "Ship flag Registry Certificate",
      dataIndex: "sb_flag_reg_cert",
      render: (value) => (value ? "Yes" : "No"),
    },
    {
      title: "Memorandum of Agreement",
      dataIndex: "sb_agreement_memo",
      render: (value) => (value ? "Yes" : "No"),
    },
    {
      title: "Letter of Credit",
      dataIndex: "sb_credit_let",

      render: (value) => (value ? "Yes" : "No"),
    },
    {
      title: "Master Nationality",
      dataIndex: "sb_mast_nationality",
    },
    {
      title: "Buyer Company Cell Number",
      dataIndex: "sb_buyer_comp_num",
    },
    {
      title: "Owner Cell Name",
      dataIndex: "sb_owner_name",
    },
    {
      title: "Agent  Number",
      dataIndex: "sb_locshipping_agent_num",
    },
    {
      title: "Any Security Team",
      dataIndex: "sb_sec_team",
      render: (value) => (value ? "Yes" : "No"),
    },
    {
      title: "Any Hazardeous Material",
      dataIndex: "sb_haz_material",
      render: (value) => (value ? "Yes" : "No"),
    },
    {
      title: "Gas Free Certicate",
      dataIndex: "sb_gas_free_cert",
      render: (value) => (value ? "Yes" : "No"),
    },

    {
      title: "Nuclear Waste Free Certificate",
      dataIndex: "sb_waste_free_cert",
      render: (value) => (value ? "Yes" : "No"),
    },
    {
      title: "Import General Manifest",
      dataIndex: "sb_import_gen_manifest",
      render: (value) => (value ? "Yes" : "No"),
    },
    {
      title: "Communciation Equipment List",
      dataIndex: "sb_comm_equip_list",
      render: (text) => (
        <div style={{ width: "100%" }}>
          {text &&
            text.map((value, index) => (
              <span key={value}>
                {index > 0 && " "} {value}
                {index < text.length - 1 && " , "}{" "}
              </span>
            ))}
        </div>
      ),
    },
    {
      title: "Good Deceleration Certificate",
      dataIndex: "sb_goods_dec_doc",
      render: (value) => (value ? "Yes" : "No"),
    },
    {
      title: "Deletion Certificate",
      dataIndex: "sb_del_cert",
      render: (value) => (value ? "Yes" : "No"),
    },
    {
      title: "ISO Certificate",
      dataIndex: "sb_iso_cert",
      render: (value) => (value ? "Yes" : "No"),
    },
    {
      title: "Total number of crew onboard",
      dataIndex: "sb_crew",
    },
  ];

function transposeData(data) {
  if (!data || data.length === 0) return [];

  const transposedData = [];
  ShippingDetailcolumns.forEach((column) => {
    let value = data[0][column.dataIndex];
    // Convert boolean values to "Yes" or "No"
    if (typeof value === "boolean") {
      value = value ? "Yes" : "No";
    }
    // Format date values using dayjs
  if (typeof value === "string" && value.includes("T")) {
    // Parse the value into a Date object
    const dateObj = new Date(value);
    // Extract the desired parts
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Month is zero-based, so we add 1
    const date = String(dateObj.getDate()).padStart(2, "0");
    const hour = String(dateObj.getHours()).padStart(2, "0");
    const minute = String(dateObj.getMinutes()).padStart(2, "0");
    const second = String(dateObj.getSeconds()).padStart(2, "0");
    // Construct the formatted date string
    value = `${year}-${month}-${date} ${hour}:${minute}:${second}`;
  }
    transposedData.push({
      Field: column.title,
      Value: value,
    });
  });

  return transposedData;
}



function RegisteredShipBreakDetails({ data }) {
console.log(data)

  // Map vesselcolumns to extract label and children
  // const items = ShippingDetailcolumns.map((column) => {
    
  //   let value = data[0][column.dataIndex];
  //   console.log(value)

  //   // Convert boolean values to "Yes" or "No"
  //   if (typeof value === "boolean") {
  //     value = value ? "Yes" : "No";
  //   }

  //   return {
  //     label: column.title,
  //     children:
  //       column.dataIndex === "sb_dtg" // Check if the current label is "Registered ON"
  //         ? dayjs(data[column.dataIndex]).format("YYYY-MM-DD HH:mm:ss") // Format the date if it's "Registered ON"
  //         : value, // Otherwise, use the value as it is
  //   };
  // });
  const items = [
    // Include fields from merchant_vessel object
    { label: "IMO", children: data[0].merchant_vessel.mv_imo },
    { label: "Ship Name", children: data[0].merchant_vessel.mv_ship_name },
    { label: "Flag", children: data[0].merchant_vessel.mv_flag },
    {
      label: "Vessel Type",
      children: data[0].merchant_vessel.mv_ais_type_summary,
    },
    // Include fields from ShippingDetailcolumns
    ...ShippingDetailcolumns.map((column) => {
      let value = data[0][column.dataIndex];
      // Convert boolean values to "Yes" or "No"
      if (typeof value === "boolean") {
        value = value ? "Yes" : "No";
      }
      return {
        label: column.title,
        children:
          column.dataIndex === "sb_dtg" // Check if the current label is "Registered ON"
            ? dayjs(data[0][column.dataIndex]).format("YYYY-MM-DD HH:mm:ss") // Format the date if it's "Registered ON"
            : value, // Otherwise, use the value as it is
      };
    }),
  ];


  // Define crew table
  const CrewDetails = [
    { title: "Crew Name", dataIndex: "sbc_name" },
    { title: "Crew Nationality", dataIndex: "sbc_nationality" },
  ];

  const tableItems = [
    {
      title: "Crew Details",
      columns: CrewDetails,
      data: data[0]?.shipbreakingcrew,
      pagination: false,
    },
  ];

  const scrollConfig = {
    y: true, // Enable vertical scrolling
  };

  // return (
  //   <div>
  //     <PageHeader showSearchBox={false} title="Ship Breaking Report Details" />
  //     <div className=" mt-4 flex">
  //       <Heading className="ml-5 " level={5} text="Ship Break Details" />
  //     </div>
  //     <section
  //       // style={{ maxHeight: "1000px" }}
  //       className=" mb-10"
  //     >
  //       <div style={{ maxHeight: "500px" }}>
  //         {/* Display transposed data */}
  //         <AntdTable
  //           scroll={{ x: 1500, y: 300 }}
  //           columns={transposedColumns}
  //           data={transposedData}
  //           pagination={false}
  //         />
  //       </div>
  //     </section>
  //     <section>
  //       {/* Display crew details */}
  //       {tableItems.map((item, index) => (
  //         <TableItemRenderer
  //           key={index}
  //           title={item.title}
  //           columns={item.columns}
  //           data={item.data}
  //           pagination={true}
  //         />
  //       ))}
  //     </section>
  //   </div>
  // );
  return (
    <div>
      <PageHeader showSearchBox={false} title="Ship Breaking Report Details" />
      <div className="mt-4 flex">
        <Heading
          className="whitespace-nowrap ml-5"
          level={5}
          text="Ship Break Details"
        />
      </div>
      <section className="mb-10">
        <div>
          {/* <Descriptions
            size="large"
            className="mt-1 ml-4 mr-4 descriptionTable"
            bordered={true}
            column={{ xs: 1, sm: 2, md: 2, lg: 2 }}
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
                  <Col span={10} className="flex justify-start  ">
                    <div className="descriptionLabel ">{item.label}</div>
                  </Col>
                  <Col span={14} className="flex justify-end">
                    <div className="descriptionChildren ml-5">
                      {item.children}
                    </div>
                  </Col>
                </Row>
                {/* </div> */}
              </Descriptions.Item>
            ))}
          </Descriptions>
        </div>
      </section>
      <section>
        {/* Display crew details */}
        {tableItems.map((item, index) => (
          <div key={index}>
            <TableItemRenderer
              title={item.title}
              columns={item.columns}
              data={item.data}
              pagination={true}
            />
          </div>
        ))}
      </section>
    </div>
  );
}

export default RegisteredShipBreakDetails;

export async function getServerSideProps(context) {
  const { id } = context.query;

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/ship_breaking/${id}`
    );
    if (response.status === 200) {
      return {
        props: {
          data: [response.data],
          title: `Registered Ship Break Details ${id}`,
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
