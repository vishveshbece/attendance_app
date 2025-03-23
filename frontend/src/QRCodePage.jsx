import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";

const QRCodePage = () => {
  const [timeLeft, setTimeLeft] = useState(5);
  const [data, setData] = useState("");

  const updateQRCodeData = () => {
    const currentDateTime = new Date().toISOString(); // More reliable format
    setData(currentDateTime);
  };

  useEffect(() => {
    if (timeLeft === 5) {
      updateQRCodeData();
    }
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (timeLeft === 0) {
      setTimeLeft(5);
    }
  }, [timeLeft]);

  return (
    <>
      {localStorage.getItem("admin") ? (
        <div className="flex flex-col justify-center items-center mt-24">
          <div>
            <QRCode value={data || "default"} size={135} bgColor="#ffffff" fgColor="#000000" />
          </div>
          <br />
          <p>Code expires in: {timeLeft} seconds</p>
        </div>
      ) : (
        <p>You didn't log in yet</p>
      )}
    </>
  );
};

export default QRCodePage;
