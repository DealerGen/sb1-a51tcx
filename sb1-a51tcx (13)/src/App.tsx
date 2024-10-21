import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
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

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  );
};

const AppContent: React.FC = () => {
  const { cars, setCars } = useCarData();
  const [showUploadPage, setShowUploadPage] = useState(false);
  const navigate = useNavigate();

  const [parameters, setParameters] = useState<BiddingParameters>(() => {
    const savedParams = localStorage.getItem('biddingParameters');
    return savedParams ? JSON.parse(savedParams) : {
      maxPrice: 160000,
      maxAge: 53,
      maxMileage: 250162,
      minRetailRating: 1,
      maxDaysToSell: 136,
      maxPreviousOwners: 15,
      serviceHistory: ['full_mixed', 'full_main_dealer', 'part', 'none', 'full_independent', 'not_due'],
    };
  });

  useEffect(() => {
    localStorage.setItem('biddingParameters', JSON.stringify(parameters));
  }, [parameters]);

  const updateCarWonPrice = (carId: string, wonPrice: number) => {
    setCars(prevCars => prevCars.map(car => 
      car.id === carId ? { ...car, wonPrice } : car
    ));
  };

  const toggleUploadPage = () => {
    setShowUploadPage(!showUploadPage);
  };

  const handleReset = () => {
    setCars([]);
    setShowUploadPage(false);
  };

  const handleToggleProfitCalculator = () => {
    navigate('/profit-calculator');
  };

  const handleToggleParameters = () => {
    navigate('/bidding-parameters');
  };

  const handleParametersChange = (newParameters: BiddingParameters) => {
    setParameters(newParameters);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-700 to-indigo-800 text-white">
      <Header 
        onToggleUpload={toggleUploadPage} 
        onReset={handleReset} 
        onToggleProfitCalculator={handleToggleProfitCalculator}
        onToggleParameters={handleToggleParameters}
      />
      <main className="container mx-auto py-8 px-4">
        <Routes>
          <Route path="/" element={
            showUploadPage ? (
              <DataUploadPage onUploadComplete={() => setShowUploadPage(false)} />
            ) : (
              <>
                <Statistics />
                <DraggableFunnel 
                  updateCarWonPrice={updateCarWonPrice} 
                  updateColumns={() => {}}
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
  );
};

export default App;