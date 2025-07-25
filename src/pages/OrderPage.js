import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Store } from '../context/Store';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export default function OrderPage() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const params = useParams();
  const { id: orderId } = params;

  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL || 'https://ecommerce-server-1-6mhy.onrender.com'}/api/orders/${orderId}`,
          { withCredentials: true }
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };

    if (!userInfo) {
      return; // You may redirect to login here
    }
    if (!order._id || (order._id && order._id !== orderId)) {
      fetchOrder();
    }
  }, [order, userInfo, orderId]);

  return loading ? (
    <div>Loading...</div>
  ) : error ? (
    <div className="text-red-500">{error}</div>
  ) : (
    <div>
      {/* ✅ Updated Heading Section with alignment fix */}
      <div className="mb-6">
        <div className="inline-block text-left">
          <h1 className="text-2xl font-bold text-gray-800 leading-tight">Order Details</h1>
          <p className="text-sm ml-0.75rem text-gray-500 mt-1">Order ID: {order?._id || 'Not Found'}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        <div className="md:col-span-3 space-y-4">
          <div className="border bg-white p-4 rounded-lg shadow">
            <h2 className="font-bold mb-2">Shipping</h2>
            <p><strong>Name:</strong> {order.shippingAddress?.fullName || order.user?.name || 'N/A'}</p>
            <p>
              <strong>Address: </strong>
              {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
            </p>
            {order.isDelivered ? (
              <div className="bg-green-100 text-green-700 p-2 rounded mt-2">Delivered at {order.deliveredAt}</div>
            ) : (
              <div className="bg-red-100 text-red-700 p-2 rounded mt-2">Not Delivered</div>
            )}
          </div>

          <div className="border bg-white p-4 rounded-lg shadow">
            <h2 className="font-bold mb-2">Payment</h2>
            <p><strong>Method:</strong> {order.paymentMethod}</p>
            {order.isPaid ? (
              <div className="bg-green-100 text-green-700 p-2 rounded mt-2">Paid at {order.paidAt}</div>
            ) : (
              <div className="bg-red-100 text-red-700 p-2 rounded mt-2">Not Paid</div>
            )}
          </div>

          <div className="border bg-white p-4 rounded-lg shadow">
            <h2 className="font-bold mb-2">Items</h2>
            <div className="space-y-2">
              {(order.orderItems || []).map((item) => (
                <div key={item._id} className="grid grid-cols-6 items-center gap-2">
                  <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                  <Link to={`/product/${item.product}`} className="col-span-3 hover:underline">
                    {item.name}
                  </Link>
                  <span>{item.qty} x ${item.price}</span>
                  <span>${(item.qty * item.price).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="border p-4 rounded-lg bg-white shadow">
            <h2 className="text-xl font-bold mb-2">Order Summary</h2>
            <div className="space-y-1">
              <p className="flex justify-between"><span>Items</span><span>${(order.itemsPrice ?? 0).toFixed(2)}</span></p>
              <p className="flex justify-between"><span>Shipping</span><span>${(order.shippingPrice ?? 0).toFixed(2)}</span></p>
              <p className="flex justify-between"><span>Tax</span><span>${(order.taxPrice ?? 0).toFixed(2)}</span></p>
              <hr className="my-2" />
              <p className="flex justify-between font-bold"><span>Order Total</span><span>${(order.totalPrice ?? 0).toFixed(2)}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
