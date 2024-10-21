import React from 'react';
import ProfitCalculator from './ProfitCalculator';

const ProfitCalculatorPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-white">Profit Calculator</h1>
      <ProfitCalculator />
    </div>
  );
};

export default ProfitCalculatorPage;