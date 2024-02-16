import React, { useEffect, useState } from "react";
import AntdTable from "../../src/components/table/AntdTable.js";
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
      key:"id",
      ellipsis: false,
      width:250,
    },
    {
      title: "UserName",
      dataIndex: "username",
      key:"username",
      ellipsis: false,
      width:250,
    },
    {
      title: "Date Joined",
      dataIndex: "date_joined",
      key:"date_joined",
      ellipsis: false,
      width:250,
      render: (text) => {
        const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
        return text ? <>{dtg}</> : text;
      },
    },
    {
      title: "Last Login",
      dataIndex: "last_login",
      key:"last_login",
      ellipsis: false,
      width:250,
      render: (text) => {
        const dtg = dayjs(text).format("YYYY-MM-DD HH:mm:ss");
        return text ? <>{dtg}</> : text;
      },
    },
  ];
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.getUsers);
  const handleClick = () => {
    router.push("/user/createuser");
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
          title="Users (List View)"
          btnTitleMedia="+ Add"
          placeholder="Search"
          btnTitle="+ Create User"
          showButton={true}
        />
      </div>
      <div>
        <AntdTable columns={columns} data={data} scrollConfig={{ x: true }} />
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
