import React, { useState, useCallback } from 'react';
import { Upload, Download, AlertTriangle } from 'lucide-react';
import { parseCarwowCsv, parseFinalCsv, generateSimplifiedCsv, combineCarData } from '../utils/csvParser';
import { useCarData } from '../context/CarDataContext';
import { Car } from '../types';
import LoadingAnimation from './LoadingAnimation';
import { useNavigate } from 'react-router-dom';

interface DataUploadPageProps {
  onUploadComplete: () => void;
}

const DataUploadPage: React.FC<DataUploadPageProps> = ({ onUploadComplete }) => {
  const { setCars } = useCarData();
  const [carwowData, setCarwowData] = useState<Car[] | null>(null);
  const [simplifiedCsvContent, setSimplifiedCsvContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCarwowUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          setIsLoading(true);
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
        } finally {
          setIsLoading(false);
        }
      };
      reader.onerror = (err) => {
        console.error("Error reading Carwow file:", err);
        setError("Error reading Carwow file. Please try again.");
        setIsLoading(false);
      };
      reader.readAsText(file);
    }
  }, [setCars]);

  const handleSimplifiedCsvDownload = useCallback(() => {
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
  }, [simplifiedCsvContent]);

  const handleFinalDataUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          setIsLoading(true);
          const originalConsoleWarn = console.warn;
          const capturedWarnings: string[] = [];
          console.warn = (...args) => {
            capturedWarnings.push(args.join(' '));
            originalConsoleWarn.apply(console, args);
          };
          
          const csv = e.target?.result as string;
          const parsedFinalData = await parseFinalCsv(csv);
          
          console.warn = originalConsoleWarn;
          
          if (carwowData) {
            const combined = await combineCarData(carwowData, parsedFinalData);
            setCars(combined);
            console.log("Combined data:", combined);
            
            // Simulate some processing time (remove this in production)
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Call onUploadComplete to return to the main page
            onUploadComplete();
          } else {
            setError("Please upload Carwow data first before uploading the final data.");
          }
          
          setError(null);
          setWarnings(capturedWarnings);
        } catch (err) {
          console.error("Error processing final data:", err);
          setError(`Error processing final data: ${err.message}`);
        } finally {
          setIsLoading(false);
        }
      };
      reader.onerror = (err) => {
        console.error("Error reading final file:", err);
        setError("Error reading final file. Please try again.");
        setIsLoading(false);
      };
      reader.readAsText(file);
    }
  }, [carwowData, setCars, onUploadComplete]);

  if (isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg">
      <h1 className="text-3xl font-bold mb-6">BidBuddy🤖 Data Upload</h1>
      
      {/* Step 1: Carwow CSV Upload */}
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

      {/* Step 2: Simplified CSV Download */}
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

      {/* Step 3: Final CSV Upload */}
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

      {/* Error Display */}
      {error && (
        <div className="mb-8 bg-red-500 p-4 rounded-lg flex items-center">
          <AlertTriangle size={20} className="mr-2" />
          <p>{error}</p>
        </div>
      )}

      {/* Warnings Display */}
      {warnings.length > 0 && (
        <div className="mb-8 bg-yellow-500 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Warnings:</h3>
          <ul className="list-disc list-inside">
            {warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DataUploadPage;