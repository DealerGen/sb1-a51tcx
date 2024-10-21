const carData = [
  { registration: 'ABC123', make: 'Toyota', model: 'Camry', retailValuation: 25000 },
  { registration: 'XYZ789', make: 'Honda', model: 'Civic', retailValuation: 20000 },
  { registration: 'DF17UXG', make: 'Honda', model: 'Civic', retailValuation: 15000 },
];

exports.handler = async function(event, context) {
  console.log('Function invoked');
  console.log('Event:', JSON.stringify(event));
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Successful OPTIONS response' })
    };
  }

  if (event.httpMethod !== 'POST') {
    console.log('Method not allowed:', event.httpMethod);
    return { 
      statusCode: 405, 
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    console.log('Parsing request body');
    const { registration } = JSON.parse(event.body);
    console.log('Received data:', { registration });
    
    console.log('Searching for car');
    const car = carData.find(c => c.registration.toLowerCase() === registration.toLowerCase());
    
    if (!car) {
      console.log('Car not found');
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Car not found' }),
      };
    }

    const result = {
      registration: car.registration,
      make: car.make,
      model: car.model,
      retailValuation: car.retailValuation.toFixed(2),
    };

    console.log('Sending response:', result);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result)
    };
  } catch (error) {
    console.error('Error in function:', error);
    return { 
      statusCode: 500, 
      headers,
      body: JSON.stringify({ error: 'Failed to retrieve car data', details: error.message }) 
    };
  }
};