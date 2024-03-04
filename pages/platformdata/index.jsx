// import React, { useEffect, useState } from "react";
// import AntdTable from "../../src/components/table/AntdTable";
// import { Button, Checkbox, Form, Modal, Result } from "antd";
// import SimpleButton from "../../src/components/button/SimpleButton";
// import InputBox from "../../src/components/form/InputBox";
// import SelectBox from "../../src/components/form/SelectBox";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchAllPlatformData } from "../../src/redux/thunks/platformData";
// import styled from "styled-components";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useForm } from "antd/lib/form/Form";
// import axios from "axios";
// import PageHeader from "../../src/components/pageheader/pageHeader";
// import { MdModeEditOutline } from "react-icons/md";
// import { RxArrowLeft } from "react-icons/rx";
// import ReactDragListView from "react-drag-listview"; // Import ReactDragListView

// const StyledInput = styled.div`
//   .ant-form-item-explain-error {
//     font-size: 12px;
//   }
// `;

// const IconsStylingWrap = styled.div`
//   display: flex;
//   /* gap: 20px; */
//   .editIcon {
//     color: #28387e;
//     background-color: #f0f3f8;
//     border-radius: 20px;
//     font-size: 25px;
//     padding: 5px;
//     margin-right: 10px;
//     cursor: pointer;
//   }
//   .deleteIcon {
//     color: #e96162;
//     background-color: #f9e7e8;
//     border-radius: 20px;
//     font-size: 25px;
//     padding: 5px;
//     cursor: pointer;
//   }
// `;
// const BackIcon = styled.div`
// .inputWithButtonStyle = {
//   position: 'relative',
//   display: 'inline-block',
// };

// .backButtonStyle = {
//   position: 'absolute',
//   right: 5,
//   top: 5,
//   border: 'none',
//   background: 'none',
//   cursor: 'pointer',
// };
// `;

// const req_rule = {
//   required: true,
//   message: "Required",
// };

// function PlatformId() {
//   const [showInputs, setShowInputs] = useState(false);
//   const [disabled, setDisabled] = useState(false);
//   const [searchData, setSearchData] = useState("");
//   const [form] = useForm();
//   const { data, isLoading, error } = useSelector(
//     (state) => state.fetchPlatformData
//   );
//   const dispatch = useDispatch();
//   // Define state to store the options data
//   const [platformTypes, setPlatformTypes] = useState([]);
//   const [platformSq, setPlatformSq] = useState([]);
//   const [selectedType, setSelectedType] = useState(""); // Added selectedType state
//   const [selectedSquadron, setSelectedSquadron] = useState("");
//   const [filteredDataSource, setFilteredDataSource] = useState(null);
//   const [accessDenied, setAccessDenied] = useState(false);
//   const [accessDeniedAdd, setAccessDeniedAdd] = useState(false);
//   const [accessDeniedEdit, setAccessDeniedEdit] = useState(false);
//   const [platformKey, setPlatformKey] = useState("");
//    const [currentData, setCurrentData] = useState(data);


//   // Retrieve the stored permissions array from localStorage
//   const storedPermissions = JSON.parse(localStorage.getItem("permissions"));
//   const isSuperUser = JSON.parse(localStorage.getItem("is_superuser"));
//   useEffect(() => {
//     // Check if storedPermissions is an array and "view_platforms" exists in it
//     if (
//       isSuperUser === true ||
//       (Array.isArray(storedPermissions) &&
//         storedPermissions.includes("view_platforms"))
//     ) {
//       // If "view_platforms" exists in the permissions array, set accessDenied to true
//       setAccessDenied(false);
//     } else {
//       // If "view_platforms" does not exist in the permissions array or storedPermissions is not an array, set accessDenied to false
//       setAccessDenied(true);
//     }
//   }, []);

//   useEffect(() => {
//     if (
//       isSuperUser === true ||
//       (Array.isArray(storedPermissions) &&
//         storedPermissions.includes("add_platforms"))
//     ) {
//       setAccessDeniedAdd(false);
//     } else {
//       setAccessDeniedAdd(true);
//     }
//   }, []);

//   useEffect(() => {
//     if (
//       isSuperUser === true ||
//       (Array.isArray(storedPermissions) &&
//         storedPermissions.includes("change_platforms"))
//     ) {
//       setAccessDeniedEdit(false);
//     } else {
//       setAccessDeniedEdit(true);
//     }
//   }, []);

//   const fetchPlatformTypes = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/platform_type`
//       );
//       const types = response.data.map((item) => ({
//         key: item.type_key,
//         title: item.type_title,
//       }));
//       setPlatformTypes(types);
//     } catch (error) {
//       console.error("Error fetching platform types:", error);
//     }
//   };
//   const fetchPlatformSquardon = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/platform_squadron`
//       );
//       const types = response.data.map((item) => ({
//         key: item.squadron_key,
//         title: item.squadron_title,
//       }));
//       setPlatformSq(types);
//     } catch (error) {
//       console.error("Error fetching platform Sq:", error);
//     }
//   };
//   useEffect(() => {
//     fetchPlatformTypes();
//     fetchPlatformSquardon();
//   }, []);
//   useEffect(() => {
//     if (data) {
//       setFilteredDataSource(data);
//     }
//   }, [data]);

//   const extractUniqueValues = (data, attribute) => {
//     if (!data) {
//       return [];
//     }
//     return [...new Set(data.map((item) => item[attribute]))].map((value) => ({
//       text: value,
//       value: value,
//     }));
//   };

//   const isPlatformEditing = (record_index) => record_index === platformKey;

//   const PlatformDataEdited = async (key) => {
//     const editedValues = form.getFieldValue();
//     console.log(editedValues);
//     console.log(key);
//     try {
//       const response = await axios.put(
//         `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/platform/${editedValues.pf_key}`,
//         editedValues
//       );
//       if (response.status === 201 || response.status === 200) {
//         console.log(response, data);
//         toast.success("Platform Data Edited", {
//           position: "top-right",
//           autoClose: 1000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           theme: "dark",
//         });
//       } else {
//         // For other errors, display the default error message
//         toast.error(`Error : Platfrom Data Edit`, {
//           position: "top-right",
//           autoClose: 1000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           theme: "dark",
//         });
//       }
//       dispatch(fetchAllPlatformData());
//     } catch (error) {
//       console.error("Error editing platform:", error);
//     }

//     setPlatformKey("");
//     form.resetFields();
//   };

//   const columns = [
//     {
//       title: "Platform ID",
//       dataIndex: "pf_id",
//       key: "pf_id",
//       ellipsis: false,
//       width: 250,
//       // filters: extractUniqueValues(data, "pf_id"),
//       // onFilter: (value, record) => record.pf_id.includes(value),
//       // filterSearch: true,
//       // sorter: (a, b) => a.pf_id.localeCompare(b.pf_id),
//       // sortDirections: ["descend", "ascend"],
//       filters: extractUniqueValues(data, "pf_id").filter(
//         (item) => item !== null
//       ), // Filter out null values
//       onFilter: (value, record) => {
//         if (value === null) {
//           return record.pf_id === null;
//         }
//         return record.pf_id.includes(value);
//       },
//       filterSearch: true,
//       sorter: (a, b) => {
//         if (a.pf_id === null && b.pf_id === null) {
//           return 0;
//         } else if (a.pf_id === null) {
//           return 1; // Place null values at the end
//         } else if (b.pf_id === null) {
//           return -1; // Place null values at the end
//         }
//         return a.pf_id.localeCompare(b.pf_id);
//       },
//       sortDirections: ["descend", "ascend"],
//       render: (text, record, index) => {
//         if ((showInputs && index === 0) | isPlatformEditing(index)) {
//           return (
//             <StyledInput>
//               <InputBox
//                 style={{ width: 150 }}
//                 placeholder="Platform ID"
//                 name="pf_id"
//                 minLength={6}
//                 maxLength={12}
//                 rules={[
//                   req_rule,
//                   {
//                     pattern: /^[0-9]+$/,
//                     message: "ID Number can only contain numbers.",
//                   },
//                 ]}
//               />
//             </StyledInput>
//           );
//         } else {
//           return text;
//         }
//       },
//     },

//     {
//       title: "Full Name",
//       dataIndex: "pf_name",
//       ellipsis: false,
//       key: "pf_name",
//       width: 250,
//       // filters: extractUniqueValues(data, "pf_name"),
//       // sorter: (a, b) => a.pf_name.localeCompare(b.pf_name),
//       // sortDirections: ["descend", "ascend"],
//       // filterSearch: true,
//       // onFilter: (value, record) => record.pf_name.includes(value),
//       filters: extractUniqueValues(data, "pf_name").filter(
//         (item) => item !== null
//       ), // Filter out null values
//       onFilter: (value, record) => {
//         if (value === null) {
//           return record.pf_name === null;
//         }
//         return record.pf_name.includes(value);
//       },
//       filterSearch: true,
//       sorter: (a, b) => {
//         if (a.pf_name === null && b.pf_name === null) {
//           return 0;
//         } else if (a.pf_name === null) {
//           return 1; // Place null values at the end
//         } else if (b.pf_name === null) {
//           return -1; // Place null values at the end
//         }
//         return a.pf_name.localeCompare(b.pf_name);
//       },
//       sortDirections: ["descend", "ascend"],
//       render: (text, record, index) => {
//         if ((showInputs && index === 0) | isPlatformEditing(index)) {
//           return (
//             <StyledInput>
//               <InputBox
//                 style={{ width: 150 }}
//                 placeholder="Name"
//                 name="pf_name"
//                 minLength={3}
//                 maxLength={15}
//                 rules={[req_rule]}
//               />
//             </StyledInput>
//           );
//         } else {
//           return text;
//         }
//       },
//     },
//     {
//       title: "Type",
//       key: "pf_type",
//       dataIndex: "pf_type",
//       ellipsis: false,
//       width: 250,
//       filters: extractUniqueValues(data, "pf_type").filter(
//         (item) => item !== null
//       ), // Filter out null values
//       onFilter: (value, record) => {
//         if (value === null) {
//           return record.pf_type === null;
//         }
//         return record.pf_type.includes(value);
//       },
//       filterSearch: true,
//       sorter: (a, b) => {
//         if (a.pf_type === null && b.pf_type === null) {
//           return 0;
//         } else if (a.pf_type === null) {
//           return 1; // Place null values at the end
//         } else if (b.pf_type === null) {
//           return -1; // Place null values at the end
//         }
//         return a.pf_type.localeCompare(b.pf_type);
//       },
//       sortDirections: ["descend", "ascend"],
//       render: (text, record, index) => {
//         if ((showInputs && index === 0) | isPlatformEditing(index)) {
//           const isInitialRow = index === 0;
//           const isShowInputs = showInputs || isInitialRow;
//           const isOtherSelected = selectedType === "Others";

//           return (
//             <StyledInput>
//               {isShowInputs && (
//                 <>
//                   {!isOtherSelected ? (
//                     <SelectBox
//                       placeholder="Vessels"
//                       name="pf_type"
//                       style={{ width: 150 }}
//                       rules={[{ required: true, message: "Required" }]}
//                       options={[
//                         ...platformTypes.map((item) => ({
//                           value: item.key,
//                           label: item.title,
//                         })),
//                         { value: "Others", label: "Others" },
//                       ]}
//                       onChange={(value) => {
//                         setSelectedType(value);
//                         form.setFieldsValue({
//                           pf_type: value !== "Others" ? value : "",
//                         });
//                         if (value !== "Others") {
//                           // Logic to handle normal selection
//                         } else {
//                           // Reset or prepare to show InputBox
//                         }
//                       }}
//                     />
//                   ) : (
//                     <>
//                       <div
//                         style={{
//                           position: "relative",
//                           display: "inline-block",
//                         }}
//                       >
//                         <InputBox
//                           style={{
//                             width: 150,
//                           }}
//                           rules={[{ required: true, message: "Required" }]}
//                           placeholder="Enter details"
//                           name="pf_type"
//                           //  style={{ paddingRight: 30 }} // Make room for the button
//                         />
//                         <Button
//                           style={{
//                             position: "absolute",
//                             right: 5,
//                             top: -5,
//                             border: "none",
//                             background: "none",
//                             color: "blue",
//                             cursor: "pointer",
//                             fontSize: 20,
//                             fontWeight: "bold",
//                           }}
//                           onClick={() => {
//                             // Logic to show SelectBox and hide InputBox
//                             setSelectedType(""); // Example of resetting state
//                           }}
//                         >
//                           &#x21A9;{" "}
//                           {/* Leftwards Arrow With Hook for back symbol */}
//                         </Button>
//                       </div>
//                       {/* <InputBox
//                        placeholder="Enter details"
//                        name="pf_type_other" // Use a different field name for manual entry
//                        rules={[{ required: true, message: "Required" }]}
//                        style={{ width: 150 }}
//                      />
//                      <Button
//                        icon={<RxArrowLeft />} // Replace with your actual back icon or element
//                        onClick={() => setSelectedType("")} // Reset or adjust logic to show SelectBox again
//                      /> */}
//                     </>
//                   )}
//                 </>
//               )}
//             </StyledInput>
//           );
//         } else {
//           return text;
//         }
//       },
//     },

//     {
//       title: "Squadron",

//       key: "pf_squadron",
//       dataIndex: "pf_squadron",
//       ellipsis: false,
//       width: 250,
//       filters: extractUniqueValues(data, "pf_squadron").filter(
//         (item) => item !== null
//       ), // Filter out null values
//       onFilter: (value, record) => {
//         if (value === null) {
//           return record.pf_squadron === null;
//         }
//         return record.pf_squadron.includes(value);
//       },
//       filterSearch: true,
//       sorter: (a, b) => {
//         if (a.pf_squadron === null && b.pf_squadron === null) {
//           return 0;
//         } else if (a.pf_squadron === null) {
//           return 1; // Place null values at the end
//         } else if (b.pf_squadron === null) {
//           return -1; // Place null values at the end
//         }
//         return a.pf_squadron.localeCompare(b.pf_squadron);
//       },
//       sortDirections: ["descend", "ascend"],
//       render: (text, record, index) => {
//         if ((showInputs && index === 0) | isPlatformEditing(index)) {
//           const isInitialRow = index === 0;
//           const isShowInputs = showInputs || isInitialRow;
//           const isOtherSelected = selectedSquadron === "Others";

//           return (
//             <StyledInput>
//               {isShowInputs && (
//                 <>
//                   {!isOtherSelected ? (
//                     <SelectBox
//                       placeholder="Vessels"
//                       name="pf_squadron"
//                       style={{ width: 150 }}
//                       rules={[{ required: true, message: "Required" }]}
//                       options={[
//                         ...platformSq.map((item) => ({
//                           value: item.key,
//                           label: item.title,
//                         })),
//                         { value: "Others", label: "Others" },
//                       ]}
//                       onChange={(value) => {
//                         setSelectedSquadron(value);
//                         form.setFieldsValue({
//                           pf_squadron: value !== "Others" ? value : "",
//                         });
//                         if (value !== "Others") {
//                           // Logic to handle normal selection
//                         } else {
//                           // Reset or prepare to show InputBox
//                         }
//                       }}
//                     />
//                   ) : (
//                     <>
//                       <div
//                         style={{
//                           position: "relative",
//                           display: "inline-block",
//                         }}
//                       >
//                         <InputBox
//                           style={{
//                             width: 150,
//                           }}
//                           rules={[{ required: true, message: "Required" }]}
//                           placeholder="Enter details"
//                           name="pf_squadron"
//                         />
//                         <Button
//                           style={{
//                             position: "absolute",
//                             right: 5,
//                             top: -5,
//                             border: "none",
//                             background: "none",
//                             color: "blue",
//                             cursor: "pointer",
//                             fontSize: 20,
//                             fontWeight: "bold",
//                           }}
//                           onClick={() => {
//                             // Logic to show SelectBox and hide InputBox
//                             setSelectedSquadron(""); // Example of resetting state
//                           }}
//                         >
//                           &#x21A9;{" "}
//                           {/* Leftwards Arrow With Hook for back symbol */}
//                         </Button>
//                       </div>
//                     </>
//                   )}
//                 </>
//               )}
//             </StyledInput>
//           );
//         } else {
//           return text;
//         }
//       },
//     },

//     {
//       title: "CO",
//       key: "pf_co",
//       dataIndex: "pf_co",
//       ellipsis: false,
//       width: 250,
//       filters: extractUniqueValues(data, "pf_co").filter(
//         (item) => item !== null
//       ), // Filter out null values
//       onFilter: (value, record) => {
//         if (value === null) {
//           return record.pf_co === null;
//         }
//         return record.pf_co.includes(value);
//       },
//       filterSearch: true,
//       sorter: (a, b) => {
//         if (a.pf_co === null && b.pf_co === null) {
//           return 0;
//         } else if (a.pf_co === null) {
//           return 1; // Place null values at the end
//         } else if (b.pf_co === null) {
//           return -1; // Place null values at the end
//         }
//         return a.pf_co.localeCompare(b.pf_co);
//       },
//       sortDirections: ["descend", "ascend"],
//       render: (text, record, index) => {
//         if ((showInputs && index === 0) | isPlatformEditing(index)) {
//           return (
//             <StyledInput>
//               <InputBox
//                 placeholder="CO"
//                 name="pf_co"
//                 rules={[req_rule]}
//                 style={{ width: 150 }}
//               />
//             </StyledInput>
//           );
//         } else {
//           return text;
//         }
//       },
//     },
//     {
//       title: "Status",
//       dataIndex: "pf_status",
//       key: "pf_status",
//       width: 200,
//       filters: extractUniqueValues(data, "pf_status").filter(
//         (item) => item !== null
//       ), // Filter out null values
//       onFilter: (value, record) => {
//         if (value === null) {
//           return record.pf_status === null;
//         }
//         return record.pf_status.includes(value);
//       },
//       filterSearch: true,
//       sorter: (a, b) => {
//         if (a.pf_status === null && b.pf_status === null) {
//           return 0;
//         } else if (a.pf_status === null) {
//           return 1; // Place null values at the end
//         } else if (b.pf_status === null) {
//           return -1; // Place null values at the end
//         }
//         return a.pf_status.localeCompare(b.pf_status);
//       },
//       sortDirections: ["descend", "ascend"],
//       render: (text, record, index) => {
//         if ((showInputs && index === 0) | isPlatformEditing(index)) {
//           return (
//             <StyledInput>
//               <SelectBox
//                 placeholder="Status"
//                 name="pf_status"
//                 style={{ width: 150 }}
//                 rules={[req_rule]}
//                 options={[
//                   {
//                     value: "OPS",
//                     label: "OPS",
//                   },
//                   {
//                     value: "Non-OPS",
//                     label: "Non-OPS",
//                   },
//                 ]}
//                 onChange={(value) => {
//                   setSelectedType(value);
//                 }}
//               />
//             </StyledInput>
//           );
//         } else {
//           return text;
//         }
//       },
//     },
//     {
//       title: "Other Info",
//       dataIndex: "pf_info",
//       key: "pf_info",
//       width: 200,
//       render: (text, record, index) => {
//         if ((showInputs && index === 0) | isPlatformEditing(index)) {
//           return (
//             <StyledInput>
//               <InputBox
//                 placeholder="Other Info"
//                 name="pf_info"
//                 style={{ width: 150 }}
//               />
//             </StyledInput>
//           );
//         } else {
//           return text;
//         }
//       },
//     },
//     {
//       title: "",
//       width: 250,
//       dataIndex: "action",
//       key: "action",
//       render: (text, record, index) => {
//         if (showInputs && index === 0) {
//           return (
//             <Form.Item style={{ display: "flex" }}>
//               <div style={{ display: "flex" }}>
//                 <SimpleButton
//                   onClick={handleDelete}
//                   style={{
//                     fontWeight: "bold",
//                   }}
//                   text="Cancel"
//                 />
//                 <SimpleButton
//                   htmlType="submit"
//                   style={{
//                     fontWeight: "bold",
//                     color: "white",
//                     backgroundColor: "#51AE3B",
//                   }}
//                   text="Save"
//                 />
//               </div>
//             </Form.Item>
//           );
//         }
//         if (!showInputs) {
//           if (data.length && !isPlatformEditing(index)) {
//             if (accessDeniedEdit === false) {
//               return (
//                 <IconsStylingWrap>
//                   <>
//                     <MdModeEditOutline
//                       className="editIcon"
//                       onClick={() => {
//                         setPlatformKey(index);
//                         form.setFieldsValue(record);
//                       }}
//                       disable={showInputs}
//                     />
//                   </>
//                 </IconsStylingWrap>
//               );
//             }
//           }

//           if (isPlatformEditing(index)) {
//             return (
//               <Form.Item>
//                 <div style={{ display: "flex" }}>
//                   <SimpleButton
//                     // onClick={() => {
//                     //   setPlatformKey("");
//                     // }}
//                     onClick={() => {
//                       handleDelete();
//                       setPlatformKey("");
//                     }}
//                     style={{
//                       fontWeight: "bold",
//                     }}
//                     text="Cancel"
//                   />

//                   <SimpleButton
//                     onClick={() => {
//                       PlatformDataEdited(index);
//                     }}
//                     style={{
//                       fontWeight: "bold",
//                       color: "white",
//                       backgroundColor: "#ffbf00",
//                     }}
//                     text="Edit"
//                   />
//                 </div>
//               </Form.Item>
//             );
//           }
//         }
//       },
//     },

//     // },
//   ];

//   const handleShowInput = () => {
//     setShowInputs(true);
//     form.resetFields();
//     setPlatformKey("");

//     setDisabled(true);
//     setSelectedType("");
//     setSelectedSquadron("");
//   };

//   const handleDelete = (event) => {
//     Modal.confirm({
//       title: `Are you sure, you want to cancel?`,
//       okText: "Yes",
//       okType: "danger",
//       centered: "true",
//       onOk: () => {
//         setShowInputs(false);
//         setDisabled(false);
//         form.resetFields();
//       },
//     });
//   };

//   const onFinish = async () => {
//     const validatedValues = await form.validateFields();
//     if (validatedValues) {
//       try {
//         const formData = {
//           ...validatedValues,
//         };

//         const response = await axios.post(
//           `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/platform`,
//           formData
//         );
//         if (response.status === 201) {
//           toast.success("Platform Data Saved", {
//             position: "top-right",
//             autoClose: 1000,
//             hideProgressBar: false,
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             progress: undefined,
//             theme: "dark",
//           });
//           setShowInputs(false);
//           setDisabled(false);
//           form.resetFields();
//           dispatch(fetchAllPlatformData());
//         }
//       } catch (error) {
//         if (error.response && error.response.status === 403) {
//           // Customize the error message for 403 Forbidden error
//           toast.error("You are not authorized to perform this action.", {
//             position: "top-right",
//             autoClose: 1000,
//             hideProgressBar: false,
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             progress: undefined,
//             theme: "dark",
//           });
//         } else {
//           // For other errors, display the default error message
//           toast.error(`${error}`, {
//             position: "top-right",
//             autoClose: 1000,
//             hideProgressBar: false,
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             progress: undefined,
//             theme: "dark",
//           });
//         }
//         setShowInputs(false);

//         form.resetFields();
//       }
//     }
//   };

//   useEffect(() => {
//     dispatch(fetchAllPlatformData(searchData));
//   }, [searchData]);



//     const [dragColumns, setDragColumns] = useState(columns);
//     const defaultCheckedList = columns.map((item) => item.key);

//     const [checkedList, setCheckedList] = useState(defaultCheckedList);

//     // Set the default checkedList to include the keys of all columns
//     const optionss = columns.map(({ key, title }) => ({
//       label: title,
//       value: key,
//     }));
//     const options = columns
//       .filter((column) => column.key !== "action") // Exclude the "action" column
//       .map(({ key, title }) => ({
//         label: title,
//         value: key,
//       }));

//     useEffect(() => {
//       setCheckedList(columns.map((item) => item.key));
//       setDragColumns(columns);
//     }, []);

//     // Inside the useEffect hook where you handle checkbox changes
//     const handleCheckboxChange = (checkedValues) => {
//       setCheckedList(checkedValues);
//       const newDragColumns = dragColumns.map((item) => ({
//         ...item,
//         hidden: !checkedValues.includes(item.key) && item.key !== "action", // Exclude "action" column from hiding
//       }));
//       setDragColumns(newDragColumns);
//     };

//     const dragProps = {
//       onDragEnd(fromIndex, toIndex) {
//         console.log(`dragged from ${fromIndex} to ${toIndex}`);
//         const newColumns = [...dragColumns];
//         const item = newColumns.splice(fromIndex, 1)[0];
//         newColumns.splice(toIndex, 0, item);
//         setDragColumns(newColumns);
//       },
//       nodeSelector: "th",
//     };
//   return (
//     <>
//       <div>
//         <PageHeader
//           title="MSA Platform Data (View/Add)"
//           btnTitle={"Add Platform"} // Render the button only if access is not denied
//           btnTitleMedia="+"
//           onSearchChange={setSearchData}
//           onNavigate={handleShowInput}
//           placeholder="Search by Platform ID / Full Name "
//           showButton={accessDeniedAdd === false} // Show the button if access is not denied
//           // currentData={currentData}
//         />
//       </div>

//       {accessDenied ? (
//         <Result
//           status="403"
//           title="403 Forbidden"
//           subTitle="You don't have permission to access this resource."
//           extra={
//             <Button type="primary" onClick={() => router.push("/dashboard")}>
//               Back Home
//             </Button>
//           }
//         />
//       ) : (
//         <>
//           <div>
//             <AntdTable
//               scrollConfig={{ x: true }}
//               form={form}
//               onFinish={onFinish}
//               columns={dragColumns.filter((column) => !column.hidden)}
//               data={showInputs ? [data[0], ...data] : data}
//               loading={isLoading}
//               // setCurrentData={setCurrentData}
//             />
//           </div>
//           <div
//             className="fixed-checkbox flex  justify-center "
//             style={{
//               backgroundColor: "#F5F5F5",
//               padding: "20px",
//               width: "100%",
//               position: "sticky",
//               bottom: "0px",
//             }}
//           >
//             <Checkbox.Group
//               value={checkedList}
//               options={options}
//               onChange={handleCheckboxChange}
//             />
//           </div>
//         </>
//       )}
//     </>
//   );
// }

// export default PlatformId;

// export async function getServerSideProps(context) {
//   return {
//     props: {
//       data: {
//         title: "Platform Data",
//       },
//     },
//   };
// }
import React, { useEffect, useState } from "react";
import AntdTable from "../../src/components/table/AntdTable";
import { Button, Checkbox, Form, Modal, Result } from "antd";
import SimpleButton from "../../src/components/button/SimpleButton";
import InputBox from "../../src/components/form/InputBox";
import SelectBox from "../../src/components/form/SelectBox";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPlatformData } from "../../src/redux/thunks/platformData";
import styled from "styled-components";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "antd/lib/form/Form";
import axios from "axios";
import PageHeader from "../../src/components/pageheader/pageHeader";
import { MdModeEditOutline } from "react-icons/md";
import { RxArrowLeft } from "react-icons/rx";
import ReactDragListView from "react-drag-listview"; // Import ReactDragListView

const StyledInput = styled.div`
  .ant-form-item-explain-error {
    font-size: 12px;
  }
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
const BackIcon = styled.div`
.inputWithButtonStyle = {
  position: 'relative',
  display: 'inline-block',
};

.backButtonStyle = {
  position: 'absolute',
  right: 5,
  top: 5,
  border: 'none',
  background: 'none',
  cursor: 'pointer',
};
`;

const req_rule = {
  required: true,
  message: "Required",
};

function PlatformId() {
  const [showInputs, setShowInputs] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [form] = useForm();
  const { data, isLoading, error } = useSelector(
    (state) => state.fetchPlatformData
  );
  const dispatch = useDispatch();
  // Define state to store the options data
  const [platformTypes, setPlatformTypes] = useState([]);
  const [platformSq, setPlatformSq] = useState([]);
  const [selectedType, setSelectedType] = useState(""); // Added selectedType state
  const [selectedSquadron, setSelectedSquadron] = useState("");
  const [filteredDataSource, setFilteredDataSource] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [accessDeniedAdd, setAccessDeniedAdd] = useState(false);
  const [accessDeniedEdit, setAccessDeniedEdit] = useState(false);
  const [platformKey, setPlatformKey] = useState("");
  const [ currentData , setCurrentData] = useState(data)
  // Retrieve the stored permissions array from localStorage
  const storedPermissions = JSON.parse(localStorage.getItem("permissions"));
  const isSuperUser = JSON.parse(localStorage.getItem("is_superuser"));
  useEffect(() => {
    // Check if storedPermissions is an array and "view_platforms" exists in it
    if (
      isSuperUser === true ||
      (Array.isArray(storedPermissions) &&
        storedPermissions.includes("view_platforms"))
    ) {
      // If "view_platforms" exists in the permissions array, set accessDenied to true
      setAccessDenied(false);
    } else {
      // If "view_platforms" does not exist in the permissions array or storedPermissions is not an array, set accessDenied to false
      setAccessDenied(true);
    }
  }, []);

  useEffect(() => {
    if (
      isSuperUser === true ||
      (Array.isArray(storedPermissions) &&
        storedPermissions.includes("add_platforms"))
    ) {
      setAccessDeniedAdd(false);
    } else {
      setAccessDeniedAdd(true);
    }
  }, []);

  useEffect(() => {
    if (
      isSuperUser === true ||
      (Array.isArray(storedPermissions) &&
        storedPermissions.includes("change_platforms"))
    ) {
      setAccessDeniedEdit(false);
    } else {
      setAccessDeniedEdit(true);
    }
  }, []);

  const fetchPlatformTypes = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/platform_type`
      );
      const types = response.data.map((item) => ({
        key: item.type_key,
        title: item.type_title,
      }));
      setPlatformTypes(types);
    } catch (error) {
      console.error("Error fetching platform types:", error);
    }
  };
  const fetchPlatformSquardon = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/platform_squadron`
      );
      const types = response.data.map((item) => ({
        key: item.squadron_key,
        title: item.squadron_title,
      }));
      setPlatformSq(types);
    } catch (error) {
      console.error("Error fetching platform Sq:", error);
    }
  };
  useEffect(() => {
    fetchPlatformTypes();
    fetchPlatformSquardon();
  }, []);
  useEffect(() => {
    if (data) {
      setFilteredDataSource(data);
    }
  }, [data]);

  const extractUniqueValues = (data, attribute) => {
    if (!data) {
      return [];
    }
    return [...new Set(data.map((item) => item[attribute]))].map((value) => ({
      text: value,
      value: value,
    }));
  };

  const isPlatformEditing = (record_index) => record_index === platformKey;

  const PlatformDataEdited = async (key) => {
    const editedValues = form.getFieldValue();

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/platform/${editedValues.pf_key}`,
        editedValues
      );
      if (response.status === 201 || response.status === 200) {
        toast.success("Platform Data Edited", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        // For other errors, display the default error message
        toast.error(`Error : Platfrom Data Edit`, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
      dispatch(fetchAllPlatformData());
    } catch (error) {
      console.error("Error editing platform:", error);
    }

    setPlatformKey("");
    form.resetFields();
  };

  const columns = [
    {
      title: "Platform ID",
      dataIndex: "pf_id",
      key: "pf_id",
      ellipsis: false,
      width: 250,
      // filters: extractUniqueValues(data, "pf_id"),
      // onFilter: (value, record) => record.pf_id.includes(value),
      // filterSearch: true,
      // sorter: (a, b) => a.pf_id.localeCompare(b.pf_id),
      // sortDirections: ["descend", "ascend"],
      filters: extractUniqueValues(data, "pf_id").filter(
        (item) => item !== null
      ), // Filter out null values
      onFilter: (value, record) => {
        if (value === null) {
          return record.pf_id === null;
        }
        return record.pf_id.includes(value);
      },
      filterSearch: true,
      sorter: (a, b) => {
        if (a.pf_id === null && b.pf_id === null) {
          return 0;
        } else if (a.pf_id === null) {
          return 1; // Place null values at the end
        } else if (b.pf_id === null) {
          return -1; // Place null values at the end
        }
        return a.pf_id.localeCompare(b.pf_id);
      },
      sortDirections: ["descend", "ascend"],
      render: (text, record, index) => {
        if ((showInputs && index === 0) | isPlatformEditing(index)) {
          return (
            <StyledInput>
              <InputBox
                style={{ width: 150 }}
                placeholder="Platform ID"
                name="pf_id"
                minLength={6}
                maxLength={12}
                rules={[
                  req_rule,
                  {
                    pattern: /^[0-9]+$/,
                    message: "ID Number can only contain numbers.",
                  },
                ]}
              />
            </StyledInput>
          );
        } else {
          return text;
        }
      },
    },

    {
      title: "Full Name",
      dataIndex: "pf_name",
      ellipsis: false,
      key: "pf_name",
      width: 250,
      // filters: extractUniqueValues(data, "pf_name"),
      // sorter: (a, b) => a.pf_name.localeCompare(b.pf_name),
      // sortDirections: ["descend", "ascend"],
      // filterSearch: true,
      // onFilter: (value, record) => record.pf_name.includes(value),
      filters: extractUniqueValues(data, "pf_name").filter(
        (item) => item !== null
      ), // Filter out null values
      onFilter: (value, record) => {
        if (value === null) {
          return record.pf_name === null;
        }
        return record.pf_name.includes(value);
      },
      filterSearch: true,
      sorter: (a, b) => {
        if (a.pf_name === null && b.pf_name === null) {
          return 0;
        } else if (a.pf_name === null) {
          return 1; // Place null values at the end
        } else if (b.pf_name === null) {
          return -1; // Place null values at the end
        }
        return a.pf_name.localeCompare(b.pf_name);
      },
      sortDirections: ["descend", "ascend"],
      render: (text, record, index) => {
        if ((showInputs && index === 0) | isPlatformEditing(index)) {
          return (
            <StyledInput>
              <InputBox
                style={{ width: 150 }}
                placeholder="Name"
                name="pf_name"
                minLength={3}
                maxLength={15}
                rules={[req_rule]}
              />
            </StyledInput>
          );
        } else {
          return text;
        }
      },
    },
    {
      title: "Type",
      key: "pf_type",
      dataIndex: "pf_type",
      ellipsis: false,
      width: 250,
      filters: extractUniqueValues(data, "pf_type").filter(
        (item) => item !== null
      ), // Filter out null values
      onFilter: (value, record) => {
        if (value === null) {
          return record.pf_type === null;
        }
        return record.pf_type.includes(value);
      },
      filterSearch: true,
      sorter: (a, b) => {
        if (a.pf_type === null && b.pf_type === null) {
          return 0;
        } else if (a.pf_type === null) {
          return 1; // Place null values at the end
        } else if (b.pf_type === null) {
          return -1; // Place null values at the end
        }
        return a.pf_type.localeCompare(b.pf_type);
      },
      sortDirections: ["descend", "ascend"],
      render: (text, record, index) => {
        if ((showInputs && index === 0) | isPlatformEditing(index)) {
          const isInitialRow = index === 0;
          const isShowInputs = showInputs || isInitialRow;
          const isOtherSelected = selectedType === "Others";

          return (
            <StyledInput>
              {isShowInputs && (
                <>
                  {!isOtherSelected ? (
                    <SelectBox
                      placeholder="Vessels"
                      name="pf_type"
                      style={{ width: 150 }}
                      rules={[{ required: true, message: "Required" }]}
                      options={[
                        ...platformTypes.map((item) => ({
                          value: item.key,
                          label: item.title,
                        })),
                        { value: "Others", label: "Others" },
                      ]}
                      onChange={(value) => {
                        setSelectedType(value);
                        form.setFieldsValue({
                          pf_type: value !== "Others" ? value : "",
                        });
                        if (value !== "Others") {
                          // Logic to handle normal selection
                        } else {
                          // Reset or prepare to show InputBox
                        }
                      }}
                    />
                  ) : (
                    <>
                      <div
                        style={{
                          position: "relative",
                          display: "inline-block",
                        }}
                      >
                        <InputBox
                          style={{
                            width: 150,
                          }}
                          rules={[{ required: true, message: "Required" }]}
                          placeholder="Enter details"
                          name="pf_type"
                          //  style={{ paddingRight: 30 }} // Make room for the button
                        />
                        <Button
                          style={{
                            position: "absolute",
                            right: 5,
                            top: -5,
                            border: "none",
                            background: "none",
                            color: "blue",
                            cursor: "pointer",
                            fontSize: 20,
                            fontWeight: "bold",
                          }}
                          onClick={() => {
                            // Logic to show SelectBox and hide InputBox
                            setSelectedType(""); // Example of resetting state
                          }}
                        >
                          &#x21A9;{" "}
                          {/* Leftwards Arrow With Hook for back symbol */}
                        </Button>
                      </div>
                      {/* <InputBox
                       placeholder="Enter details"
                       name="pf_type_other" // Use a different field name for manual entry
                       rules={[{ required: true, message: "Required" }]}
                       style={{ width: 150 }}
                     />
                     <Button
                       icon={<RxArrowLeft />} // Replace with your actual back icon or element
                       onClick={() => setSelectedType("")} // Reset or adjust logic to show SelectBox again
                     /> */}
                    </>
                  )}
                </>
              )}
            </StyledInput>
          );
        } else {
          return text;
        }
      },
    },

    {
      title: "Squadron",

      key: "pf_squadron",
      dataIndex: "pf_squadron",
      ellipsis: false,
      width: 250,
      filters: extractUniqueValues(data, "pf_squadron").filter(
        (item) => item !== null
      ), // Filter out null values
      onFilter: (value, record) => {
        if (value === null) {
          return record.pf_squadron === null;
        }
        return record.pf_squadron.includes(value);
      },
      filterSearch: true,
      sorter: (a, b) => {
        if (a.pf_squadron === null && b.pf_squadron === null) {
          return 0;
        } else if (a.pf_squadron === null) {
          return 1; // Place null values at the end
        } else if (b.pf_squadron === null) {
          return -1; // Place null values at the end
        }
        return a.pf_squadron.localeCompare(b.pf_squadron);
      },
      sortDirections: ["descend", "ascend"],
      render: (text, record, index) => {
        if ((showInputs && index === 0) | isPlatformEditing(index)) {
          const isInitialRow = index === 0;
          const isShowInputs = showInputs || isInitialRow;
          const isOtherSelected = selectedSquadron === "Others";

          return (
            <StyledInput>
              {isShowInputs && (
                <>
                  {!isOtherSelected ? (
                    <SelectBox
                      placeholder="Vessels"
                      name="pf_squadron"
                      style={{ width: 150 }}
                      rules={[{ required: true, message: "Required" }]}
                      options={[
                        ...platformSq.map((item) => ({
                          value: item.key,
                          label: item.title,
                        })),
                        { value: "Others", label: "Others" },
                      ]}
                      onChange={(value) => {
                        setSelectedSquadron(value);
                        form.setFieldsValue({
                          pf_squadron: value !== "Others" ? value : "",
                        });
                        if (value !== "Others") {
                          // Logic to handle normal selection
                        } else {
                          // Reset or prepare to show InputBox
                        }
                      }}
                    />
                  ) : (
                    <>
                      <div
                        style={{
                          position: "relative",
                          display: "inline-block",
                        }}
                      >
                        <InputBox
                          style={{
                            width: 150,
                          }}
                          rules={[{ required: true, message: "Required" }]}
                          placeholder="Enter details"
                          name="pf_squadron"
                        />
                        <Button
                          style={{
                            position: "absolute",
                            right: 5,
                            top: -5,
                            border: "none",
                            background: "none",
                            color: "blue",
                            cursor: "pointer",
                            fontSize: 20,
                            fontWeight: "bold",
                          }}
                          onClick={() => {
                            // Logic to show SelectBox and hide InputBox
                            setSelectedSquadron(""); // Example of resetting state
                          }}
                        >
                          &#x21A9;{" "}
                          {/* Leftwards Arrow With Hook for back symbol */}
                        </Button>
                      </div>
                    </>
                  )}
                </>
              )}
            </StyledInput>
          );
        } else {
          return text;
        }
      },
    },

    {
      title: "CO",
      key: "pf_co",
      dataIndex: "pf_co",
      ellipsis: false,
      width: 250,
      filters: extractUniqueValues(data, "pf_co").filter(
        (item) => item !== null
      ), // Filter out null values
      onFilter: (value, record) => {
        if (value === null) {
          return record.pf_co === null;
        }
        return record.pf_co.includes(value);
      },
      filterSearch: true,
      sorter: (a, b) => {
        if (a.pf_co === null && b.pf_co === null) {
          return 0;
        } else if (a.pf_co === null) {
          return 1; // Place null values at the end
        } else if (b.pf_co === null) {
          return -1; // Place null values at the end
        }
        return a.pf_co.localeCompare(b.pf_co);
      },
      sortDirections: ["descend", "ascend"],
      render: (text, record, index) => {
        if ((showInputs && index === 0) | isPlatformEditing(index)) {
          return (
            <StyledInput>
              <InputBox
                placeholder="CO"
                name="pf_co"
                rules={[req_rule]}
                style={{ width: 150 }}
              />
            </StyledInput>
          );
        } else {
          return text;
        }
      },
    },
    {
      title: "Status",
      dataIndex: "pf_status",
      key: "pf_status",
      width: 200,
      filters: extractUniqueValues(data, "pf_status").filter(
        (item) => item !== null
      ), // Filter out null values
      onFilter: (value, record) => {
        if (value === null) {
          return record.pf_status === null;
        }
        return record.pf_status.includes(value);
      },
      filterSearch: true,
      sorter: (a, b) => {
        if (a.pf_status === null && b.pf_status === null) {
          return 0;
        } else if (a.pf_status === null) {
          return 1; // Place null values at the end
        } else if (b.pf_status === null) {
          return -1; // Place null values at the end
        }
        return a.pf_status.localeCompare(b.pf_status);
      },
      sortDirections: ["descend", "ascend"],
      render: (text, record, index) => {
        if ((showInputs && index === 0) | isPlatformEditing(index)) {
          return (
            <StyledInput>
              <SelectBox
                placeholder="Status"
                name="pf_status"
                style={{ width: 150 }}
                rules={[req_rule]}
                options={[
                  {
                    value: "OPS",
                    label: "OPS",
                  },
                  {
                    value: "Non-OPS",
                    label: "Non-OPS",
                  },
                ]}
                onChange={(value) => {
                  setSelectedType(value);
                }}
              />
            </StyledInput>
          );
        } else {
          return text;
        }
      },
    },
    {
      title: "Other Info",
      dataIndex: "pf_info",
      key: "pf_info",
      width: 200,
      render: (text, record, index) => {
        if ((showInputs && index === 0) | isPlatformEditing(index)) {
          return (
            <StyledInput>
              <InputBox
                placeholder="Other Info"
                name="pf_info"
                style={{ width: 150 }}
              />
            </StyledInput>
          );
        } else {
          return text;
        }
      },
    },
    {
      title: "",
      width: 250,
      dataIndex: "action",
      key: "action",
      render: (text, record, index) => {
        if (showInputs && index === 0) {
          return (
            <Form.Item style={{ display: "flex" }}>
              <div style={{ display: "flex" }}>
                <SimpleButton
                  onClick={handleDelete}
                  style={{
                    fontWeight: "bold",
                  }}
                  text="Cancel"
                />
                <SimpleButton
                  htmlType="submit"
                  style={{
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: "#51AE3B",
                  }}
                  text="Save"
                />
              </div>
            </Form.Item>
          );
        }
        if (!showInputs) {
          if (data.length && !isPlatformEditing(index)) {
            if (accessDeniedEdit === false) {
              return (
                <IconsStylingWrap>
                  <>
                    <MdModeEditOutline
                      className="editIcon"
                      onClick={() => {
                        setPlatformKey(index);
                        form.setFieldsValue(record);
                      }}
                      disable={showInputs}
                    />
                  </>
                </IconsStylingWrap>
              );
            }
          }

          if (isPlatformEditing(index)) {
            return (
              <Form.Item>
                <div style={{ display: "flex" }}>
                  <SimpleButton
                    // onClick={() => {
                    //   setPlatformKey("");
                    // }}
                    onClick={() => {
                      handleDelete();
                      setPlatformKey("");
                    }}
                    style={{
                      fontWeight: "bold",
                    }}
                    text="Cancel"
                  />

                  <SimpleButton
                    onClick={() => {
                      PlatformDataEdited(index);
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
          }
        }
      },
    },

    // },
  ];

  const handleShowInput = () => {
    setShowInputs(true);
    form.resetFields();
    setPlatformKey("");

    setDisabled(true);
    setSelectedType("");
    setSelectedSquadron("");
  };

  const handleDelete = (event) => {
    Modal.confirm({
      title: `Are you sure, you want to cancel?`,
      okText: "Yes",
      okType: "danger",
      centered: "true",
      onOk: () => {
        setShowInputs(false);
        setDisabled(false);
        form.resetFields();
      },
    });
  };

  const onFinish = async () => {
    const validatedValues = await form.validateFields();
    if (validatedValues) {
      try {
        const formData = {
          ...validatedValues,
        };

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/platform`,
          formData
        );
        if (response.status === 201) {
          toast.success("Platform Data Saved", {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          setShowInputs(false);
          setDisabled(false);
          form.resetFields();
          dispatch(fetchAllPlatformData());
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          toast.error("You are not authorized to perform this action.", {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        } else if (error.response.data) {
          toast.error(` Error : ${error.response.data.error}`, {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        } else {
          toast.error(`Upload failed. Please try again.`, {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
        setShowInputs(false);

        form.resetFields();
      }
    }
  };

  useEffect(() => {
    dispatch(fetchAllPlatformData(searchData));
  }, [searchData]);

  const [dragColumns, setDragColumns] = useState(columns);
  const defaultCheckedList = columns.map((item) => item.key);

  const [checkedList, setCheckedList] = useState(defaultCheckedList);

  // Set the default checkedList to include the keys of all columns
  const optionss = columns.map(({ key, title }) => ({
    label: title,
    value: key,
  }));
  const options = columns
    .filter((column) => column.key !== "action") // Exclude the "action" column
    .map(({ key, title }) => ({
      label: title,
      value: key,
    }));

  useEffect(() => {
    setCheckedList(columns.map((item) => item.key));
    setDragColumns(columns);
  }, []);

  // Inside the useEffect hook where you handle checkbox changes
  const handleCheckboxChange = (checkedValues) => {
    setCheckedList(checkedValues);
    const newDragColumns = dragColumns.map((item) => ({
      ...item,
      hidden: !checkedValues.includes(item.key) && item.key !== "action", // Exclude "action" column from hiding
    }));
    setDragColumns(newDragColumns);
  };

  const dragProps = {
    onDragEnd(fromIndex, toIndex) {
      const newColumns = [...dragColumns];
      const item = newColumns.splice(fromIndex, 1)[0];
      newColumns.splice(toIndex, 0, item);
      setDragColumns(newColumns);
    },
    nodeSelector: "th",
  };

  return (
    <>
      {accessDenied ? (
        <Result
          status="403"
          title="403 Forbidden"
          subTitle="You don't have permission to access this resource."
          extra={
            <Button type="primary" onClick={() => router.push("/dashboard")}>
              Back Home
            </Button>
          }
        />
      ) : (
        <>
          <div>
            <PageHeader
              title="MSA Platform Data (View/Add)"
              btnTitle={"Add Platform"} // Render the button only if access is not denied
              btnTitleMedia="+"
              onSearchChange={setSearchData}
              onNavigate={handleShowInput}
              placeholder="Search by Platform ID / Full Name "
              showButton={accessDeniedAdd === false} // Show the button if access is not denied
              currentData={currentData}
            />
          </div>
          <div>
            <AntdTable
              scrollConfig={{ x: true }}
              form={form}
              onFinish={onFinish}
              columns={columns}
              setCurrentData={setCurrentData}
              data={showInputs ? [data[0], ...data] : data}
              loading={isLoading}
            />
          </div>
          <div
            className="fixed-checkbox flex  justify-center "
            style={{
              backgroundColor: "#F5F5F5",
              padding: "20px",
              width: "100%",
              position: "sticky",
              bottom: "0px",
            }}
          >
            <Checkbox.Group
              value={checkedList}
              options={options}
              onChange={handleCheckboxChange}
            />
          </div>
        </>
      )}
    </>
  );
}

export default PlatformId;

export async function getServerSideProps(context) {
  return {
    props: {
      data: {
        title: "Platform Data",
      },
    },
  };
}
