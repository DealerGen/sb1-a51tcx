import React, { useState, useCallback, useEffect } from 'react';
import { useCarData } from '../context/CarDataContext';
import { Car } from '../types';
import { Calculator, PoundSterling, Truck, Wrench, Paintbrush, Shield, Target } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface ProfitInputs {
  delivery: number;
  mot: number;
  service: number;
  cosmetic: number;
  warrantyAndValet: number;
  desiredNetProfit: number;
}

const ProfitCalculator: React.FC = () => {
  const { cars } = useCarData();
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [overriddenRetailValuation, setOverriddenRetailValuation] = useState<number | null>(null);
  const [profitInputs, setProfitInputs] = useState<ProfitInputs>({
    delivery: 0,
    mot: 0,
    service: 0,
    cosmetic: 0,
    warrantyAndValet: 0,
    desiredNetProfit: 0,
  });
  const [profitCalculation, setProfitCalculation] = useState<any>(null);

  const location = useLocation();

  // Filter only qualified cars
  const qualifiedCars = cars.filter(car => car.status === 'qualified');

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const regParam = searchParams.get('reg');
    if (regParam) {
      const car = qualifiedCars.find(car => car.id.toLowerCase() === regParam.toLowerCase());
      if (car) {
        handleCarSelect(car);
        // Note: Chrome extension messaging removed as it's not applicable in this context
      }
    }
  }, [location, qualifiedCars]);

  const calculateProfit = useCallback((car: Car, inputs: ProfitInputs) => {
    const retailValuation = overriddenRetailValuation || car.retailValuation || 0;
    const carwowFee = getCarwowFee(retailValuation);

    const totalCosts = carwowFee + inputs.delivery + inputs.mot + inputs.service + 
                       inputs.cosmetic + inputs.warrantyAndValet;
    const requiredGrossProfit = inputs.desiredNetProfit * 1.2; // Account for VAT (20%)
    const bidPrice = retailValuation - requiredGrossProfit - totalCosts;

    const actualGrossProfit = retailValuation - bidPrice;
    const vatAmount = actualGrossProfit / 6; // VAT is 1/6 of the gross profit
    const actualNetProfit = actualGrossProfit - vatAmount - totalCosts;

    return {
      retailValuation: retailValuation.toFixed(2),
      carwowFee: carwowFee.toFixed(2),
      bidPrice: bidPrice.toFixed(2),
      vatAmount: vatAmount.toFixed(2),
      actualNetProfit: actualNetProfit.toFixed(2),
      calculation: {
        retailValuation,
        carwowFee,
        delivery: inputs.delivery,
        mot: inputs.mot,
        service: inputs.service,
        cosmetic: inputs.cosmetic,
        warrantyAndValet: inputs.warrantyAndValet,
        desiredNetProfit: inputs.desiredNetProfit,
        bidPrice,
        actualGrossProfit,
        vatAmount,
        actualNetProfit
      }
    };
  }, [overriddenRetailValuation]);

  const handleCarSelect = (car: Car) => {
    setSelectedCar(car);
    setOverriddenRetailValuation(null);
    if (car) {
      const result = calculateProfit(car, profitInputs);
      setProfitCalculation(result);
    } else {
      setProfitCalculation(null);
    }
  };

  const handleInputChange = (key: keyof ProfitInputs, value: number) => {
    setProfitInputs(prev => ({ ...prev, [key]: value }));
    if (selectedCar) {
      const result = calculateProfit(selectedCar, { ...profitInputs, [key]: value });
      setProfitCalculation(result);
    }
  };

  const handleRetailValuationOverride = (value: number) => {
    setOverriddenRetailValuation(value);
    if (selectedCar) {
      const result = calculateProfit(selectedCar, profitInputs);
      setProfitCalculation(result);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg overflow-x-auto">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
        <Calculator className="mr-2" /> Profit Calculator
      </h2>

      <div className="mb-6 bg-gray-700 p-4 rounded-lg">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Select Vehicle</label>
            <select
              value={selectedCar?.id || ''}
              onChange={(e) => handleCarSelect(qualifiedCars.find(car => car.id === e.target.value) || null)}
              className="w-full bg-gray-600 text-white px-3 py-2 rounded"
            >
              <option value="">Select a vehicle</option>
              {qualifiedCars.map(car => (
                <option key={car.id} value={car.id}>
                  {car.make} {car.model} ({car.id})
                </option>
              ))}
            </select>
          </div>
        </div>
        {selectedCar && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Retail Valuation</label>
              <input
                type="number"
                value={overriddenRetailValuation || selectedCar.retailValuation || 0}
                onChange={(e) => handleRetailValuationOverride(Number(e.target.value))}
                className="w-full bg-gray-600 text-white px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Carwow Fee</label>
              <input
                type="number"
                value={profitCalculation?.carwowFee || 0}
                readOnly
                className="w-full bg-gray-600 text-white px-3 py-2 rounded"
              />
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(profitInputs).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
                {getInputIcon(key as keyof ProfitInputs)}
                <span className="ml-2">{formatLabel(key)}</span>
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => handleInputChange(key as keyof ProfitInputs, Number(e.target.value))}
                className="w-full bg-gray-600 text-white px-3 py-2 rounded"
              />
            </div>
          ))}
        </div>
        {profitCalculation && (
          <div className="text-white mt-4">
            <h4 className="font-bold mb-2">Calculation Results:</h4>
            <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
              {JSON.stringify(profitCalculation.calculation, null, 2)}
            </pre>
            <p className="mt-2">Recommended Bid Price: £{profitCalculation.bidPrice}</p>
            <p className="mt-2">Actual Net Profit: £{profitCalculation.actualNetProfit}</p>
          </div>
        )}
      </div>
    </div>
  );
};

function getCarwowFee(price: number): number {
  if (price <= 2499) return 199;
  if (price <= 4999) return 249;
  if (price <= 7499) return 269;
  if (price <= 9999) return 299;
  if (price <= 14999) return 319;
  if (price <= 19999) return 339;
  if (price <= 29999) return 389;
  if (price <= 39999) return 449;
  if (price <= 49999) return 499;
  if (price <= 59999) return 599;
  if (price <= 69999) return 699;
  if (price <= 79999) return 799;
  if (price <= 89999) return 899;
  if (price <= 99999) return 929;
  return 999;
}

function getInputIcon(key: keyof ProfitInputs) {
  switch (key) {
    case 'delivery':
      return <Truck size={16} />;
    case 'mot':
    case 'service':
      return <Wrench size={16} />;
    case 'cosmetic':
      return <Paintbrush size={16} />;
    case 'warrantyAndValet':
      return <Shield size={16} />;
    case 'desiredNetProfit':
      return <Target size={16} />;
    default:
      return null;
  }
}

function formatLabel(key: string): string {
  return key.split(/(?=[A-Z])/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export default ProfitCalculator;