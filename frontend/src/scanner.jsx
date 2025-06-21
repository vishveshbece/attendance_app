import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

const QRCodeScanner = ({ onscan }) => {
  const [Scanned, setScanned] = useState(false);

  useEffect(() => {
    const initScanner = async () => {
      const user = localStorage.getItem("user");
      if (!user) return;

      const fp = await FingerprintJS.load();
      const device = (await fp.get()).visitorId;

      try {
        const res = await axios.get("https://attendance-app-gqu0.onrender.com/api/users/get/id", {
          params: { username: user, device }
        });

        if (!res.data.alreadyScanned) {
          if (!Scanned) {
            const scanner = new Html5QrcodeScanner("qr-reader", {
              fps: 10,
              qrbox: 250,
            });

            scanner.render(
              (result) => {
                console.log("QR Code Scanned:", result);
                localStorage.setItem("date", new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }));
                setScanned(true);
                onscan(result, device);
                scanner.clear();
              },
              (error) => {
                console.error("QR Scanner Error:", error);
              }
            );

            return () => scanner.clear();
          }
        } else {
          if (res.data.reason === "user") {
            alert("⚠️ You have already marked attendance today.");
          } else if (res.data.reason === "device") {
            alert("⚠️ This device has already been used for attendance today.");
          }
          setScanned(true);
        }
      } catch (error) {
        console.error("Error checking scan status:", error);
      }
    };

    initScanner();
  }, [onscan, Scanned]);

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
