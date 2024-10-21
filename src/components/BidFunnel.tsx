import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Car } from '../types';
import { CheckCircle, Gavel, XCircle, Trophy, ThumbsDown } from 'lucide-react';

interface BidFunnelProps {
  qualifiedCars: Car[];
  bidCars: Car[];
  noBidCars: Car[];
  wonCars: Car[];
  lostCars: Car[];
}

const BidFunnel: React.FC<BidFunnelProps> = ({ 
  qualifiedCars, 
  bidCars, 
  noBidCars,
  wonCars,
  lostCars
}) => {
  const renderCar = (car: Car, index: number) => (
    <Draggable key={car.id} draggableId={car.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-gray-800 p-2 mb-2 rounded-lg cursor-move"
        >
          <p className="text-sm font-semibold">{car.make} {car.model}</p>
          <p className="text-xs text-gray-400">{car.id}</p>
        </div>
      )}
    </Draggable>
  );

  const renderColumn = (title: string, cars: Car[], id: string, icon: React.ReactNode) => (
    <div className="bg-gray-900 p-4 rounded-lg flex-1 mr-4 last:mr-0">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        {icon}
        <span className="ml-2">{title}</span>
        <span className="ml-2 text-sm text-gray-400">({cars.length})</span>
      </h3>
      <Droppable droppableId={id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="min-h-[200px]"
          >
            {cars.map((car, index) => renderCar(car, index))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );

  return (
    <div className="flex mb-8 overflow-x-auto">
      {renderColumn("Qualified", qualifiedCars, "qualified", <CheckCircle className="text-green-500" />)}
      {renderColumn("Bid", bidCars, "bid", <Gavel className="text-blue-500" />)}
      {renderColumn("No Bid", noBidCars, "noBid", <XCircle className="text-red-500" />)}
      {renderColumn("Won", wonCars, "won", <Trophy className="text-yellow-500" />)}
      {renderColumn("Lost", lostCars, "lost", <ThumbsDown className="text-gray-500" />)}
    </div>
  );
};

export default BidFunnel;