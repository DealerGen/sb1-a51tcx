import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import DataUploadPage from './components/DataUploadPage';
import DraggableFunnel from './components/DraggableFunnel';
import Statistics from './components/Statistics';
import ProfitCalculatorPage from './components/ProfitCalculatorPage';
import BiddingParametersPage from './components/BiddingParametersPage';
import PricingPage from './components/PricingPage';
import ErrorBoundary from './components/ErrorBoundary';
import { useCarData } from './context/CarDataContext';
import { BiddingParameters } from './types';
import FileImporter from './components/FileImporter';

const App: React.FC = () => {
  const { cars, setCars } = useCarData();
  const [showUploadPage, setShowUploadPage] = useState(false);
  const [showFileImporter, setShowFileImporter] = useState(false);

  const [parameters, setParameters] = useState<BiddingParameters>({
    maxPrice: 50000,
    maxAge: 10,
    maxMileage: 100000,
    minRetailRating: 3,
    maxDaysToSell: 30,
    maxPreviousOwners: 2,
    serviceHistory: ['full', 'part'],
  });

  const toggleUploadPage = () => {
    setShowUploadPage(!showUploadPage);
    setShowFileImporter(false);
  };

  const toggleFileImporter = () => {
    setShowFileImporter(!showFileImporter);
    setShowUploadPage(false);
  };

  const handleReset = () => {
    setCars([]);
    setShowUploadPage(false);
    setShowFileImporter(false);
  };

  const handleParametersChange = (newParameters: BiddingParameters) => {
    setParameters(newParameters);
  };

  const handleFileImport = (files: File[]) => {
    // Here you would process the imported files
    console.log('Imported files:', files);
    // For now, we'll just hide the importer
    setShowFileImporter(false);
  };

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gradient-to-r from-purple-700 to-indigo-800 text-white">
          <Header 
            onToggleUpload={toggleUploadPage}
            onToggleImport={toggleFileImporter}
            onReset={handleReset}
          />
          <main className="container mx-auto py-8 px-4">
            <Routes>
              <Route path="/" element={
                showUploadPage ? (
                  <DataUploadPage onUploadComplete={() => setShowUploadPage(false)} />
                ) : showFileImporter ? (
                  <FileImporter onImportComplete={handleFileImport} />
                ) : (
                  <>
                    <Statistics />
                    <DraggableFunnel 
                      parameters={parameters}
                      onParametersChange={handleParametersChange}
                    />
                  </>
                )
              } />
              <Route path="/profit-calculator" element={<ProfitCalculatorPage />} />
              <Route path="/bidding-parameters" element={
                <BiddingParametersPage 
                  parameters={parameters} 
                  onParametersChange={handleParametersChange} 
                />
              } />
              <Route path="/pricing" element={<PricingPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;