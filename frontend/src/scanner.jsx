import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const QRCodeScanner = ({ onscan }) => {
  const [scanResult, setScanResult] = useState(false);

  useEffect(() => {
    const lastScan = localStorage.getItem("date");

    if (!lastScan) {
      const lastScanTime = new Date(lastScan).getTime();
      const currentTime = Date.now();
      if ((currentTime - lastScanTime) / 1000 >= 86400) {
        setScanResult(false); 
      } else {
        setScanResult(true);
      }
    }
  }, []);
  useEffect(() => {
    if (!scanResult) {
      const scanner = new Html5QrcodeScanner("qr-reader", {
        fps: 10,
        qrbox: 250,
      });
      scanner.render(
        (result) => {
          const scannedTime = new Date(result).getTime();
          const timeDiff = (Date.now() - scannedTime) / 1000;
          if (timeDiff <= 5) {
            localStorage.setItem("date", new Date().toISOString());
            setScanResult(true);
            onscan(result);
            scanner.clear();
          }
        },
        (error) => {
          console.error("QR Scanner Error:", error);
        }
      );
      return () => {
        scanner.clear();
      };
    }
  }, [scanResult, onscan]);
  return (
    <>
      {localStorage.getItem("user") ? (
        <div>
          {scanResult ? (
            <div id="qr-reader" style={{ width: "100%" }}></div>
          ) : (
            <p>You have already scanned today</p>
          )}
        </div>
      ) : (
        <p>You are not logged in</p>
      )}
    </>
  );
};

export default QRCodeScanner;
