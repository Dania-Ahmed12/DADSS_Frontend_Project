import React from "react";
import AntdTable from "../../src/components/table/AntdTable";
import axios from "axios";
import { MerVesselColumn } from "../../src/helper/DataColumns";
import PageHeader from "../../src/components/pageheader/pageHeader";

function RegistedMerchantVesselDetails({ data }) {
  // Columns configuration for AntdTable component
  // const columns = [...MerchantDetailColumns];
const columns = [
    ...MerVesselColumn,
    {
      key: "mv_ship_type",
      title: "Ship Type",
      dataIndex: "mv_ship_type",
      width: 250,
      ellipsis: false,
    },
    {
      key: "mv_call_sign",
      title: "Call Sign",
      dataIndex: "mv_call_sign",
      width: 250,
      ellipsis: false,
    },

    {
      key: "mv_length",
      title: "Length",
      dataIndex: "mv_length",
      width: 250,
      ellipsis: false,
    },

    {
      key: "mv_width",
      title: "Width",
      dataIndex: "mv_width",
      width: 250,
      ellipsis: false,
    },
    {
      title: "Gross Tonnage",
      key: "mv_grt",
      dataIndex: "mv_grt",
      width: 250,
      ellipsis: false,
    },
    {
      title: "Dead Weight",
      dataIndex: "mv_dwt",
      key: "mv_dwt",
      width: 250,
      ellipsis: false,
    },
    {
      key: "mv_year_built",
      title: "Year built",
      dataIndex: "mv_year_built",
      width: 250,
      ellipsis: false,
    },
  ];
  return (
    <>
      <div>
        <PageHeader
          title="Merchant Vessel Details"
          showButton={false}
          showSearchBox={false}
        />
        <div>
          <AntdTable
            scrollConfig={{ x: true }}
            columns={columns}
            data={data}
            pagination={false}
          />
        </div>
      </div>
    </>
  );
}

export default RegistedMerchantVesselDetails;

export async function getServerSideProps(context) {
  // a special Next.js function that is used to fetch data for server-side rendering.
  // The line const { id } = context.query; is extracting the id parameter from the context.query object. In Next.js
  // , when you define a dynamic route like [id].js or [slug].js,
  //  the values inside the square brackets become parameters that can be accessed through the context.query object.
  const { id } = context.query;

  try {
    // Fetching data from the backend API based on the 'id' parameter
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/aisvessel/${id}`
    );
    if (response.status === 200) {
      return {
        props: {
          data: [response.data],
          title: `Merchant Vessels Details ${id}`,
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
