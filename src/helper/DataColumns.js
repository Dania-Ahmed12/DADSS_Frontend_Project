import { Tooltip } from "antd";
import dayjs from "dayjs";
import { decimalToDMS } from "../../src/helper/position";

export const RegVesselColumn = [
  {
    title: "Vessel ID Number",
    dataIndex: "rv_id",
    width: 250,
    ellipsis: false,
    render: (text) => {
      return text;
    },
  },
  {
    title: "Registration Number",
    dataIndex: "rv_regno",
    width: 250,
    ellipsis: false,
    render: (text) => {
      return text;
    },
  },
  {
    title: "Vessel Name",
    dataIndex: "rv_name",
    width: 250,
    ellipsis: false,
    render: (text) => {
      return text;
    },
  },
  {
    title: "Type",
    dataIndex: "rv_type",
    width: 250,
    ellipsis: false,
    render: (text) => {
      return text;
    },
  },
  {
    title: "Flag",
    dataIndex: "rv_flag",
    width: 250,
    ellipsis: false,
  },
  {
    title: "Province",
    dataIndex: "rv_province",
    width: 250,
    ellipsis: false,
  },
];

export const MerVesselColumn = [
  {
    title: "MMSI",
    dataIndex: "mv_mmsi",
    width: 250,
    ellipsis: false,
  },
  {
    title: "IMO",
    dataIndex: "mv_imo",
    width: 250,
    ellipsis: false,
  },
  {
    title: "Ship ID",
    width: 250,
    ellipsis: false,
    dataIndex: "mv_ship_id",
  },
  {
    title: "Ship Name",
    width: 250,
    ellipsis: false,
    dataIndex: "mv_ship_name",
  },
  {
    title: "Flag",
    dataIndex: "mv_flag",
    width: 250,
    ellipsis: false,
  },
  {
    title: "Type",
    dataIndex: "mv_type_name",
    width: 250,
    ellipsis: false,
  },
  {
    title: "AIS Type",
    dataIndex: "mv_ais_type_summary",
    width: 250,
    ellipsis: false,
  },
];
export const MerchantDetailColumns = [
  ...MerVesselColumn,
  {
    title: "Ship Type",
    dataIndex: "mv_ship_type",
    width: 250,
    ellipsis: false,
  },
  {
    title: "Call Sign",
    dataIndex: "mv_call_sign",
    width: 250,
    ellipsis: false,
  },

  {
    title: "Length",
    dataIndex: "mv_length",
    width: 250,
    ellipsis: false,
  },

  {
    title: "Width",
    dataIndex: "mv_width",
    width: 250,
    ellipsis: false,
  },
  {
    title: "Gross Tonnage",
    dataIndex: "mv_grt",
    width: 250,
    ellipsis: false,
  },
  {
    title: "Dead Weight",
    dataIndex: "mv_dwt",
    width: 250,
    ellipsis: false,
  },
  {
    title: "Year built",
    dataIndex: "mv_year_built",
    width: 250,
    ellipsis: false,
  },
];

export const GeneralReportColumn = [
  {
    title: "Platform ID",
    dataIndex: "gr_pf_id",
    width: 250,
    ellipsis: false,
  },
  {
    title: "Latitude",
    dataIndex: "gr_position",
    width: 250,
    ellipsis: false,
    render: (text, record) => {
      if (record.gr_position) {
        var val = record.gr_position.coordinates[1];
        const latitude = decimalToDMS(val, 1);
        return latitude;
      }
    },
  },
  {
    title: "Longitude",
    dataIndex: "gr_position",
    width: 250,
    ellipsis: false,
    render: (text, record) => {
      if (record.gr_position) {
        var val = record.gr_position.coordinates[0];
        const longitude = decimalToDMS(val, 0);
        return longitude;
      }
    },
  },
  {
    title: "Patrol Type",
    dataIndex: "gr_patroltype",
    width: 250,
    ellipsis: false,
  },
  {
    title: "Fuel Remaining (%)",
    dataIndex: "gr_fuelrem",
    width: 250,
    ellipsis: false,
  },
  {
    title: "Date Time",
    dataIndex: "gr_dtg",
    width: 250,
    ellipsis: false,
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
    ellipsis: false,
  },
  {
    title: "Date Time",
    dataIndex: "mr_dtg",
    ellipsis: false,
    render: (text) => {
      const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
      return dtg;
    },
  },
  {
    title: "Registered ON",
    dataIndex: "mr_rdt",
    ellipsis: false,
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

export const MerchantShipColumn = [
  {
    title: "IMO",
    render: (record) => record?.merchant_vessel?.mv_imo,
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
];
export const shipBreakColumns = [
  {
    title: "Date Time",
    dataIndex: "sb_dtg",
    ellipsis: false,
    width: 220,
    render: (text) => {
      const dtg = text ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") : "";
      return dtg;
    },
  },
  {
    title: "IMO Verified",
    dataIndex: "sb_imo_verified",
    render: (value) => (value ? "Yes" : "No"),
  },

  {
    title: "LPOC",
    dataIndex: "sb_lpoc",
  },
  {
    title: "Ex Name",
    dataIndex: "sb_ex_name",
  },
  {
    title: "Embosse Name",
    dataIndex: "sb_emb_name",
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
