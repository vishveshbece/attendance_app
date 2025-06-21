import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";

const QRCodePage = () => {
  const [timeLeft, setTimeLeft] = useState(5);
  const [data, setData] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // Check admin login on component mount
  useEffect(() => {
    const admin = localStorage.getItem("admin");
    setIsAdmin(!!admin);
  }, []);

  // Generate a new QR code value
  const updateQRCodeData = () => {
    const currentDateTime = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
    setData(currentDateTime);
  };

  // Timer countdown & QR code refresh
  useEffect(() => {
    updateQRCodeData(); // Generate once when component loads

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          updateQRCodeData(); // refresh QR
          return 5; // reset timer
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {isAdmin ? (
        <div className="flex flex-col justify-center items-center mt-24">
          <div className="bg-white p-6 rounded shadow">
            <QRCode
              value={data || "default"}
              size={150}
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>
          <p className="mt-4 text-gray-700 font-medium">
            Code expires in: <span className="text-blue-600">{timeLeft}s</span>
          </p>
        </div>
      ) : (
        <div className="text-center mt-24 text-red-600 font-semibold">
          You are not logged in as admin.
        </div>
      )}
    </>
  );
};

export default QRCodePage;
