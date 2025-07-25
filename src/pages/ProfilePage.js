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

const dummyWishlist = [
  { id: 1, name: 'Canon EOS 80D DSLR Camera', price: 929.99 },
  { id: 2, name: 'Airpods Wireless Bluetooth Headphones', price: 89.99 },
];
const dummyAddresses = [
  { id: 1, label: 'Home', address: 'Dinajpur Sadar, Rangpur, 5200, Bangladesh' },
  { id: 2, label: 'Office', address: 'Dhaka, Bangladesh' },
];

export default function ProfilePage() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  // Profile Picture
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Bio
  const [bio, setBio] = useState(localStorage.getItem('profileBio') || '');
  const handleBioSave = () => {
    localStorage.setItem('profileBio', bio);
    alert('Bio saved!');
  };

  // Dark/Light Mode
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Email Verification (dummy)
  const [emailVerified, setEmailVerified] = useState(false);
  const handleVerifyEmail = () => {
    setEmailVerified(true);
    alert('Email verified! (dummy)');
  };

  // Change Password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      alert('New passwords do not match');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    alert('Password changed! (dummy)');
  };

  // Delete Account (dummy)
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    alert('Account deleted! (dummy)');
  };

  // Account Created Date
  const createdDate = userInfo && userInfo.createdAt ? new Date(userInfo.createdAt).toLocaleDateString() : 'N/A';

  // Recent Activity (dummy: recent orders)
  const [recentOrders, setRecentOrders] = useState([]);
  useEffect(() => {
    // Dummy: fetch last 3 orders from orders API if available
    const fetchRecentOrders = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL || 'https://ecommerce-server-1-6mhy.onrender.com'}/api/orders/myorders`,
          { withCredentials: true }
        );
        setRecentOrders((Array.isArray(data) ? [...data] : []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3));
      } catch {
        setRecentOrders([]);
      }
    };
    fetchRecentOrders();
  }, [userInfo]);

  // Profile Update
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    <div className={`flex flex-col md:flex-row gap-8 px-2 md:px-0 w-full max-w-6xl mx-auto ${darkMode ? 'bg-gray-900 text-white' : ''}`}>
      {/* Profile Sidebar */}
      <div className="md:w-1/3 w-full mb-8 md:mb-0 flex flex-col items-center">
        {/* Avatar */}
        <div className="mb-4 flex flex-col items-center">
          <div className="w-28 h-28 rounded-full bg-gray-200 overflow-hidden mb-2 border-4 border-gray-300 dark:border-gray-700">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="flex items-center justify-center w-full h-full text-4xl text-gray-400">{name[0]}</span>
            )}
          </div>
          <input type="file" accept="image/*" onChange={handleAvatarChange} className="mb-2" />
        </div>
        {/* Name & Email */}
        <div className="mb-2 text-center">
          <div className="font-bold text-lg">{name}</div>
          <div className="text-gray-500 dark:text-gray-300 text-sm">{email}</div>
        </div>
        {/* Account Created Date */}
        <div className="mb-2 text-xs text-gray-400">Account Created: {createdDate}</div>
        {/* Email Verification */}
        <div className="mb-4">
          {emailVerified ? (
            <span className="inline-block px-2 py-1 bg-green-200 text-green-800 rounded text-xs">Email Verified</span>
          ) : (
            <button onClick={handleVerifyEmail} className="inline-block px-2 py-1 bg-yellow-200 text-yellow-800 rounded text-xs">Verify Email</button>
          )}
        </div>
        {/* Dark/Light Mode Toggle */}
        <div className="mb-4">
          <button onClick={() => setDarkMode((d) => !d)} className="px-3 py-1 rounded bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900 font-semibold">
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
        {/* Bio */}
        <div className="mb-4 w-full">
          <textarea
            className="w-full p-2 border rounded text-gray-900 dark:text-gray-900"
            rows={3}
            placeholder="Write something about yourself..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <button onClick={handleBioSave} className="mt-2 w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700">Save Bio</button>
        </div>
        {/* Delete Account */}
        <div className="mb-4 w-full">
          <button onClick={() => setShowDeleteModal(true)} className="w-full bg-red-600 text-white py-1 rounded hover:bg-red-700">Delete Account</button>
        </div>
        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
              <h3 className="text-lg font-bold mb-2 text-red-700">Are you sure you want to delete your account?</h3>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowDeleteModal(false)} className="px-4 py-1 rounded bg-gray-300">Cancel</button>
                <button onClick={handleDeleteAccount} className="px-4 py-1 rounded bg-red-600 text-white">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Profile Main Content */}
      <div className="md:w-2/3 w-full flex flex-col gap-8">
        {/* Profile Update */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Update Profile</h2>
          <form onSubmit={submitHandler} className="flex flex-col gap-4">
            <div>
              <label className="block mb-1">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block mb-1">New Password</label>
              <input type="password" onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block mb-1">Confirm New Password</label>
              <input type="password" onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-2 border rounded" />
            </div>
            <button type="submit" className="w-full bg-gray-900 text-white py-2 rounded-lg font-semibold hover:bg-gray-800">Update</button>
          </form>
        </div>
        {/* Change Password */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Change Password</h2>
          <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
            <div>
              <label className="block mb-1">Current Password</label>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block mb-1">New Password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block mb-1">Confirm New Password</label>
              <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className="w-full p-2 border rounded" />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700">Change Password</button>
          </form>
        </div>
        {/* Recent Activity */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          {recentOrders.length === 0 ? (
            <p className="text-gray-500">No recent orders.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <li key={order._id} className="py-2 flex flex-col md:flex-row md:items-center md:justify-between">
                  <span className="font-semibold">Order #{order._id}</span>
                  <span>Date: {order.createdAt.substring(0, 10)}</span>
                  <span>Total: ${order.totalPrice.toFixed(2)}</span>
                  <button onClick={() => navigate(`/order/${order._id}`)} className="text-blue-600 hover:underline">Details</button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Wishlist */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Wishlist</h2>
          {dummyWishlist.length === 0 ? (
            <p className="text-gray-500">No items in wishlist.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {dummyWishlist.map((item) => (
                <li key={item.id} className="py-2 flex flex-col md:flex-row md:items-center md:justify-between">
                  <span className="font-semibold">{item.name}</span>
                  <span>${item.price.toFixed(2)}</span>
                  <button className="text-red-600 hover:underline">Remove</button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Address Book */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Address Book</h2>
          {dummyAddresses.length === 0 ? (
            <p className="text-gray-500">No saved addresses.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {dummyAddresses.map((addr) => (
                <li key={addr.id} className="py-2 flex flex-col md:flex-row md:items-center md:justify-between">
                  <span className="font-semibold">{addr.label}</span>
                  <span>{addr.address}</span>
                  <button className="text-red-600 hover:underline">Remove</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}