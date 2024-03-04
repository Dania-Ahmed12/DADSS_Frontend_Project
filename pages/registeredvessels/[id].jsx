import React, { useEffect } from "react";
import AntdTable from "../../src/components/table/AntdTable";
import axios from "axios";
import dayjs from "dayjs";
import { RegVesselColumn } from "../../src/helper/DataColumns";
import TableItemRenderer from "../../src/components/table/RenderTable";
import PageHeader from "../../src/components/pageheader/pageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchRegisteredVesselID } from "../../src/redux/thunks/registeredVesselData";
import { useRouter } from "next/router";

function RegisteredVesselDetails() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { rv_key } = router.query; // Extract rv_key from query parameters
  const { data, isLoading  , error } = useSelector(
    (state) => state.fetchRegisteredVesselIDData
  );
  // Fetch vessel details based on rv_key
  useEffect(() => {
    if (rv_key) {
      dispatch(fetchRegisteredVesselID(rv_key));
    }
  }, [rv_key, dispatch]);

  const vesselcolumns = [
    ...RegVesselColumn,
    {
      title: "Length (meters)",
      key: "rv_length",
      width: 250,
      ellipsis: false,
      dataIndex: "rv_length",
    },
    {
      title: "Breadth  (meters)",
      key: "rv_breadth",
      width: 250,
      ellipsis: false,
      dataIndex: "rv_breadth",
    },
    {
      key: "rv_tonnage",
      title: "Gross Tonnage",
      width: 250,
      ellipsis: false,
      dataIndex: "rv_tonnage",
    },
    {
      key: "rv_rdt",
      title: "Registered ON ",
      width: 250,
      ellipsis: false,
      dataIndex: "rv_rdt",
      render: (text) => {
          if (!text) return "---";

        const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
        return dtg;
      },
    },
  ];
  const nakwacolumns = [
    {
      title: "Nakwa Name",
      key: "rvc_name",
      width: 250,
      ellipsis: false,
      dataIndex: "rvc_name",
    },
    {
      key: "rvc_nationality",
      title: "CO Nationality",
      width: 250,
      ellipsis: false,
      dataIndex: "rvc_nationality",
    },
    {
      key: "rvc_ethnicity",
      title: "CO Ethnicity",
      width: 250,
      ellipsis: false,
      dataIndex: "rvc_ethnicity",
    },
    {
      key: "rvc_cell",
      title: "CO Cell Number",
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
      key: "rvo_name",
      dataIndex: "rvo_name",
    },
    {
      title: "Nationality",
      key: "rvo_nationality",
      width: 250,
      ellipsis: false,
      dataIndex: "rvo_nationality",
    },
    {
      key: "rvo_idtype",
      title: "ID Type",
      width: 250,
      ellipsis: false,
      dataIndex: "rvo_idtype",
    },
    {
      key: "rvo_id",
      title: "ID Number",
      width: 250,
      ellipsis: false,
      dataIndex: "rvo_id",
    },
    {
      key: "rvo_idexpdt",
      title: "ID Exp. Date",
      width: 250,
      ellipsis: false,
      dataIndex: "rvo_idexpdt",
    },
    {
      key: "rvo_ethnicity",
      title: "Ethnicity",
      width: 250,
      ellipsis: false,
      dataIndex: "rvo_ethnicity",
    },
    {
      key: "rvo_share",
      title: "Share (%)",
      width: 250,
      ellipsis: false,
      dataIndex: "rvo_share",
    },
    {
      key: "rvo_cell",
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
      data: data?.nakwaDetails,
      pagination: false,
    },
    {
      title: "Owner Details",
      columns: ownercolumns,
      data: data?.ownerDetails,
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
          data={[data]}
          pagination={false}
          scrollConfig={{ x: true }}
        />
      </div>
      {tableItems.map((item, index) => (
        <>
          <TableItemRenderer
            scrollConfig={{ x: true }}
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
