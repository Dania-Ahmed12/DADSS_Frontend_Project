import React, { useEffect } from "react";
// import UserTable from "../../src/components/table/UserTable.js";
import AntdTable from "../../src/components/table/AntdTable.js";
import FilledButton from "../../src/components/button/FilledButton.js";
import { Col, Input, Row, Tooltip } from "antd";
import Heading from "../../src/components/title/Heading.js";
import { RxArrowLeft } from "react-icons/rx";
import { SearchOutlined } from "@ant-design/icons";
import { useRouter } from "next/router.js";
import { useSelector, useDispatch } from "react-redux";
import { getAllUsers } from "../../src/redux/thunks/userAuth.js";
import dayjs from "dayjs";
function Index() {
  const router = useRouter();
  const columns = [
    {
      title: "User ID Number",
      dataIndex: "id",
    },
    {
      title: "UserName",
      dataIndex: "username",
    },
    {
      title: "Date Joined",
      dataIndex: "date_joined",
      render: (text) => {
        const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
        return text ? (
          <Tooltip placement="topLeft" title={dtg}>
            {dtg}
          </Tooltip>
        ) : text;
      },
    },
    {
      title: "Last Login",
      dataIndex: "last_login",
      render: (text) => {
        const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
        return text ? (
          <Tooltip placement="topLeft" title={dtg}>
            {dtg}
          </Tooltip>
        ) : text;
      },
    },

  ];
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.getUsers);
  const handleClick = () => {
    router.push("/user/createuser");
  };

  const handleBack = () => {
    router.push("/");
  };
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);
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
          <Heading level={4} text="Users (List View)" />
        </Col>
        <Col span={8}>
          {/* <SearchStyle> */}
          <Input
            size="large"
            placeholder="Search"
            allowClear
            prefix={<SearchOutlined />}
            className="search-input"
            onChange={(e) => setSearchData(e.target.value)}
          />
          {/* </SearchStyle> */}
        </Col>
        <Col className="flex justify-center items-center" span={4} offset={1}>
          <FilledButton
            text="+Create New User"
            className="rounded-full border-midnight bg-midnight text-white"
            onClick={handleClick}
          />
        </Col>
      </Row>
      <div>
        <AntdTable columns={columns} data={data} />
      </div>
    </div>
  );
}

export default Index;

export async function getServerSideProps(context) {
  return {
    props: {
      data: {
        title: "User",
      },
    },
  };
}
