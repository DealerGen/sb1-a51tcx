import React, { useState, useMemo } from 'react';
import { Car } from '../types';
import { ArrowUpDown } from 'lucide-react';

interface VehicleListProps {
  cars: Car[];
}

const VehicleList: React.FC<VehicleListProps> = ({ cars }) => {
  const [sortKey, setSortKey] = useState<keyof Car>('make');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const sortedCars = useMemo(() => {
    return [...cars].sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return sortOrder === 'asc' ? -1 : 1;
      if (a[sortKey] > b[sortKey]) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [cars, sortKey, sortOrder]);

  const handleSort = (key: keyof Car) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4 text-white">Vehicles ({cars.length})</h2>
      <table className="w-full text-left text-white">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="p-2 cursor-pointer" onClick={() => handleSort('make')}>
              Make <ArrowUpDown size={14} className="inline ml-1" />
            </th>
            <th className="p-2 cursor-pointer" onClick={() => handleSort('model')}>
              Model <ArrowUpDown size={14} className="inline ml-1" />
            </th>
            <th className="p-2 cursor-pointer" onClick={() => handleSort('carYear')}>
              Year <ArrowUpDown size={14} className="inline ml-1" />
            </th>
            <th className="p-2 cursor-pointer" onClick={() => handleSort('mileage')}>
              Mileage <ArrowUpDown size={14} className="inline ml-1" />
            </th>
            <th className="p-2 cursor-pointer" onClick={() => handleSort('status')}>
              Status <ArrowUpDown size={14} className="inline ml-1" />
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedCars.map((car) => (
            <tr key={car.id} className="border-b border-gray-700 hover:bg-gray-700">
              <td className="p-2">{car.make}</td>
              <td className="p-2">{car.model}</td>
              <td className="p-2">{car.carYear}</td>
              <td className="p-2">{car.mileage?.toLocaleString()}</td>
              <td className="p-2">{car.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VehicleList;