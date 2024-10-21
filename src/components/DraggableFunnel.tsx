import React, { useState, useMemo } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Car, BiddingParameters } from '../types';
import { useCarData } from '../context/CarDataContext';
import ParameterSettings from './ParameterSettings';
import BidFunnel from './BidFunnel';
import VehicleList from './VehicleList';

interface DraggableFunnelProps {
  parameters: BiddingParameters;
  onParametersChange: (newParameters: BiddingParameters) => void;
}

const DraggableFunnel: React.FC<DraggableFunnelProps> = ({ 
  parameters,
  onParametersChange
}) => {
  const { cars, setCars } = useCarData();

  const isCarQualified = (car: Car) => {
    const currentYear = new Date().getFullYear();
    const age = currentYear - (car.carYear || currentYear);
    const price = parseFloat(car.reserveOrBuyNowPrice) || 0;
    return (
      price <= parameters.maxPrice &&
      age <= parameters.maxAge &&
      (car.mileage || 0) <= parameters.maxMileage &&
      (car.autoTraderRetailRating || 0) >= parameters.minRetailRating &&
      (car.daysToSell || 0) <= parameters.maxDaysToSell &&
      (car.previousOwnersCount || 0) <= parameters.maxPreviousOwners &&
      parameters.serviceHistory.includes(car.serviceHistory || '')
    );
  };

  const { qualifiedCars, bidCars, noBidCars, wonCars, lostCars } = useMemo(() => {
    const qualified: Car[] = [];
    const bid: Car[] = [];
    const noBid: Car[] = [];
    const won: Car[] = [];
    const lost: Car[] = [];

    cars.forEach(car => {
      switch (car.status) {
        case 'bid':
          bid.push(car);
          break;
        case 'noBid':
          noBid.push(car);
          break;
        case 'won':
          won.push(car);
          break;
        case 'lost':
          lost.push(car);
          break;
        default:
          if (isCarQualified(car)) {
            qualified.push(car);
          }
      }
    });

    return { qualifiedCars: qualified, bidCars: bid, noBidCars: noBid, wonCars: won, lostCars: lost };
  }, [cars, parameters]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as 'qualified' | 'bid' | 'noBid' | 'won' | 'lost';

    setCars(prevCars => prevCars.map(car => 
      car.id === draggableId ? { ...car, status: newStatus } : car
    ));
  };

  return (
    <div>
      <ParameterSettings onParametersChange={onParametersChange} initialParameters={parameters} />
      <DragDropContext onDragEnd={onDragEnd}>
        <BidFunnel
          qualifiedCars={qualifiedCars}
          bidCars={bidCars}
          noBidCars={noBidCars}
          wonCars={wonCars}
          lostCars={lostCars}
        />
      </DragDropContext>
      <VehicleList cars={cars} />
    </div>
  );
};

export default DraggableFunnel;