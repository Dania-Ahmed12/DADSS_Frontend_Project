import { useState } from "react";
import { Col, Row, Table, Form, Modal } from "antd";
import Heading from "../title/Heading";
import SimpleButton from "../button/SimpleButton";
import styled from "styled-components";
import FilledButton from "../button/FilledButton";
import InputBox from "../form/InputBox";
import SelectBox from "../form/SelectBox";
import { useForm } from "antd/lib/form/Form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputNumBox from "../form/InputNumBox";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import React from "react";
import { sumggled_items_subCategories } from "../../helper/dropdown";
import AntdTable from "../table/AntdTable";

function GoodsTable(props) {
  const { goodsData, setGoodsData, showButtons } = props;

  // Form initialization for goods data
  const [goodsForm] = useForm();

  // used to track the currently editing item's index in the goodsData array.
  const [goodsKey, setGoodsKey] = useState("");
  //goodsData array that is currently being edited
  // When you call setGoodsKey(newValue), it updates the value of goodsKey to newValue.

  // State for managing the visibility of different input sections
  const [showInputs, setShowInputs] = useState({
    goodsColumns: false,
  });

  // State for managing selected category and subcategory
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  // Handler for category change to update selected category and reset subcategory
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  // Function to show input fields for adding platform data
  const handleGoodsColumnShowInput = () => {
    goodsForm.resetFields();
    setShowInputs({ ...showInputs, goodsColumns: true });
  };

  // Function to handle cancelling the addition of platform data
  const handleGoodsCancel = (event) => {
    event.preventDefault();
    Modal.confirm({
      title: `Are you sure, you want don't want to add data?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setShowInputs({ ...showInputs, goodsColumns: false });
      },
    });
  };

  // Function to handle deleting platform data
  const handleGoodsDelete = (record_index) => {
    Modal.confirm({
      title: `Are you sure, you want to delete this field?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setGoodsData((prev) =>
          // Remove the item at the specified index from the goods data array
          // keep the elements in the array where the index is not equal to the record_index
          prev.filter((item, index) => index !== record_index)
        );
      },
    });
    goodsForm.resetFields();
  };

  // Check if the current row is being edited by comparing its index with the goodsKey state variable
  const isGoodsEditing = (record_index) => record_index === goodsKey;

  // Function to handle editing goods data
  const goodsDataEdited = (key) => {
    const editedValues = goodsForm.getFieldValue();
    // Create a new object with the edited values
    const newEdited = {
      ...editedValues,
    };
    setGoodsData((previous) => {
      // Update the Jetty data state by replacing the item at the specified key/index with the new edited item
      const newItems = [...previous];
      newItems[key] = newEdited;
      return newItems;
    });
    setGoodsKey("");
    goodsForm.resetFields();
  };

  const onGoodsFinish = async () => {
    const validatedValues = await goodsForm.validateFields();
    if (validatedValues) {
      // Update the Jetty data state by adding a new item with the validated values
      setGoodsData((current) => [
        ...current,
        {
          ...validatedValues,
        },
      ]);
      toast.success(`Goods data added`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setShowInputs({ ...showInputs, goodsColumns: false });
      goodsForm.resetFields();
    }
  };
  // If you directly used setGoodsData([...current, ...validatedValues]),
  // there's a chance that current might not be the latest state when the update happens

  // Checking if `props.reportKeys` is provided, otherwise using default values
  const reportKeys = props.reportKeys
    ? props.reportKeys
    : {
        item: "srg_item",
        qty: "srg_qty",
        denomination: "srg_denomination",
        category: "srg_category",
        subcategory: "srg_subcategory",
        confiscated: "srg_confiscated",
        value: "srg_value",
        source: "srg_source",
      };
  const goodsColumns = [
    {
      title: "Item",
      dataIndex: reportKeys.item,
      render: (text, record, index) => {
        // Conditionally render an input field or existing text
        return (showInputs.goodsColumns && index === 0) |
          isGoodsEditing(index) ? (
          // If conditions met, render an input field
          <StyledInput>
            <InputBox
              style={{ width: 100 }}
              placeholder="Item"
              name={reportKeys.item}
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]}
            />
          </StyledInput>
        ) : (
          // If conditions not met, render the existing text
          text
        );
      },
    },
    {
      title: "Quantity",
      dataIndex: reportKeys.qty,
      render: (text, record, index) => {
        return (showInputs.goodsColumns && index === 0) |
          isGoodsEditing(index) ? (
          <StyledInput>
            <InputNumBox
              placeholder="Quantity"
              name={reportKeys.qty}
              type="number"
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]}
            />
          </StyledInput>
        ) : (
          text
        );
      },
    },
    {
      title: "Denomination",
      dataIndex: reportKeys.denomination,
      render: (text, record, index) => {
        return (showInputs.goodsColumns && index === 0) |
          isGoodsEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 100 }}
              placeholder="Denomination"
              name={reportKeys.denomination}
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]}
            />
          </StyledInput>
        ) : (
          text
        );
      },
    },
    {
      title: "Category",
      ellipsis: true,
      dataIndex: reportKeys.category,
      render: (text, record, index) => {
        return (showInputs.goodsColumns && index === 0) |
          isGoodsEditing(index) ? (
          <StyledInput>
            <SelectBox
              placeholder="Category"
              name={reportKeys.category}
              onChange={handleCategoryChange}
              options={sumggled_items_subCategories.map((item) => ({
                label: item.category,
                value: item.category,
              }))}
              rules={[{ required: true, message: "Required Field!" }]}
            />
          </StyledInput>
        ) : (
          text
        );
      },
    },
    {
      title: "Sub Category",
      ellipsis: true,
      dataIndex: reportKeys.subcategory,
      render: (text, record, index) => {
        return (showInputs.goodsColumns && index === 0) |
          isGoodsEditing(index) ? (
          <StyledInput>
            <SelectBox
              placeholder="Sub Category"
              name={reportKeys.subcategory}
              onChange={(value) => setSelectedSubcategory(value)}
              //  If the category is found, it extracts the associated subcategories and maps them
              //into an array of objects with label and value properties.
              options={
                selectedCategory
                  ? sumggled_items_subCategories
                      .find((item) => item.category === selectedCategory)
                      ?.subcategories.map((subCategory) => ({
                        label: subCategory,
                        value: subCategory,
                      }))
                  : []
              }
              disabled={!selectedCategory}
              value={selectedSubcategory}
              rules={[{ required: true, message: "Required Field!" }]}
            />
          </StyledInput>
        ) : (
          text
        );
      },
    },
    {
      title: "Confiscated",
      dataIndex: reportKeys.confiscated,
      render: (text, record, index) => {
        return (showInputs.goodsColumns && index === 0) |
          isGoodsEditing(index) ? (
          <StyledInput>
            <SelectBox
              placeholder="Confiscated"
              name={reportKeys.confiscated}
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]}
              options={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
              ]}
            />
          </StyledInput>
        ) : (
          text
        );
      },
    },
    {
      title: "Value $",
      dataIndex: reportKeys.value,
      render: (text, record, index) => {
        return (showInputs.goodsColumns && index === 0) |
          isGoodsEditing(index) ? (
          <StyledInput>
            <InputNumBox
              placeholder="Value"
              name={reportKeys.value}
              type="number"
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]}
            />
          </StyledInput>
        ) : (
          text
        );
      },
    },
    {
      title: "Source",
      dataIndex: reportKeys.source,
      render: (text, record, index) => {
        return (showInputs.goodsColumns && index === 0) |
          isGoodsEditing(index) ? (
          <StyledInput>
            <InputBox
              style={{ width: 100 }}
              placeholder="Source"
              name={reportKeys.source}
              rules={[
                {
                  required: true,
                  message: "Required Field!",
                },
              ]}
            />
          </StyledInput>
        ) : (
          text
        );
      },
    },
    {
      title: "",
      dataIndex: "action",
      render: (text, record, index) => {
        if (showButtons) {
          if (showInputs.goodsColumns && index === 0) {
            return (
              <Form.Item>
                <div style={{ display: "flex" }}>
                  <SimpleButton
                    onClick={handleGoodsCancel}
                    style={{
                      fontWeight: "bold",
                    }}
                    text="Cancel"
                  />
                  <SimpleButton
                    style={{
                      fontWeight: "bold",
                      color: "white",
                      backgroundColor: "#51AE3B",
                    }}
                    text="Save"
                    onClick={onGoodsFinish}
                  />
                </div>
              </Form.Item>
            );
          } else {
            if (!showInputs.goodsColumns) {
              if (isGoodsEditing(index)) {
                return (
                  <Form.Item>
                    <div style={{ display: "flex" }}>
                      <SimpleButton
                        onClick={() => {
                          setGoodsKey("");
                          goodsForm.resetFields();
                        }}
                        style={{
                          fontWeight: "bold",
                        }}
                        text="Cancel"
                      />
                      <SimpleButton
                        onClick={() => {
                          goodsDataEdited(index);
                        }}
                        style={{
                          fontWeight: "bold",
                          color: "white",
                          backgroundColor: "#ffbf00",
                        }}
                        text="Edit"
                      />
                    </div>
                  </Form.Item>
                );
              } else {
                return (
                  <IconsStylingWrap>
                    <MdModeEditOutline
                      className="editIcon"
                      onClick={() => {
                        setGoodsKey(index);
                        goodsForm.setFieldsValue(record);
                        goodsForm.resetFields;
                      }}
                    />
                    <MdDelete
                      onClick={() => handleGoodsDelete(index)}
                      className="deleteIcon"
                    />
                  </IconsStylingWrap>
                );
              }
            }
          }
        }
      },
    },
  ];
  // Log goodsData in the GoodsTable component
  console.log("goodsData:", goodsData);

  return (
    <div className="mb-10">
      {/* //{" "} */}
      {/* <Form form={goodsForm} onFinish={onGoodsFinish} className="mb-8"> */}
      <Row>
        <Col span={12} className="flex justify-start">
          <Heading className="ml-5" level={5} text="Goods Details" />
        </Col>
        <Col span={12} className="flex justify-end">
          {showButtons && (
            <FilledButton
              text="+ Add Goods Details"
              className="rounded-full border-midnight bg-midnight text-white mr-4"
              onClick={handleGoodsColumnShowInput}
              disabled={goodsKey !== ""}
            />
          )}
        </Col>
      </Row>

      {/* if showInputs.goodsColumns is true. If it is, it adds an empty row ({})
        at the beginning of the list. If not, it just shows the list as it is. */}
      <AntdTable
        form={goodsForm}
        onFinish={onGoodsFinish}
        scrollConfig={{ x: true }}
        columns={goodsColumns}
        data={showInputs.goodsColumns ? [{}, ...goodsData] : goodsData}
        // dataSource={showInputs.goodsColumns ? [{}] : goodsData}
        pagination={true}
      />

      {/* //{" "} */}
      {/* </Form> */}
    </div>
  );
}

export default GoodsTable;
const StyledInput = styled.div`
  .ant-form-item-explain-error {
    font-size: 12px;
  }
`;
const StyledDiv = styled.div`
  box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
    rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
  border-radius: 10px;
`;
const IconsStylingWrap = styled.div`
  display: flex;
  /* gap: 20px; */
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
`;
