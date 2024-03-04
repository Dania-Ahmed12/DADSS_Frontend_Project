import React from "react";
import { RxArrowLeft } from "react-icons/rx";
import { useRouter } from "next/router.js";
import { Button, Col, Input, Row } from "antd";
import Heading from "../title/Heading";
import FilledButton from "../button/FilledButton";
import { SearchOutlined } from "@ant-design/icons";
import { CSVLink } from "react-csv";
import ReactToPrint from "react-to-print";

function PageHeader(props) {
  const {
    title,
    onSearchChange,
    btnTitle,
    onNavigate,
    placeholder,
    showButton,
    showSearchBox = true,
    localStorage,
    btnTitleMedia,
    currentData,
    componentRef,
  } = props;
  const router = useRouter();

  const handleBack = () => {
    if (typeof localStorage === "function") {
      localStorage();
    }
    console.log("At back");
    router.back();
  };

  console.log(currentData);

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
          <Heading className="  ml-5" level={4} text={title} />
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
              {currentData && (
                <Button className="rounded-full border-midnight bg-midnight text-white ml-2 custom-css-pageheaderButton">
                  <CSVLink
                    filename={title + ".csv"}
                    data={currentData ? currentData : []}
                  >
                    Export to CSV
                  </CSVLink>
                </Button>
              )}
              {componentRef && (
                <ReactToPrint
                  trigger={() => (
                    <Button
                      className="rounded-full border-midnight bg-midnight text-white ml-2 custom-css-pageheaderButton"
                      onClick={() => {
                        handlePrint(null, () => {
                          componentRef.current;
                        });
                      }}
                    >
                      PRINT
                    </Button>
                  )}
                  content={() => componentRef.current}
                />
              )}
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
