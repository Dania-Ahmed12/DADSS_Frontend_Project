// TableItemRenderer.js
import React from "react";
import Heading from "../title/Heading";
import AntdTable from "./AntdTable";


const TableItemRenderer = ({ title, columns, data, pagination }) => (
  <div>
    <header className="flex">
      <Heading level={4} text={title} />
    </header>
    <div className="mb-12">
      <AntdTable
        columns={columns}
        data={data}
        pagination={pagination}
        scrollConfig={{ x: 250 }}
      />
    </div>
  </div>
);

export default TableItemRenderer;
