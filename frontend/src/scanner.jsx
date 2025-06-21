import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const Scanner = ({ onscan, user, loading }) => {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?._id && !scanResult) {
      const scanner = new Html5QrcodeScanner("qr-reader", {
        fps: 10,
        qrbox: 250,
      });

      const onScanSuccess = async (result) => {
        try {
          setError("");
          await onscan(result);
          setScanResult(true);
        } catch (err) {
          setError(err.message);
        } finally {
          scanner.clear();
        }
      };

      const onScanError = (err) => {
        setError(err.message);
      };

      scanner.render(onScanSuccess, onScanError);

      return () => {
        scanner.clear();
      };
    }
  }, [user, scanResult, onscan]);

  const resetScanner = () => {
    setScanResult(null);
    setError("");
  };

  if (!user?._id) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">Please login to use the scanner</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4">
      {!scanResult ? (
        <>
          <div id="qr-reader" className="w-full mb-4"></div>
          {loading && <p className="text-center">Processing...</p>}
        </>
      ) : (
        <div className="text-center p-4 bg-green-100 text-green-800 rounded-lg">
          <p className="font-semibold">Scan successful!</p>
          <button
            onClick={resetScanner}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={loading}
          >
            Scan Again
          </button>
        </div>
      )}
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default Scanner;