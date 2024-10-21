const { cars } = require('../../src/data/cars');

exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return { 
      statusCode: 405, 
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  const registration = event.queryStringParameters.reg;

  if (!registration) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Registration number is required' })
    };
  }

  const car = cars.find(c => c.id.toLowerCase() === registration.toLowerCase() && c.status === 'qualified');

  if (!car) {
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Qualified car not found' })
    };
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      registration: car.id,
      make: car.make,
      model: car.model,
      retailValuation: car.retailValuation
    })
  };
};