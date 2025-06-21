import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";

const QRCodeScanner = ({ user }) => {
  const [scanResult, setScanResult] = useState(false);
  const [status, setStatus] = useState(""); // To track API response

  useEffect(() => {
    if (!scanResult && user) {
      const scanner = new Html5QrcodeScanner("qr-reader", {
        fps: 10,
        qrbox: 250,
      });

      scanner.render(
        async (result) => {
          console.log("QR Code Scanned:", result);
          setScanResult(true);

          try {
            const response = await axios.post("/api/attendance", {
              userId: user.id,
              qrData: result,
              timestamp: new Date().toISOString(),
            });

            if (response.data.success) {
              setStatus("Attendance marked successfully.");
            } else {
              setStatus("Failed to mark attendance.");
            }
          } catch (error) {
            console.error("API Error:", error);
            setStatus("Error sending data to server.");
          }

          scanner.clear();
        },
        (error) => {
          console.error("QR Scanner Error:", error);
        }
      );

      return () => {
        scanner.clear();
      };
    }
  }, [scanResult, user]);

  if (!user) {
    return <p className="text-center mt-10">You are not logged in</p>;
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
        <p className="text-center mt-4 text-green-700 font-semibold">
          {status || "Processing..."}
        </p>
      )}
    </div>
  );
};

export default QRCodeScanner;
