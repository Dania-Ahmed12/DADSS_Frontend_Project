import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { resetCosposUploadState } from "../../redux/slice/cosposUploadDataSlice";
import { addCosposUploadData } from "../../redux/thunks/cosposUploadData";

const CosposButton = () => {
  const [hasDuplicates, setHasDuplicates] = useState(false); // Define hasDuplicates
  const [missingColumns, setMissingColumns] = useState([]);
  const [extraColumns, setExtraColumns] = useState([]);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null); // New state to store the file name
  const [uploadMessage, setUploadMessage] = useState(""); // New state to manage success/error messages
  const { isLoading, data, error, success } = useSelector(
    (state) => state.cospos
  );
  const dispatch = useDispatch();
  const fileInputRef = useRef(null); // Create a ref for the file input element

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
      const fileContent = event.target.result;

      const lines = fileContent.split("\n");
      const firstLine = lines[0].trim();
      const columns = firstLine.split(",");
      const values = new Set(); // Store unique values
      let hasDuplicates = false;

      for (const line of lines) {
        const columnss = line.trim().split(",");

        const requiredColumns = [
          "occurrence_type",
          "distress_conf",
          "beacon_operating_mode",
          "msg_ref",
          "detected_at",
          "det_satellite",
          "det_freq_typeA",
          "det_freq_typeB",
          "det_freq_typeC",
          "user_class_std_location",
          "emergency_code",
          "pos_confirmed_lat",
          "pos_confirmed_long",
          "pos_dopplerA",
          "pos_dopplerB",
          "pos_doa_lat",
          "pos_doa_long",
          "pos_expected_acc",
          "pos_altitude",
          "pos_encoded_lat",
          "pos_encoded_long",
          "pos_updated_time",
          "pos_provided_by",
          "nextpass_confirmed",
          "nextpass_doppA",
          "nextpass_doppB",
          "nextpass_doa",
          "nextpass_encoded",
          "hex_id",
          "activation_type",
          "oei_mid",
          "oei_loc_protocol_type",
          "oei_pos_uncertainty",
          "oei_lat",
          "oei_long",
          "oper_info_imo",
          "oper_info_vessel_type",
          "oper_info_lpoc",
          "oper_info_npoc",
          "oper_ship_owner",
          "oper_sat_alert_time",
          "temp_from",
          "temp_to",
          "temp_inc_reporting_time",
          "temp_inc_details",
          "temp_actions_list",
          "remarks",
          "beacon_reg_no",
          "country_name",
          "country_code",
        ];

        // Check if all required columns are present
        const missingColumns = requiredColumns.filter(
          (col) => !columns.includes(col)
        );
        const extraColumns = columns.filter(
          (col) => !requiredColumns.includes(col)
        );

        if (missingColumns.length > 0) {
          alert(`Missing columns: ${missingColumns.join(", ")}`);
          setFileName(""); // Clear the file name on upload failure
          return;
        }

        if (extraColumns.length > 0) {
          alert(`Extra columns found: ${extraColumns.join(", ")}`);
          setFileName(""); // Clear the file name on upload failure
          return;
        }

        // Assuming 'boat_name' is the column you want to check for duplicates
        const occurance = columnss[0]; // Adjust the index based on your CSV structure
        const departure_date = columnss[1];

        if (values.has(occurance && departure_date)) {
          hasDuplicates = true;
          break;
        }

        values.add(occurance);
        values.add(departure_date);
      }
      if (
        hasDuplicates &&
        missingColumns.length === 0 &&
        extraColumns.length === 0
      ) {
        alert("Duplicate data found in the CSV file.");
        setFileName(""); // Clear the file name on upload failure
        return;
      }
      setFile(selectedFile);
      setFileName(selectedFile.name);
    };

    reader.readAsText(selectedFile);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (hasDuplicates || missingColumns.length || extraColumns.length) {
      alert("Please correct the CSV file before uploading.");
      setFileName(""); // Clear the file name on upload failure
      setUploadMessage("Upload failed. Please correct the CSV file.");
      return;
    }
 if (!file) {
   setFileName(""); // Clear the file name on upload failure
   setUploadMessage("Upload failed. Please select a CSV file.");
   alert("Please select a CSV file.");

   setTimeout(() => {
     setUploadMessage("");
   }, 1500);
   return;
 }
    const formData = new FormData();
    formData.append("file", file);
    try {
      await dispatch(addCosposUploadData(formData));
    } catch (error) {
      setUploadMessage("Upload failed. Please try again.");
      setFileName(""); // Clear the file name on upload failure
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
      setFile(null);
      setFileName("");
      setTimeout(() => {
        setUploadMessage("");
        setFileName("");
        dispatch(resetCosposUploadState());
        setFile(null);
      }, 1500);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
        ref={fileInputRef} // Set the ref to access the file input element
        accept=".csv"
      />
      <Button
        onClick={handleUpload}
      >
        Upload
      </Button>
      <div>
        {isLoading }
        {uploadMessage && <p>{uploadMessage}</p>}
      </div>
    </div>
  );
};

export default CosposButton;
