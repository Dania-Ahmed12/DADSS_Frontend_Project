import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "antd";
import { addPNSCUploadData } from "../../redux/thunks/jmisPnscUploadData";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const PNSCButton = ({ onDataLoad }) => {
  // State variables
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null); // State to store the file name
  const [uploadMessage, setUploadMessage] = useState(""); // State to manage success/error messages

  // Redux state and dispatch
  const { isLoading } = useSelector((state) => state.pnsc);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null); // Ref for the file input element

  // Function to parse CSV content
  const parseCSVContent = (content) => {
    const lines = content.split("\n");

    const header = lines[0].trim().split(",");
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].trim().split(",");
      const rowData = {};

      for (let j = 0; j < header.length; j++) {
        rowData[header[j]] = values[j];
      }

      data.push(rowData);
    }

    return { columns: header, data };
  };

  // Handler for file input change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile ? selectedFile.name : ""); // Save the file name

    // Check if a file is selected
    if (!selectedFile) {
      alert("Please select a CSV file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      // Content of the file after it has been successfully read by the FileReader
      const fileContent = event.target.result;
      const parsedData = parseCSVContent(fileContent);
      const { columns } = parsedData;

      //required columns
      const requiredColumns = [
        "Country",
        "StatusSymbol",
        "StatusSymbolRemarks",
        "StatusSymbolAssignedTime",
        "TrackNumber",
        "Lat",
        "Lon",
        "Speed",
        "Course",
        "Timestamp",
        "Imo",
        "LastPort",
        "NextPortName",
        "TrackType",
        "ShipTypeName",
        "TrackLabel",
      ];

      // Check if all required columns are present
      const missingColumns = requiredColumns.filter(
        (col) => !columns.includes(col)
      );
      if (missingColumns.length > 0) {
        toast.error(`Missing columns: ${missingColumns.join(", ")}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
          onClose: () => {
            // Clear the file input by resetting its value
            if (fileInputRef.current) {
              fileInputRef.current.value = null;
            }
            setTimeout(() => {
              setUploadMessage("");
              setFileName("");
              setFile(null);
            }, 1500);
          },
        });
        return;
      }

      // Check if there are extra columns
      const extraColumns = columns.filter(
        (col) => !requiredColumns.includes(col)
      );
      if (extraColumns.length > 0) {
        toast.error(`Extra columns found: ${extraColumns.join(", ")}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
          onClose: () => {
            // Clear the file input by resetting its value
            if (fileInputRef.current) {
              fileInputRef.current.value = null;
            }
            setTimeout(() => {
              setUploadMessage("");
              setFileName("");
              setFile(null);
            }, 1500);
          },
        });
        return;
      }
      // Set file and file name after validation
      setFile(selectedFile);
      setFileName(selectedFile.name);
    };

    // Read the content of the selected file
    reader.readAsText(selectedFile);
  };

  // Function to reset file input and state variables
  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }

    // Clear state variables after a delay
    setTimeout(() => {
      setUploadMessage("");
      setFileName("");
      setFile(null);
    }, 1500);
  };

  // Handler for file upload
  const handleUpload = async (e) => {
    e.preventDefault();

    // Check if a file is selected
    if (!file) {
      setFileName("");
      setUploadMessage("Upload failed. Please select a CSV file.");
      alert("Please select a CSV file.");

      // Clear upload message after a delay
      setTimeout(() => {
        setUploadMessage("");
      }, 1500);
      return;
    }

    // Create a FormData object for file upload
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Dispatch the action to add situation upload data
      dispatch(addPNSCUploadData(formData));
    } catch (error) {
      setUploadMessage("Upload failed. Please try again.");
      setFileName(""); // Clear the file name on upload failure
    } finally {
      resetFileInput();
    }
  };

  // Add this function to your component
  const handleLoad = async () => {
    // Check if fileData is available
    if (!file) {
      setFileName("");
      setUploadMessage("Upload failed. Please select a CSV file.");
      alert("Please select a CSV file.");

      setTimeout(() => {
        setUploadMessage("");
      }, 1500);
      return;
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/psd_json`;

    try {
      // Create FormData for loading data
      const formData = new FormData();
      formData.append("file", file); // Ensure that the key matches the expected key on the server

      // Make an axios post request to load data
      const response = await axios.post(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Check if the response status is successful
      if (response.status === 200 || response.status === 201) {
        // Notify user about successful data load
        toast.info(`Data Loaded Successfully`, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });

        // Call the onDataLoad function if provided
        if (onDataLoad) {
          onDataLoad(response.data);
        }
      }
    } catch (error) {
      // Handle data load failure
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

      // Clear the file name on load failure
      setFileName("");
    } finally {
      // Clear the file input and reset state after load attempt
      resetFileInput();
    }
  };

  return (
    <>
      <div>
        <input
          type="file"
          onChange={handleFileChange}
          ref={fileInputRef}
          accept=".csv"
        />

        <Button className="mr-3 ml3" onClick={handleUpload}>
          Upload
        </Button>
        <Button
          className="mr-3 ml-3"
          onClick={handleLoad} // Define the handleLoad function
        >
          Load
        </Button>
        <div>
          {isLoading}
          {uploadMessage && <p>{uploadMessage}</p>}
        </div>
      </div>
    </>
  );
};

export default PNSCButton;
