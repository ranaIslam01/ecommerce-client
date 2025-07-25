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
    <div className="flex justify-center items-center min-h-[60vh] bg-gradient-to-br from-gray-100 to-gray-200 py-8 px-2">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Update Profile</h2>
        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <label className="block mb-1 text-gray-700 font-semibold">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
          </div>
          <div>
            <label className="block mb-1 text-gray-700 font-semibold">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
          </div>
          <div>
            <label className="block mb-1 text-gray-700 font-semibold">New Password</label>
            <input type="password" onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="Leave blank to keep current password" />
          </div>
          <div>
            <label className="block mb-1 text-gray-700 font-semibold">Confirm New Password</label>
            <input type="password" onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="Repeat new password" />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold text-lg transition">Update</button>
        </form>
      </div>
    </div>
  );
}