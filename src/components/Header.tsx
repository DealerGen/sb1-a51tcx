import React from 'react';
import { RefreshCw, Calculator, Upload, Sliders, DollarSign, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onReset: () => void;
  onToggleUpload: () => void;
  onToggleImport: () => void;
}

const Header: React.FC<HeaderProps> = ({ onReset, onToggleUpload, onToggleImport }) => {
  return (
    <header className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-gray-200 transition-colors">
          BidBuddy🤖
        </Link>
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleUpload}
            className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-all"
          >
            <Upload size={20} />
            <span>Upload</span>
          </button>
          <button
            onClick={onToggleImport}
            className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-all"
          >
            <Download size={20} />
            <span>Import</span>
          </button>
          <Link
            to="/bidding-parameters"
            className="flex items-center space-x-2 bg-yellow-500 text-white px-4 py-2 rounded-full hover:bg-yellow-600 transition-all"
          >
            <Sliders size={20} />
            <span>Parameters</span>
          </Link>
          <Link
            to="/profit-calculator"
            className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-all"
          >
            <Calculator size={20} />
            <span>Calculator</span>
          </Link>
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