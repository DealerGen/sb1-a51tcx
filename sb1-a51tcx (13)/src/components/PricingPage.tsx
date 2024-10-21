import React from 'react';
import { Check, X } from 'lucide-react';

const PricingPage: React.FC = () => {
  const plans = [
    {
      name: 'Basic',
      price: '£49',
      period: 'per month',
      features: [
        'Access to BidBuddy AI',
        'Up to 100 vehicle analyses per month',
        'Basic profit calculator',
        'Email support',
      ],
      notIncluded: [
        'Advanced bidding strategies',
        'Unlimited vehicle analyses',
        'Priority support',
        'Custom integrations',
      ],
    },
    {
      name: 'Pro',
      price: '£99',
      period: 'per month',
      features: [
        'Access to BidBuddy AI',
        'Unlimited vehicle analyses',
        'Advanced profit calculator',
        'Advanced bidding strategies',
        'Priority email and chat support',
        'Basic API access',
      ],
      notIncluded: [
        'Custom integrations',
        'Dedicated account manager',
      ],
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact us',
      features: [
        'All Pro features',
        'Unlimited vehicle analyses',
        'Custom integrations',
        'Dedicated account manager',
        'On-site training',
        'Full API access',
      ],
      notIncluded: [],
    },
  ];

  return (
    <div className="bg-gradient-to-r from-purple-800 to-indigo-900 min-h-screen text-white">
      <div className="container mx-auto py-16 px-4">
        <h1 className="text-4xl font-bold text-center mb-4">Choose Your BidBuddy Plan</h1>
        <p className="text-xl text-center mb-12">Supercharge your car bidding with AI-powered insights</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">{plan.name}</h2>
              <div className="text-4xl font-bold mb-2">{plan.price}</div>
              <div className="text-gray-400 mb-6">{plan.period}</div>
              <ul className="mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center mb-2">
                    <Check className="text-green-500 mr-2" size={20} />
                    <span>{feature}</span>
                  </li>
                ))}
                {plan.notIncluded.map((feature, i) => (
                  <li key={i} className="flex items-center mb-2 text-gray-500">
                    <X className="text-red-500 mr-2" size={20} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300">
                {plan.name === 'Enterprise' ? 'Contact Us' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Why Choose BidBuddy?</h2>
          <p className="text-xl mb-8">BidBuddy uses advanced AI to help you make smarter bidding decisions and maximize your profits.</p>
          <ul className="text-left max-w-2xl mx-auto">
            <li className="flex items-center mb-4">
              <Check className="text-green-500 mr-2" size={24} />
              <span>AI-powered vehicle analysis and valuation</span>
            </li>
            <li className="flex items-center mb-4">
              <Check className="text-green-500 mr-2" size={24} />
              <span>Intelligent profit calculator for optimal bidding</span>
            </li>
            <li className="flex items-center mb-4">
              <Check className="text-green-500 mr-2" size={24} />
              <span>Real-time market data and trends</span>
            </li>
            <li className="flex items-center mb-4">
              <Check className="text-green-500 mr-2" size={24} />
              <span>Customizable bidding strategies</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;