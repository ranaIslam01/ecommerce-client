import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../context/Store';
import axios from 'axios';

export default function CartPage() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const updateCartHandler = async (item, qty) => {
    if (item.countInStock < qty) {
      alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, qty },
    });
  };

  const removeItemHandler = (item) => {
    ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };
  
  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      <div className="grid md:grid-cols-4 gap-8">
        <div className="md:col-span-3">
          {cartItems.length === 0 ? (
            <div className="text-center p-4 border rounded-lg">
              Cart is empty. <Link to="/" className="text-blue-600 hover:underline">Go Shopping</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item._id} className="grid grid-cols-6 items-center gap-4 p-4 border rounded-lg bg-white shadow">
                  <div className="col-span-1"><img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded"/></div>
                  <div className="col-span-2"><Link to={`/product/${item._id}`} className="hover:underline font-semibold">{item.name}</Link></div>
                  <div className="col-span-1 flex items-center">
                    <button onClick={() => updateCartHandler(item, item.qty - 1)} disabled={item.qty === 1} className="font-bold p-1">-</button>
                    <span className="px-3">{item.qty}</span>
                    <button onClick={() => updateCartHandler(item, item.qty + 1)} disabled={item.qty === item.countInStock} className="font-bold p-1">+</button>
                  </div>
                  <div className="col-span-1 font-semibold">${item.price}</div>
                  <div className="col-span-1 text-right"><button onClick={() => removeItemHandler(item)} className="text-red-500 hover:text-red-700">Remove</button></div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="md:col-span-1">
          <div className="border p-4 rounded-lg bg-white shadow">
            <h3 className="text-xl font-bold mb-4">
              Subtotal ({cartItems.reduce((a, c) => a + c.qty, 0)}{' '} items) : <br />
              ${cartItems.reduce((a, c) => a + c.price * c.qty, 0).toFixed(2)}
            </h3>
            <button onClick={checkoutHandler} disabled={cartItems.length === 0} className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-400">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}