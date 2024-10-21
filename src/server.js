import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../dist')));

// Mock car data (replace this with your actual data source)
const carData = [
  { registration: 'ABC123', make: 'Toyota', model: 'Camry', retailValuation: 25000 },
  { registration: 'XYZ789', make: 'Honda', model: 'Civic', retailValuation: 20000 },
  { registration: 'DF17UXG', make: 'Honda', model: 'Civic', retailValuation: 15000 },
];

app.post('/api/calculateProfit', (req, res) => {
  const { registration, delivery, mot, service, cosmetic, warrantyAndValet, desiredNetProfit } = req.body;
  
  // Find the car by registration
  const car = carData.find(c => c.registration.toLowerCase() === registration.toLowerCase());
  
  if (!car) {
    return res.status(404).json({ error: 'Car not found' });
  }

  const retailValuation = car.retailValuation;
  const carwowFee = getCarwowFee(retailValuation);
  const totalCosts = carwowFee + delivery + mot + service + cosmetic + warrantyAndValet;
  const requiredGrossProfit = desiredNetProfit * 1.2; // Account for VAT (20%)
  const bidPrice = retailValuation - (6/5) * (desiredNetProfit + totalCosts);
  const actualGrossProfit = retailValuation - bidPrice;
  const vatAmount = actualGrossProfit / 6; // VAT is 1/6 of the gross profit
  const actualNetProfit = actualGrossProfit - vatAmount - totalCosts;

  res.json({
    registration: car.registration,
    make: car.make,
    model: car.model,
    retailValuation: retailValuation.toFixed(2),
    carwowFee: carwowFee.toFixed(2),
    bidPrice: bidPrice.toFixed(2),
    vatAmount: vatAmount.toFixed(2),
    actualNetProfit: actualNetProfit.toFixed(2)
  });
});

function getCarwowFee(price) {
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

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});