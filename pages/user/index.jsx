import React, { useEffect, useState } from "react";
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
import PageHeader from "../../src/components/pageheader/pageHeader.js";
function Index() {
  const router = useRouter();
  const [searchData, setSearchData] = useState("");
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
    dispatch(getAllUsers(searchData));
  }, [searchData]);
  return (
    <>
      <div>
        <PageHeader
          onSearchChange={setSearchData}
          onNavigate={handleClick}
          title="Users (List View"
          placeholder="Search"
          btnTitle="+ Create User"
          showButton={true}
        />
      </div>
      <div>
        <AntdTable columns={columns} data={data} />
      </div>
    </>
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
