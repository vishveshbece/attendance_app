import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";

// Set base URL for API calls
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:7000";

const QRCodeScanner = ({ user }) => {
  const [scanResult, setScanResult] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!scanResult && user) {
      const scanner = new Html5QrcodeScanner("qr-reader", {
        fps: 10,
        qrbox: 250,
      });

      const onScanSuccess = async (result) => {
        console.log("QR Code Scanned:", result);
        setScanResult(true);
        setStatus("Processing attendance...");
        setError("");

        try {
          const response = await axios.post(`${API_BASE_URL}/api/attendance`, {
            userId: user._id, // Changed from user.id to user._id
            qrData: result,
          }, {
            headers: {
              'Content-Type': 'application/json',
            }
          });

          if (response.data.success) {
            setStatus("Attendance marked successfully!");
          } else {
            setStatus("Attendance failed");
            setError(response.data.message || "Unknown error");
          }
        } catch (err) {
          console.error("API Error:", err);
          let errorMsg = "Error sending data to server";
          
          if (err.response) {
            errorMsg = err.response.data.message || errorMsg;
          } else if (err.request) {
            errorMsg = "No response from server";
          }
          
          setStatus(errorMsg);
          setError(err.message);
        } finally {
          scanner.clear();
        }
      };

      const onScanError = (err) => {
        console.error("QR Scanner Error:", err);
        setError(err.message);
      };

      scanner.render(onScanSuccess, onScanError);

      return () => {
        scanner.clear();
      };
    }
  }, [scanResult, user]);

  if (!user) {
    return <p className="text-center mt-10">Please log in to scan QR codes</p>;
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      {!scanResult ? (
        <>
          <div id="qr-reader" style={{ width: "100%" }}></div>
          <p className="text-center mt-2 text-gray-700">
            Scan your QR code to mark attendance
          </p>
        </>
      ) : (
        <div className="text-center mt-4">
          <p className={status.includes("success") ? "text-green-700 font-semibold" : "text-red-700 font-semibold"}>
            {status}
          </p>
          {error && (
            <p className="text-sm text-gray-600 mt-2">Error: {error}</p>
          )}
          <button 
            onClick={() => setScanResult(false)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Scan Again
          </button>
        </div>
      )}
    </div>
  );
};

export default QRCodeScanner;