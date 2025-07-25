import React, { useContext, useEffect, useReducer } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../context/Store';
import CheckoutSteps from '../components/CheckoutSteps';
import axios from 'axios';

const reducer = (state, action) => {
  switch(action.type) {
    case 'CREATE_REQUEST':
      return {...state, loading: true};
    case 'CREATE_SUCCESS':
      return {...state, loading: false};
    case 'CREATE_FAIL':
      return {...state, loading: false};
    default:
      return state;
  }
}

export default function PlaceOrderPage() {
  const navigate = useNavigate();
  const [{loading}, dispatch] = useReducer(reducer, {loading: false});

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  cart.itemsPrice = round2(cart.cartItems.reduce((a, c) => a + c.qty * c.price, 0));
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  cart.taxPrice = round2(0.15 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart, navigate]);

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL || 'https://ecommerce-server-1-6mhy.onrender.com'}/api/orders`,
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        },
        { withCredentials: true }
      );
      ctxDispatch({ type: 'CART_CLEAR' });
      dispatch({ type: 'CREATE_SUCCESS' });
      localStorage.removeItem('cartItems');
      navigate(`/order/${data._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      alert("Order creation failed.");
    }
  };

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
      <h1 className="text-2xl font-bold mb-6">Preview Order</h1>
      <div className="grid md:grid-cols-4 gap-8">
        <div className="md:col-span-3 space-y-4">
          <div className="border bg-white p-4 rounded-lg shadow">
            <h2 className="font-bold mb-2">Shipping</h2>
            <p><strong>Name:</strong> {cart.shippingAddress.fullName || userInfo.name}</p>
            <p><strong>Address: </strong>{cart.shippingAddress.address}, {cart.shippingAddress.city}, {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}</p>
          </div>
          <div className="border bg-white p-4 rounded-lg shadow">
            <h2 className="font-bold mb-2">Payment</h2>
            <p><strong>Method:</strong> {cart.paymentMethod}</p>
          </div>
          <div className="border bg-white p-4 rounded-lg shadow">
            <h2 className="font-bold mb-2">Items</h2>
            <div className="space-y-2">
            {cart.cartItems.map((item) => (
              <div key={item._id} className="grid grid-cols-6 items-center gap-2">
                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                <Link to={`/product/${item._id}`} className="col-span-3 hover:underline">{item.name}</Link>
                <span>{item.qty} x ${item.price}</span>
                <span>${item.qty * item.price}</span>
              </div>
            ))}
            </div>
          </div>
        </div>
        <div className="md:col-span-1">
          <div className="border p-4 rounded-lg bg-white shadow">
            <h2 className="text-xl font-bold mb-2">Order Summary</h2>
            <div className="space-y-1">
              <p className="flex justify-between"><span>Items</span><span>${cart.itemsPrice.toFixed(2)}</span></p>
              <p className="flex justify-between"><span>Shipping</span><span>${cart.shippingPrice.toFixed(2)}</span></p>
              <p className="flex justify-between"><span>Tax</span><span>${cart.taxPrice.toFixed(2)}</span></p>
              <hr className="my-2"/>
              <p className="flex justify-between font-bold"><span>Order Total</span><span>${cart.totalPrice.toFixed(2)}</span></p>
            </div>
            <button onClick={placeOrderHandler} disabled={cart.cartItems.length === 0 || loading} className="mt-4 w-full bg-gray-900 text-white py-2 rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-400">
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}