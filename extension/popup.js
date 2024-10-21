document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('registrationForm');
  const resultDiv = document.getElementById('result');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const registration = document.getElementById('registration').value;
    
    fetch(`https://tiny-basbousa-fb329f.netlify.app/.netlify/functions/getRetailValuation?reg=${encodeURIComponent(registration)}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          resultDiv.innerHTML = `<p>Error: ${data.error}</p>`;
        } else {
          resultDiv.innerHTML = `
            <h3>Car Details:</h3>
            <p>Registration: ${data.registration}</p>
            <p>Make: ${data.make}</p>
            <p>Model: ${data.model}</p>
            <p>Retail Valuation: £${data.retailValuation.toFixed(2)}</p>
          `;
        }
      })
      .catch(error => {
        resultDiv.innerHTML = `<p>Error: ${error.message}</p>`;
      });
  });
});