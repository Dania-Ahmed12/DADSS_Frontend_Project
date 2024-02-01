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
    sessionStorage,
    btnTitleMedia,
  } = props;
  const router = useRouter();

  const handleBack = () => {
    if (typeof sessionStorage === "function") {
      sessionStorage();
    }
    router.back();
  };

  return (
    <React.Fragment>
      <Row className="flex items-center ">
        <RxArrowLeft
          onClick={handleBack}
          cursor={"pointer"}
          className="ml-5"
          fontSize={25}
        />
        <span
          onClick={handleBack}
          className="text-sm font-medium cursor-pointer"
        >
          Back
        </span>
      </Row>
      <Row className="flex flex-wrap mt-5">
        <Col
          xs={24}
          sm={24}
          md={14}
          lg={14}
          xl={12}
          xxl={12}
          className="flex justify-start "
        >
          <Heading className=" whitespace-nowrap ml-5" level={4} text={title} />
        </Col>
        <Col xs={24} sm={24} md={10} lg={10} xl={12} xxl={12}>
          {showSearchBox && (
            <div className="flex justify-end mr-5">
              <Input
                size="large"
                allowClear
                prefix={<SearchOutlined />}
                className="search-input custom-css-pageheaderSearch"
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={placeholder}
              />
              {showButton && (
                <>
                  <FilledButton
                    text={btnTitle}
                    className="rounded-full border-midnight bg-midnight text-white ml-2 custom-css-pageheaderButton"
                    onClick={onNavigate}
                  />
                  <FilledButton
                    text={btnTitleMedia}
                    className="rounded-full border-midnight bg-midnight text-white ml-2 custom-css-pageheaderButtonMedia"
                    onClick={onNavigate}
                  />
                </>
              )}
            </div>
          )}
        </Col>
      </Row>
    </React.Fragment>
  );
}

export default PageHeader;
