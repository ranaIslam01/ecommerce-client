import React from 'react';

export default function CheckoutSteps(props) {
  return (
    <div className="flex justify-center mb-8">
      <div className="w-full max-w-2xl">
        <div className="flex items-center text-sm">
          <div className={`flex-1 text-center ${props.step1 ? 'font-bold text-gray-900' : 'text-gray-400'}`}>
            Sign-In
          </div>
          <div className="flex-1 border-t-2 border-gray-300"></div>
          <div className={`flex-1 text-center ${props.step2 ? 'font-bold text-gray-900' : 'text-gray-400'}`}>
            Shipping
          </div>
          <div className="flex-1 border-t-2 border-gray-300"></div>
          <div className={`flex-1 text-center ${props.step3 ? 'font-bold text-gray-900' : 'text-gray-400'}`}>
            Payment
          </div>
          <div className="flex-1 border-t-2 border-gray-300"></div>
          <div className={`flex-1 text-center ${props.step4 ? 'font-bold text-gray-900' : 'text-gray-400'}`}>
            Place Order
          </div>
        </div>
      </div>
    </div>
  );
}