import React from "react";
import AntdTable from "../../src/components/table/AntdTable";
import axios from "axios";
import dayjs from "dayjs";
import { RegVesselColumn } from "../../src/helper/DataColumns";
import TableItemRenderer from "../../src/components/table/RenderTable";
import PageHeader from "../../src/components/pageheader/pageHeader";

function RegisteredVesselDetails({ data }) {

  const vesselcolumns = [
    ...RegVesselColumn,
    {
      title: "Length (Meters)",
          width: 250,
    ellipsis: false,
      dataIndex: "rv_length",    
    },
    {
      title: "Breadth (Meters)",
          width: 250,
    ellipsis: false,
      dataIndex: "rv_breadth",    
    },
    {
      title: "Tonnage (Gross Tonnage)",
          width: 250,
    ellipsis: false,
      dataIndex: "rv_tonnage",
    },
    {
      title: "Registered ON ",
          width: 250,
    ellipsis: false,
      dataIndex: "rv_rdt",
      render: (text) => {
        const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
        return dtg;
      },
    },
  ];
  const nakwacolumns = [
    {
      title: "Nakwa Name",
          width: 250,
    ellipsis: false,
      dataIndex: "rvc_name",
    },
    {
      title: "Nakwa/CO Nationality",
          width: 250,
    ellipsis: false,
      dataIndex: "rvc_nationality",
    },
    {
      title: "Nakwa/CO Ethnicity",
          width: 250,
    ellipsis: false,
      dataIndex: "rvc_ethnicity",
    },
    {
      title: "Nakwa/CO Cell Number",
          width: 250,
    ellipsis: false,
      dataIndex: "rvc_cell",
    },
  ];
  const ownercolumns = [
    {
      title: "Name",
          width: 250,
    ellipsis: false,
      dataIndex: "rvo_name",
    },
    {
      title: "Nationality",
          width: 250,
    ellipsis: false,
      dataIndex: "rvo_nationality",
    },
    {
      title: "ID Type",
          width: 250,
    ellipsis: false,
      dataIndex: "rvo_idtype",
    },
    {
      title: "ID Number",
          width: 250,
    ellipsis: false,
      dataIndex: "rvo_id",
    },
    {
      title: "ID Exp. Date",
          width: 250,
    ellipsis: false,
      dataIndex: "rvo_idexpdt",
    },
    {
      title: "Ethnicity",
          width: 250,
    ellipsis: false,
      dataIndex: "rvo_ethnicity",
    },
    {
      title: "Share (%)",
          width: 250,
    ellipsis: false,
      dataIndex: "rvo_share",
    },
    {
      title: "Mobile Number",
          width: 250,
    ellipsis: false,
      dataIndex: "rvo_cell",
    },
  ];

  const tableItems = [
    {
      title: "Nakwa Details",
      columns: nakwacolumns,
      data: data[0]?.nakwaDetails,
      pagination: false,
    },
    {
      title: "Owner Details",
      columns: ownercolumns,
      data: data[0]?.ownerDetails,
      pagination: true,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Fishing Vessels Details"
        showButton={false}
        showSearchBox={false}
      />
      <div className="mb-10">
        <AntdTable
          columns={vesselcolumns}
          data={data}
          pagination={false}
          scrollConfig={{ x: true }}
        />
      </div>
      {tableItems.map((item, index) => (
        <>
          <TableItemRenderer
          scrollConfig={{x:true}}
            key={index}
            title={item.title}
            columns={item.columns}
            data={item.data}
            pagination={false}
          />
        </>
      ))}
    </div>
  );
}

export default RegisteredVesselDetails;

export async function getServerSideProps(context) {
  const { id } = context.query;

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/rvessel/${id}`
    );
    if (response.status === 200) {
      return {
        props: {
          data: [response.data],
          title: `Registered Vessel Details ${id}`,
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
