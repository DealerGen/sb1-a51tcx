import Papa from 'papaparse';
import { Car } from '../types';

export const parseCarwowCsv = (csvData: string): Promise<Car[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const cars: Car[] = results.data.map((row: any) => ({
          id: row.REG || '',
          make: row.MAKE || '',
          model: row.MODEL || '',
          mileage: row.MILEAGE ? parseInt(row.MILEAGE.replace(/,/g, '')) : 0,
          carYear: row.CAR_YEAR ? parseInt(row.CAR_YEAR) : 0,
          reserveOrBuyNowPrice: row.RESERVE_OR_BUY_NOW_PRICE ? parseFloat(row.RESERVE_OR_BUY_NOW_PRICE.replace(/,/g, '')) : 0,
          previousOwnersCount: row.PREVIOUS_OWNERS_COUNT ? parseInt(row.PREVIOUS_OWNERS_COUNT) : 0,
          serviceHistory: row.SERVICE_HISTORY || '',
          status: 'new',
        }));
        resolve(cars);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

export const generateSimplifiedCsv = (cars: Car[]): string => {
  const headers = ['VRM', 'MILEAGE'];
  const rows = cars.map(car => [car.id, car.mileage.toString()]);
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  return csvContent;
};

export const parseFinalCsv = (csvData: string): Promise<Partial<Car>[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const updatedCars: Partial<Car>[] = results.data.map((row: any) => ({
          id: row.VRM || '',
          mileage: row.MILEAGE ? parseInt(row.MILEAGE) : 0,
          // Add any other fields that are present in the final CSV
        }));
        resolve(updatedCars);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

export const combineCarData = (originalCars: Car[], updatedData: Partial<Car>[]): Car[] => {
  return originalCars.map(car => {
    const update = updatedData.find(u => u.id === car.id);
    return update ? { ...car, ...update } : car;
  });
};