import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../dist')));

// Add this new endpoint
app.post('/api/calculateProfit', (req, res) => {
  const { retailValuation, inputs } = req.body;
  
  // Implement the profit calculation logic here
  const carwowFee = getCarwowFee(retailValuation);
  const totalCosts = carwowFee + inputs.delivery + inputs.mot + inputs.service + 
                     inputs.cosmetic + inputs.warrantyAndValet;
  const requiredGrossProfit = inputs.desiredNetProfit * 1.2; // Account for VAT (20%)
  const bidPrice = retailValuation - (6/5) * (inputs.desiredNetProfit + totalCosts);
  const actualGrossProfit = retailValuation - bidPrice;
  const vatAmount = actualGrossProfit / 6; // VAT is 1/6 of the gross profit
  const actualNetProfit = actualGrossProfit - vatAmount - totalCosts;

  res.json({
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