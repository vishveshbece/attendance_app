import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";

const QRCodeScanner = ({ onscan }) => {
  const [scanResult, setScanResult] = useState(false);
  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(true);

  const user = localStorage.getItem("user");

  // Load attendance summary on component mount if user logged in
  useEffect(() => {
    if (!user) {
      setLoadingSummary(false);
      return;
    }

    const fetchSummary = async () => {
      try {
        setLoadingSummary(true);
        const response = await axios.get(`https://attendance-app-gqu0.onrender.com/api/users/attendance-summary?username=${user}`);
        setSummary(response.data); // expected { present: X, absent: Y, late: Z }
      } catch (error) {
        console.error("Failed to fetch attendance summary", error);
      } finally {
        setLoadingSummary(false);
      }
    };

    fetchSummary();
  }, [user]);

  // Check if user scanned today (24hr cooldown)
  useEffect(() => {
    if (!user) return;

    const lastScan = localStorage.getItem("date");
    if (lastScan) {
      const lastScanTime = new Date(lastScan).getTime();
      const currentTime = Date.now();
      if ((currentTime - lastScanTime) / 1000 >= 86400) {
        setScanResult(false); // Allow scanning after 24 hours
      } else {
        setScanResult(true); // Prevent scanning again
      }
    } else {
      setScanResult(false);
    }
  }, [user]);

  // Initialize scanner if allowed
  useEffect(() => {
    if (!scanResult && user) {
      const scanner = new Html5QrcodeScanner("qr-reader", {
        fps: 10,
        qrbox: 250,
      });

      scanner.render(
        (result) => {
          console.log("QR Code Scanned:", result);
          localStorage.setItem("date", new Date().toISOString()); // Store scan timestamp
          setScanResult(true);
          onscan(result);
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
  }, [scanResult, onscan, user]);

  if (!user) {
    return <p className="text-center mt-10">You are not logged in</p>;
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      {/* Attendance Summary */}
      <div className="mb-8 bg-white p-6 rounded shadow text-center">
        <h2 className="text-2xl font-semibold mb-4">Attendance Summary</h2>
        {loadingSummary ? (
          <p>Loading summary...</p>
        ) : summary ? (
          <div className="flex justify-around text-lg font-medium">
            <div>
              <span className="text-green-600">{summary.present}</span>
              <p>Present Days</p>
            </div>
            <div>
              <span className="text-red-600">{summary.absent}</span>
              <p>Absent Days</p>
            </div>
            <div>
              <span className="text-yellow-600">{summary.late}</span>
              <p>Late Arrivals</p>
            </div>
          </div>
        ) : (
          <p>No attendance data found.</p>
        )}
      </div>

      {/* QR Scanner Section */}
      {!scanResult ? (
        <>
          <div id="qr-reader" style={{ width: "100%" }}></div>
          <p className="text-center mt-2 text-gray-700">Scan your QR code to mark attendance</p>
        </>
      ) : (
        <p className="text-center mt-4 text-green-700 font-semibold">
          You have already scanned today.
        </p>
      )}
    </div>
  );
};

export default QRCodeScanner;
