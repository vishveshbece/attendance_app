import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const QRCodeScanner = ({ onscan }) => {
  const [Scanned,setScanned] = useState('');
  useEffect(() => {
    if (Scanned) {
      const scanner = new Html5QrcodeScanner("qr-reader", {
        fps: 10,
        qrbox: 250,
      });

      scanner.render(
        (result) => {
          console.log("QR Code Scanned:", result);
          localStorage.setItem("date", new Date().toISOString()); // Store scan timestamp
          setScanned(true);
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
  }, [onscan]);


  return (
    <div className="max-w-xl mx-auto p-4">
      {!Scanned ? (
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
