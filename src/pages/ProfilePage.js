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
    <div className="flex flex-col md:flex-row gap-8 px-2 md:px-0 w-full max-w-6xl mx-auto">
      <div className="md:w-1/3 w-full mb-8 md:mb-0">
        <h2 className="text-2xl font-bold mb-4 text-center md:text-left">Update Profile</h2>
        <form onSubmit={submitHandler} className="bg-white p-4 md:p-6 rounded-lg shadow-md w-full max-w-md mx-auto md:mx-0">
            <div className="mb-4"><label className="block mb-1">Name</label><input value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-2 border rounded"/></div>
            <div className="mb-4"><label className="block mb-1">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-2 border rounded"/></div>
            <div className="mb-4"><label className="block mb-1">New Password</label><input type="password" onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded"/></div>
            <div className="mb-6"><label className="block mb-1">Confirm New Password</label><input type="password" onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-2 border rounded"/></div>
            <button type="submit" className="w-full bg-gray-900 text-white py-2 rounded-lg font-semibold hover:bg-gray-800">Update</button>
        </form>
      </div>
    </div>
  );
}