// import React from "react";
// import { RxArrowLeft } from "react-icons/rx";
// import { useRouter } from "next/router.js";
// import { Col, Input, Row } from "antd";
// import Heading from "../title/Heading";
// import FilledButton from "../button/FilledButton";
// import { SearchOutlined } from "@ant-design/icons";

// function PageHeader(props) {
//   const {
//     title,
//     onSearchChange,
//     btnTitle,
//     onNavigate,
//     placeholder,
//     showButton,
//     showSearchBox = true,
//     sessionStorage,
//   } = props;
//   const router = useRouter();

//   const handleBack = () => {
//     // Check if the callback function for removing session storage is provided
//     if (typeof sessionStorage === "function") {
//       sessionStorage();
//     }
//     router.back();
//   };
//   return (
//     <>
//       <Row className="flex items-center mt-3">
//         <RxArrowLeft
//           onClick={handleBack}
//           cursor={"pointer"}
//           className="ml-5"
//           fontSize={25}
//         />
//         <span
//           onClick={handleBack}
//           className=" text-sm font-medium"
//           style={{ cursor: "pointer" }}
//         >
//           Back
//         </span>
//       </Row>
//       <Row className="flex flex-wrap mt-5">
//   <Col
//   span={10}
//    className="flex justify-start">
//     <Heading className="ml-5" level={4} text={title} />
//   </Col>
//   <Col span={13} className={showButton ? "ml-7" : "ml-8"}>
//     {showSearchBox && (
//       <div className=" flex justify-item-end">
//         <Input
//           size="large"
//           allowClear
//           prefix={<SearchOutlined />}
//           className="search-input"
//           onChange={(e) => onSearchChange(e.target.value)}
//           placeholder={placeholder}
//         />
//         {showButton && (
//           <FilledButton
//             text={btnTitle}
//             className="rounded-full border-midnight bg-midnight text-white ml-2 "
//             onClick={onNavigate}
//           />
//         )}
//       </div>
//     )}
//   </Col>
// </Row>

//     </>
//   );
// }

// export default PageHeader;

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
  } = props;
  const router = useRouter();

  const handleBack = () => {
    if (typeof sessionStorage === "function") {
      sessionStorage();
    }
    router.back();
  };

  return (
    <>
      <Row className="flex items-center mt-3">
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
          sm={12}
          md={12}
          lg={12}
          xl={12}
          xxl={12}
          className="flex justify-start"
        >
          <Heading className="ml-5" level={4} text={title} />
        </Col>
        <Col
          xs={24}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          xxl={12}
          // className={showButton ? "ml-1" : "ml-0"}
        >
          {showSearchBox && (
            <div className="flex justify-end mr-5">
              <Input
                size="large"
                allowClear
                prefix={<SearchOutlined />}
                className="search-input"
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={placeholder}
              />
              {showButton && (
                <FilledButton
                  text={btnTitle}
                  className="rounded-full border-midnight bg-midnight text-white ml-2"
                  onClick={onNavigate}
                />
              )}
            </div>
          )}
        </Col>
      </Row>
    </>
  );
}

export default PageHeader;
