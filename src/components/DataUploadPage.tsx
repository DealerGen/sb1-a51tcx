import React, { useState } from 'react';
import { Upload, Download, AlertTriangle } from 'lucide-react';
import { parseCarwowCsv, generateSimplifiedCsv } from '../utils/csvParser';
import { useCarData } from '../context/CarDataContext';
import { Car } from '../types';

interface DataUploadPageProps {
  onUploadComplete: () => void;
}

const DataUploadPage: React.FC<DataUploadPageProps> = ({ onUploadComplete }) => {
  const { setCars } = useCarData();
  const [error, setError] = useState<string | null>(null);
  const [carwowData, setCarwowData] = useState<Car[] | null>(null);
  const [simplifiedCsvContent, setSimplifiedCsvContent] = useState<string | null>(null);

  const handleCarwowUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const csv = e.target?.result as string;
          const parsedData = await parseCarwowCsv(csv);
          setCarwowData(parsedData);
          setCars(parsedData);
          const simplifiedCsv = generateSimplifiedCsv(parsedData);
          setSimplifiedCsvContent(simplifiedCsv);
          setError(null);
        } catch (err) {
          console.error("Error processing Carwow data:", err);
          setError(`Error processing Carwow data: ${err.message}`);
        }
      };
      reader.onerror = (err) => {
        console.error("Error reading Carwow file:", err);
        setError("Error reading Carwow file. Please try again.");
      };
      reader.readAsText(file);
    }
  };

  const handleSimplifiedCsvDownload = () => {
    if (simplifiedCsvContent) {
      const blob = new Blob([simplifiedCsvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'simplified_data.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  const handleFinalDataUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const csv = e.target?.result as string;
          // Here you would process the final CSV and update the car data
          // For now, we'll just call onUploadComplete
          onUploadComplete();
        } catch (err) {
          console.error("Error processing final data:", err);
          setError(`Error processing final data: ${err.message}`);
        }
      };
      reader.onerror = (err) => {
        console.error("Error reading final file:", err);
        setError("Error reading final file. Please try again.");
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg">
      <h1 className="text-3xl font-bold mb-6">BidBuddy🤖 Data Upload</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Step 1: Upload Carwow CSV</h2>
        <label className="flex items-center space-x-2 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          <Upload size={20} />
          <span>Upload Carwow CSV</span>
          <input
            type="file"
            accept=".csv"
            onChange={handleCarwowUpload}
            className="hidden"
          />
        </label>
        {carwowData && (
          <p className="text-green-500 mt-2">✅ Carwow data uploaded successfully</p>
        )}
      </div>

      {simplifiedCsvContent && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Step 2: Download Simplified CSV</h2>
          <button
            onClick={handleSimplifiedCsvDownload}
            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            <Download size={20} />
            <span>Download Simplified CSV</span>
          </button>
          <p className="mt-2 text-sm text-gray-300">
            This CSV contains VRM and MILEAGE columns for you to fill in additional information.
          </p>
        </div>
      )}

      {simplifiedCsvContent && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Step 3: Upload Final CSV</h2>
          <label className="flex items-center space-x-2 cursor-pointer bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded">
            <Upload size={20} />
            <span>Upload Final CSV</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFinalDataUpload}
              className="hidden"
            />
          </label>
        </div>
      )}

      {error && (
        <div className="mb-8 bg-red-500 p-4 rounded-lg flex items-center">
          <AlertTriangle size={20} className="mr-2" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default DataUploadPage;