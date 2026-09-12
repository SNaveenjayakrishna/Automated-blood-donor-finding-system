import React, { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../config/apiConfig";
import buttonStyles from "../../styles/buttons.module.css";
import cardStyles from "../../styles/cards.module.css";
import inputStyles from "../../styles/inputs.module.css";
import messageStyles from "../../styles/messages.module.css";

const ExternalDonorUpload = () => {

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const allowedTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setMessage("Only CSV or Excel files are allowed.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setMessage("");
  };

  const handleUpload = async () => {

    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const response = await axios.post(
        `${BACKEND_URL}/upload_external_donors`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setMessage(response.data.message || "File uploaded successfully!");
      setFile(null);

    } catch (error) {
      setMessage("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cardStyles.card}>

      <h3>Upload External Donor List</h3>

      <p style={{marginBottom:"10px", color:"#555"}}>
        Upload CSV or Excel file containing donor details.
      </p>

      <input
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileChange}
        className={inputStyles.input}
      />

      {file && (
        <p style={{marginBottom:"10px"}}>
          Selected File: <strong>{file.name}</strong>
        </p>
      )}

      <button
        className={`${buttonStyles.btn} ${buttonStyles["btn-primary"]}`}
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload Donor List"}
      </button>

      {message && (
        <p className={messageStyles.message} style={{marginTop:"10px"}}>
          {message}
        </p>
      )}

    </div>
  );
};

export default ExternalDonorUpload;