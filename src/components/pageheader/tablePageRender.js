import { Col, Row } from 'antd';
import React from 'react'
import Heading from '../title/Heading';
import FilledButton from '../button/FilledButton';

function TablePageRender(props) {
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
  return (
    <>
      <Row>
        <Col span={19}>
          <Heading
            className=" whitespace-nowrap ml-5"
            level={4}
            text="Own Platform Data"
          />
        </Col>
        {/* If the showButtons variable is true, the content inside the
        parentheses will be rendered; otherwise, it won't. */}
        <Col className="flex justify-end" span={4}>
          {showButton && (
            <FilledButton
              disabled={platformDataEntered}
              text="+ Add Own Platform Data"
              className="rounded-full border-midnight bg-midnight text-white"
              onClick={handlePlatformShowInput}
            />
          )}
        </Col>
      </Row>
    </>
  );
}

export default TablePageRender
