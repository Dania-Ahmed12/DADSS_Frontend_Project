import { Tooltip } from "antd";
import dayjs from "dayjs";
import { decimalToDMS } from "../../src/helper/position";

export const RegVesselColumn = [
  {
    title: "Vessel ID Number",
    dataIndex: "rv_id",
    ellipsis: {
      showTitle: false,
    },
    render: (text) => {
      return (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      );
    },
  },
  {
    title: "Registration Number",
    dataIndex: "rv_regno",
    ellipsis: {
      showTitle: false,
    },
    render: (text) => {
      return (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      );
    },
  },
  {
    title: "Vessel Name",
    dataIndex: "rv_name",
    ellipsis: {
      showTitle: false,
    },
    render: (text) => {
      return (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      );
    },
  },
  {
    title: "Type",
    dataIndex: "rv_type",
    ellipsis: {
      showTitle: false,
    },
    render: (text) => {
      return (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      );
    },
  },
  {
    title: "Flag",
    dataIndex: "rv_flag",
  },
  {
    title: "Province",
    dataIndex: "rv_province",
  },
];

export const MerVesselColumn = [
  {
    title: "MMSI",
    dataIndex: "mv_mmsi",
  },
  {
    title: "IMO",
    dataIndex: "mv_imo",
  },
  {
    title: "Ship ID",
    dataIndex: "mv_ship_id",
  },
  {
    title: "Ship Name",
    dataIndex: "mv_ship_name",
  },
  {
    title: "Flag",
    dataIndex: "mv_flag",
  },
  {
    title: "Type",
    dataIndex: "mv_type_name",
  },
  {
    title: "AIS Type",
    dataIndex: "mv_ais_type_summary",
  },
];
export const MerchantDetailColumns = [
  ...MerVesselColumn,
  {
    title: "Call Sign",
    dataIndex: "mv_call_sign",
  },
  {
    title: "Ship Type",
    dataIndex: "mv_ship_type",
    render: (text) => <div>{text}</div>,
  },
  {
    title: "Length",
    dataIndex: "mv_length",
    render: (text) => <div>{text}</div>,
  },
  {
    title: "Tonnage (Gross tonnage)",
    dataIndex: "mv_grt",
    render: (text) => <div>{text}</div>,
  },
  {
    title: "Width",
    dataIndex: "mv_width",
    render: (text) => <div>{text}</div>,
  },
  {
    title: "Dead Weight",
    dataIndex: "mv_dwt",
    render: (text) => <div>{text}</div>,
  },
  {
    title: "Year in built",
    dataIndex: "mv_year_built",
    render: (text) => <div>{text}</div>,
  },
];

export const GeneralReportColumn = [
  {
    title: "Platform ID",
    dataIndex: "gr_pf_id",
  },
  {
    title: "Latitude",
    dataIndex: "gr_position",
    ellipsis: {
      showTitle: false,
    },
    render: (text, record) => {
      if (record.gr_position) {
        var val = record.gr_position.coordinates[1];
        const latitude = decimalToDMS(val, 1);
        return (
          <Tooltip placement="topLeft" title={val.toFixed(4)}>
            {latitude}
          </Tooltip>
        );
      }
    },
  },
  {
    title: "Longitude",
    dataIndex: "gr_position",
    ellipsis: {
      showTitle: false,
    },
    render: (text, record) => {
      if (record.gr_position) {
        var val = record.gr_position.coordinates[0];
        const longitude = decimalToDMS(val, 0);
        return (
          <Tooltip placement="topLeft" title={val.toFixed(4)}>
            {longitude}
          </Tooltip>
        );
      }
    },
  },
  {
    title: "Patrol Type",
    dataIndex: "gr_patroltype",
  },
  {
    title: "Fuel Remaining (%)",
    dataIndex: "gr_fuelrem",
  },
  {
    title: "Date Time",
    dataIndex: "gr_dtg",
    ellipsis: {
      showTitle: false,
    },
    render: (text) => {
      const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
      return dtg;
    },
  },
];

export const Missioncolumns = [
  {
    title: "Platform ID",
    dataIndex: "mr_pf_id",
    ellipsis: true,
  },
  {
    title: "Date Time",
    dataIndex: "mr_dtg",
    ellipsis: true,
    render: (text) => {
      const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
      return dtg;
    },
  },
  {
    title: "Registered ON",
    dataIndex: "mr_rdt",
    ellipsis: true,
    render: (text) => {
      const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
      return dtg;
    },
  },
];

export const IntelColumns = [
  {
    title: "Platform ID",
    dataIndex: "ir_pf_id",
    ellipsis: {
      showTitle: false,
    },
    render: (text) => {
      return (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      );
    },
  },
  {
    title: "Reporter Name",
    dataIndex: "ir_reporter_name",
    ellipsis: {
      showTitle: false,
    },
    render: (text, record) => {
      return (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      );
    },
  },
  {
    title: "Reporting Time",
    dataIndex: "ir_reporting_time",
    ellipsis: {
      showTitle: false,
    },
    render: (text) => {
      const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
      return dtg;
    },
  },
  {
    title: "Jetty",
    dataIndex: "ir_jetty",
  },
  {
    title: "Boats",
    dataIndex: "ir_total_boats",
  },
];

export const shipBreakColumns = [
  {
    title: "Date Time",
    dataIndex: "sb_dtg",
    ellipsis: {
      showTitle: false,
    },
    render: (text) => {
      const dtg = text ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") : "";
      return dtg;
    },
  },
  {
    title: "IMO",
    render: (record) => record?.merchant_vessel?.mv_imo,
  },
  {
    title: "IMO Verified",
    ellipsis: {
      showTitle: false,
    },
    dataIndex: "sb_imo_verified",
    render: (value) => (value ? "Yes" : "No"),
  },
  {
    title: "Ship Name",
    render: (record) => record?.merchant_vessel?.mv_ship_name,
  },
  {
    title: "Flag",
    render: (record) => record?.merchant_vessel?.mv_flag,
  },
  {
    title: "Vessel Type",
    render: (record) => record?.merchant_vessel?.mv_ais_type_summary,
  },
  {
    title: "LPOC",
    dataIndex: "sb_lpoc",
    ellipsis: {
      showTitle: false,
    },
  },
  {
    title: "Ex Name",
    dataIndex: "sb_ex_name",
    ellipsis: {
      showTitle: false,
    },
  },
  {
    title: "Embosse Name",
    dataIndex: "sb_emb_name",
    ellipsis: {
      showTitle: false,
    },
  },
];

export const basicColumns = [
  {
    title: "MMSI",
    dataIndex: "mv_mmsi",
  },
  {
    title: "IMO",
    dataIndex: "mv_imo",
  },
  {
    title: "Name",
    dataIndex: "mv_ship_name",
  },
  {
    title: "Flag",
    dataIndex: "mv_flag",
  },
  {
    title: "Type",
    dataIndex: "mv_ais_type_summary",
  },
];
