import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from '../context/Store';
import CheckoutSteps from '../components/CheckoutSteps';

export default function PaymentMethodPage() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart: { shippingAddress, paymentMethod } } = state;

  const [paymentMethodName, setPaymentMethod] = useState(paymentMethod || 'PayPal');

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
    localStorage.setItem('paymentMethod', paymentMethodName);
    navigate('/placeorder');
  };

  return (
    <div>
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Payment Method</h1>
        <form onSubmit={submitHandler} className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <input type="radio" id="PayPal" value="PayPal" checked={paymentMethodName === 'PayPal'} onChange={(e) => setPaymentMethod(e.target.value)} className="mr-2"/>
            <label htmlFor="PayPal">PayPal</label>
          </div>
          <div className="mb-4">
            <input type="radio" id="Stripe" value="Stripe" checked={paymentMethodName === 'Stripe'} onChange={(e) => setPaymentMethod(e.target.value)} className="mr-2"/>
            <label htmlFor="Stripe">Stripe</label>
          </div>
           <div className="mb-4">
            <input type="radio" id="CashOnDelivery" value="CashOnDelivery" checked={paymentMethodName === 'CashOnDelivery'} onChange={(e) => setPaymentMethod(e.target.value)} className="mr-2"/>
            <label htmlFor="CashOnDelivery">Cash On Delivery</label>
          </div>
          <button type="submit" className="w-full bg-gray-900 text-white py-2 rounded-lg font-semibold hover:bg-gray-800">Continue</button>
        </form>
      </div>
    </div>
  );
}