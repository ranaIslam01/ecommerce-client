import React, { useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function MyOrdersPage() {
  const navigate = useNavigate();
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    orders: [],
  });

  useEffect(() => {
    const fetchOrders = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL || 'https://ecommerce-server-1-6mhy.onrender.com'}/api/orders/myorders`,
          { withCredentials: true }
        );
        // Sort orders by newest first
        const sorted = (Array.isArray(data) ? [...data] : []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        dispatch({ type: 'FETCH_SUCCESS', payload: sorted });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: error.message });
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="flex flex-col px-2 md:px-0 w-full max-w-6xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center md:text-left">My Orders</h2>
      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto bg-white p-2 md:p-4 rounded-lg shadow w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left">
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(orders) ? orders : []).map((order) => (
                <tr key={order._id} className="border-t">
                  <td className="py-2 break-all max-w-[100px]">{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>${order.totalPrice.toFixed(2)}</td>
                  <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td>
                  <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : 'No'}</td>
                  <td>
                    <button
                      onClick={() => {
                        navigate(`/order/${order._id}`);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 