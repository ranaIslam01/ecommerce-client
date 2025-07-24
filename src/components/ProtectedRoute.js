import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Store } from '../context/Store';

export default function ProtectedRoute() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  // যদি ব্যবহারকারী লগইন করা থাকে, তাহলে তাকে সেই পেজটি দেখাও (Outlet)।
  // অন্যথায়, তাকে /login পেজে পাঠিয়ে দাও।
  return userInfo ? <Outlet /> : <Navigate to="/login" />;
}