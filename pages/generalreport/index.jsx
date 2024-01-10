import React, { useEffect, useState } from "react";
import AntdTable from "../../src/components/table/AntdTable.js";
import { Col, Input, Row, Tooltip } from "antd";
import FilledButton from "../../src/components/button/FilledButton.js";
import Heading from "../../src/components/title/Heading.js";
import { RxArrowLeft } from "react-icons/rx";
import { SearchOutlined } from "@ant-design/icons";
import { useRouter } from "next/router.js";
import Link from "next/link.js";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { fetchGeneralReport } from "../../src/redux/thunks/generalReportData.js";
import { decimalToDMS } from "../../src/helper/position";
import { GeneralReportColumn } from "../../src/helper/DataColumns.js";

const IconsStylingWrap = styled.div`
  display: flex;
  .editIcon {
    color: #28387e;
    background-color: #f0f3f8;
    border-radius: 20px;
    font-size: 25px;
    padding: 5px;
    margin-right: 10px;
    cursor: pointer;
  }
  .deleteIcon {
    color: #e96162;
    background-color: #f9e7e8;
    border-radius: 20px;
    font-size: 25px;
    padding: 5px;
    cursor: pointer;
  }
  .details {
    color: #28387e;
    padding: 5px;
    cursor: pointer;
  }
`;

function Index() {
  const router = useRouter();
  const [searchData, setSearchData] = useState("");
  const { data, isLoading } = useSelector((state) => state.fetchGeneralReport);
  const dispatch = useDispatch();

  const columns = [
    ...GeneralReportColumn,
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <IconsStylingWrap>
            <Link
              href={`/generalreport/${record.gr_key}`}
              className="text-midnight ml-2 font-semibold"
            >
              Details
            </Link>
          </IconsStylingWrap>
        );
      },
    },
  ];
  const handleBack = () => {
    router.push("/");
  };
  const handleNavigate = () => {
    router.push("/generalreport/addgeneralinput");
  };
  useEffect(() => {
    dispatch(fetchGeneralReport(searchData));
  }, [searchData]);
  return (
    <div>
      <div className="flex items-center mt-14">
        <RxArrowLeft
          onClick={handleBack}
          cursor={"pointer"}
          className="ml-14"
          fontSize={25}
        />
        <span
          onClick={handleBack}
          className=" ml-2 text-sm font-medium"
          style={{ cursor: "pointer" }}
        >
          Back
        </span>
      </div>
      <Row className="mx-14 mb-8 mt-4">
        <Col span={11}>
          <Heading level={4} text="General Report (View/Add)" />
        </Col>
        <Col span={8}>
          <Input
            size="large"
            // placeholder="Search"
            allowClear
            prefix={<SearchOutlined />}
            className="search-input"
            placeholder="Search by Platform ID or Patrol Type"
            onChange={(e) => setSearchData(e.target.value)}
          />
        </Col>
        <Col className="flex justify-center items-center" span={4} offset={1}>
          <FilledButton
            text="+Add General Report"
            className="rounded-full border-midnight bg-midnight text-white"
            onClick={handleNavigate}
            // disabled={disabled}
          />
        </Col>
      </Row>
      <div>
        <AntdTable columns={columns} data={data} loading={isLoading} />
      </div>
    </div>
  );
}

export default Index;
export async function getServerSideProps() {
  return {
    props: {
      data: {
        title: "General Report",
      },
    },
  };
}
