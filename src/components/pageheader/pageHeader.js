import React from "react";
import { RxArrowLeft } from "react-icons/rx";
import { useRouter } from "next/router.js";
import { Col, Input, Row } from "antd";
import Heading from "../title/Heading";
import FilledButton from "../button/FilledButton";
import { SearchOutlined } from "@ant-design/icons";

function PageHeader(props) {
  const {
    title,
    onSearchChange,
    btnTitle,
    onNavigate,
    placeholder,
    showButton,
    showSearchBox = true,
   sessionStorage 
  } = props;
  const router = useRouter();

  const handleBack = () => {
    // Check if the callback function for removing session storage is provided
    if (typeof sessionStorage === "function") {
      sessionStorage();
    }
    router.push("/");
  };
  return (
    <>
      <Row className="flex items-center mt-14">
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
      </Row>

      <Row className="mx-14 mb-8 mt-4">
        <Col span={showButton ? 11 : 16}>
          <Heading level={4} text={title} />
        </Col>
        <Col span={8}>
          {showSearchBox && (
            <Input
              size="large"
              allowClear
              prefix={<SearchOutlined />}
              className="search-input"
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={placeholder}
            />
          )}
        </Col>
        <Col className="flex justify-center items-center" span={4} offset={1}>
          {showButton && (
            <FilledButton
              text={btnTitle}
              className="rounded-full border-midnight bg-midnight text-white"
              onClick={onNavigate}
            />
          )}
        </Col>
      </Row>
    </>
  );
}

export default PageHeader;
