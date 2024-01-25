import React from "react";
import Heading from "../../src/components/title/Heading";
import AntdTable from "../../src/components/table/AntdTable";
import axios from "axios";
import { shipBreakColumns } from "../../src/helper/DataColumns";
import PageHeader from "../../src/components/pageheader/pageHeader";
import TableItemRenderer from "../../src/components/table/RenderTable";
import dayjs from "dayjs";
import styled from "styled-components";


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
    if (
      typeof value === "string" &&
      value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/)
    ) {
      value = dayjs(value).format("YYYY-MM-DD HH:mm:ss");
    }
    transposedData.push({
      Field: column.title,
      Value: value,
    });
  });

  return transposedData;
}



function RegisteredShipBreakDetails({ data }) {
  // Prepare transposed data
  const transposedData = transposeData(data);

  // Define columns for transposed data table
  const transposedColumns = [
    { title: "Data", dataIndex: "Field" },
    { title: "Value", dataIndex: "Value" },
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
         <Heading className="ml-5" level={5} text="Ship Break Details" />
       </div>
       <section className="mb-10">
         <div>
           {/* Display transposed data */}
           <AntdTable
           
              scrollConfig={{ y: '325px' }} // Adjust x-scroll as needed
             columns={transposedColumns}
             data={transposedData}
             pagination={false}
           />
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
