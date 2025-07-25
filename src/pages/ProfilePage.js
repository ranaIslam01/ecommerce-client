import React, { useContext, useReducer, useEffect, useState } from 'react';
import { Store } from '../context/Store';
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

export default function ProfilePage() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: error.message });
      }
    };
    fetchOrders();
  }, [userInfo]);
  
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API_URL || 'https://ecommerce-server-1-6mhy.onrender.com'}/api/users/profile`,
        { name, email, password },
        { withCredentials: true }
      );
      ctxDispatch({ type: 'USER_LOGIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      alert('Profile updated successfully');
    } catch (err) {
      alert('Profile update failed');
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <h2 className="text-2xl font-bold mb-4">Update Profile</h2>
        <form onSubmit={submitHandler} className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4"><label className="block mb-1">Name</label><input value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-2 border rounded"/></div>
            <div className="mb-4"><label className="block mb-1">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-2 border rounded"/></div>
            <div className="mb-4"><label className="block mb-1">New Password</label><input type="password" onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded"/></div>
            <div className="mb-6"><label className="block mb-1">Confirm New Password</label><input type="password" onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-2 border rounded"/></div>
            <button type="submit" className="w-full bg-gray-900 text-white py-2 rounded-lg font-semibold hover:bg-gray-800">Update</button>
        </form>
      </div>
      <div className="md:col-span-2">
        <h2 className="text-2xl font-bold mb-4">My Orders</h2>
        {loading ? ( <p>Loading orders...</p> ) : error ? ( <p className="text-red-500">{error}</p> ) : (
            <div className="overflow-x-auto bg-white p-4 rounded-lg shadow">
                <table className="min-w-full text-sm">
                    <thead><tr className="text-left"><th>ID</th><th>DATE</th><th>TOTAL</th><th>PAID</th><th>DELIVERED</th><th>ACTIONS</th></tr></thead>
                    <tbody>
                        {(Array.isArray(orders) ? orders : []).map((order) => (
                            <tr key={order._id} className="border-t">
                                <td className="py-2">{order._id}</td>
                                <td>{order.createdAt.substring(0, 10)}</td>
                                <td>${order.totalPrice.toFixed(2)}</td>
                                <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td>
                                <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : 'No'}</td>
                                <td><button onClick={() => {navigate(`/order/${order._id}`)}} className="text-blue-600 hover:underline">Details</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  );
}