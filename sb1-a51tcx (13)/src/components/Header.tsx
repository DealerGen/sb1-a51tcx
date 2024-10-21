import React from 'react';
import { RefreshCw, Calculator, Upload, Sliders, DollarSign } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  onReset: () => void;
  onToggleProfitCalculator: () => void;
  onToggleParameters: () => void;
  onToggleUpload: () => void;
}

const Header: React.FC<HeaderProps> = ({ onReset, onToggleProfitCalculator, onToggleParameters, onToggleUpload }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex flex-col">
          <Link to="/" className="text-2xl font-bold hover:text-gray-200 transition-colors">
            BidBuddy🤖
          </Link>
          <span className="text-xs text-gray-300">Powered by DealerGen.AI</span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleUpload}
            className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-all"
          >
            <Upload size={20} />
            <span>Upload</span>
          </button>
          <button
            onClick={onToggleParameters}
            className="flex items-center space-x-2 bg-yellow-500 text-white px-4 py-2 rounded-full hover:bg-yellow-600 transition-all"
          >
            <Sliders size={20} />
            <span>Parameters</span>
          </button>
          <button
            onClick={onToggleProfitCalculator}
            className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-all"
          >
            <Calculator size={20} />
            <span>Calculator</span>
          </button>
          <button
            onClick={onReset}
            className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-all"
          >
            <RefreshCw size={20} />
            <span>Reset</span>
          </button>
          <Link
            to="/pricing"
            className="flex items-center justify-center bg-purple-500 text-white w-10 h-10 rounded-full hover:bg-purple-600 transition-all"
            title="Pricing"
          >
            <DollarSign size={20} />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;