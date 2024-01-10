import React from "react";
import { RxArrowLeft } from "react-icons/rx";
import Heading from "../../src/components/title/Heading";
import AntdTable from "../../src/components/table/AntdTable";
import { useRouter } from "next/router";
import axios from "axios";
import dayjs from "dayjs";
import { RegVesselColumn } from "../../src/helper/DataColumns";
import TableItemRenderer from "../../src/components/table/RenderTable";

function RegisteredVesselDetails({ data }) {
  const router = useRouter();

  const vesselcolumns = [
    ...RegVesselColumn,
    {
      title: "Length (Meters)",
      dataIndex: "rv_length",
    },
    {
      title: "Breadth (Meters)",
      dataIndex: "rv_breadth",
    },
    {
      title: "Tonnage (Gross Tonnage)",
      dataIndex: "rv_tonnage",
    },
    {
      title: "Registered ON ",
      dataIndex: "rv_rdt",
      ellipsis: true,
      render: (text) => {
        const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
        return dtg;
      },
    },
  ];
  const nakwacolumns = [
    {
      title: "Nakwa Name",
      dataIndex: "rvc_name",
    },
    {
      title: "Nakwa/CO Nationality",
      dataIndex: "rvc_nationality",
    },
    {
      title: "Nakwa/CO Ethnicity",
      dataIndex: "rvc_ethnicity",
    },
    {
      title: "Nakwa/CO Cell Number",
      dataIndex: "rvc_cell",
    },
  ];
  const ownercolumns = [
    {
      title: "Name",
      dataIndex: "rvo_name",
    },
    {
      title: "Nationality",
      dataIndex: "rvo_nationality",
    },
    {
      title: "ID Type",
      dataIndex: "rvo_idtype",
    },
    {
      title: "ID Number",
      dataIndex: "rvo_id",
    },
    {
      title: "ID Exp. Date",
      dataIndex: "rvo_idexpdt",
    },
    {
      title: "Ethnicity",
      dataIndex: "rvo_ethnicity",
    },
    {
      title: "Share (%)",
      dataIndex: "rvo_share",
    },
    {
      title: "Mobile Number",
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
    <div className="mx-2">
      <div className="flex items-center mt-14">
        <RxArrowLeft
          cursor={"pointer"}
          onClick={() => router.back()}
          className="ml-12"
          fontSize={25}
        />
        <span
          className=" ml-2 text-sm font-medium"
          style={{ cursor: "pointer" }}
        >
          Back
        </span>
      </div>

      <div className="mx-12 mb-8 mt-4">
        <Heading level={4} text="Vessels Details" />
      </div>
      <section className="shadow border-tableborder border-2 mb-12 rounded-md">
        <AntdTable columns={vesselcolumns} data={data} pagination={false} />
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
                scrollConfig={{ x: 250 }} // Customize scroll configuration
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
