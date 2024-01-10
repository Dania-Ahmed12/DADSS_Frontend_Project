import { Table } from "antd";
import React from "react";
import Heading from "../../src/components/title/Heading";
import AntdTable from "../../src/components/table/AntdTable";
import axios from "axios";
import { shipBreakColumns } from "../../src/helper/DataColumns";
import PageHeader from "../../src/components/pageheader/pageHeader";
import TableItemRenderer from "../../src/components/table/RenderTable";
function RegisteredShipBreakDetails({ data }) {
  const columns = [
    ...shipBreakColumns,
    {
      title: "Master Name",
      dataIndex: "sb_mast_name",
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Buyer Company Name",
      dataIndex: "sb_buyer_comp_name",
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Owner Name",
      dataIndex: "sb_owner_name",
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Localshipping Company Name",
      dataIndex: "sb_locshipping_comp_name",
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Localshipping Agent Name",
      dataIndex: "sb_locshipping_agent_name",
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Ship flag Registry Certificate",
      dataIndex: "sb_flag_reg_cert",
      ellipsis: {
        showTitle: false,
      },
      render: (value) => (value ? "Yes" : "No"),
    },
    {
      title: "Memorandum of Agreement",
      dataIndex: "sb_agreement_memo",
      ellipsis: {
        showTitle: false,
      },
      render: (value) => (value ? "Yes" : "No"),
    },
    {
      title: "Letter of Credit",
      dataIndex: "sb_credit_let",
      ellipsis: {
        showTitle: false,
      },
      render: (value) => (value ? "Yes" : "No"),
    },
    {
      title: "Master Nationality",
      dataIndex: "sb_mast_nationality",
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Buyer Company Cell Number",
      dataIndex: "sb_buyer_comp_num",
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Owner Cell Name",
      dataIndex: "sb_owner_name",
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Agent  Number",
      dataIndex: "sb_locshipping_agent_num",
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Any Security Team",
      dataIndex: "sb_sec_team",
      ellipsis: {
        showTitle: false,
      },
      render: (value) => (value ? "Yes" : "No"),
    },
    {
      title: "Any Hazardeous Material",
      dataIndex: "sb_haz_material",
      ellipsis: {
        showTitle: false,
      },
      render: (value) => (value ? "Yes" : "No"),
    },
    {
      title: "Gas Free Certicate",
      dataIndex: "sb_gas_free_cert",
      ellipsis: {
        showTitle: false,
      },
      render: (value) => (value ? "Yes" : "No"),
    },

    {
      title: "Nuclear Waste Free Certificate",
      dataIndex: "sb_waste_free_cert",
      ellipsis: {
        showTitle: false,
      },
      render: (value) => (value ? "Yes" : "No"),
    },
    {
      title: "Import General Manifest",
      dataIndex: "sb_import_gen_manifest",
      ellipsis: {
        showTitle: false,
      },
      render: (value) => (value ? "Yes" : "No"),
    },
    {
      title: "Communciation Equipment List",
      dataIndex: "sb_comm_equip_list",
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <div style={{ width: "100%" }}>
          {text &&
            text.map((value, index) => (
              // <span key={value}>
              //   {value} 
              //   {index < text.length - 1 && "  ,"}
              // </span>
               <span key={value}>
            {index > 0 && " "} {/* Add a space before each value (except the first) */}
            {value}
            {index < text.length - 1 && " , "} {/* Add a space after each comma (except the last) */}
          </span>
            ))}
        </div>
      ),
    },
    {
      title: "Good Deceleration Certificate",
      dataIndex: "sb_goods_dec_doc",
      ellipsis: {
        showTitle: false,
      },
      render: (value) => (value ? "Yes" : "No"),
    },
    {
      title: "Deletion Certificate",
      dataIndex: "sb_del_cert",
      ellipsis: {
        showTitle: false,
      },
      render: (value) => (value ? "Yes" : "No"),
    },
    {
      title: "ISO Certificate",
      dataIndex: "sb_iso_cert",
      ellipsis: {
        showTitle: false,
      },
      render: (value) => (value ? "Yes" : "No"),
    },
    {
      title: "Total number of crew onboard",
      dataIndex: "sb_crew",
      ellipsis: {
        showTitle: false,
      },
    },
  ];

  //crew table
  const CrewDetails = [
    {
      title: "Crew Name",
      dataIndex: "sbc_name",
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Crew Nationality",
      dataIndex: "sbc_nationality",
      ellipsis: {
        showTitle: false,
      },
    },
  ];

  const tableItems = [
    {
      title: "Crew Details",
      columns: CrewDetails,
      data: data[0]?.shipbreakingcrew,
      pagination: false,
    },
  ];

  return (
    <>
      <div className="mx-2">
        <PageHeader title="Report Details" showSearchBox={false} />
        <header className="flex">
          <Heading level={4} text="Ship Break Detail" />
        </header>
        <section className="shadow border-tableborder border-2 mb-12 rounded-md">
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            scroll={{ x: "auto" }}
          />
        </section>
        {tableItems.map((item, index) => (
          <>
            {/* <div key={index}>
              <header className="flex">
                <Heading level={4} text={item.title} />
              </header>
              <div className="mb-12">
                <AntdTable
                  columns={item.columns}
                  data={item.data}
                  pagination={item.pagination}
                  scrollConfig={{ x: 250 }}
                />
              </div>
            </div> */}

            <TableItemRenderer
              key={index}
              title={item.title}
              columns={item.columns}
              data={item.data}
              pagination={item.pagination}
            />
          </>
        ))}
      </div>
    </>
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
