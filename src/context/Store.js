import React, { createContext, useReducer } from 'react';

export const Store = createContext();

// --- প্রাথমিক অবস্থা (Initial State) ---
const initialUserInfo = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

let initialCartItems = []; // ডিফল্টরূপে কার্ট খালি

if (initialUserInfo) {
  // যদি ব্যবহারকারী আগে থেকেই লগইন করা থাকে (যেমন, ব্রাউজার বন্ধ করে আবার খোলা হয়েছে)
  // তাহলে তার নির্দিষ্ট কার্ট localStorage থেকে লোড করার চেষ্টা করা হবে
  const userSpecificCart = localStorage.getItem(`cartItems_${initialUserInfo._id}`);
  if (userSpecificCart) {
    initialCartItems = JSON.parse(userSpecificCart);
  }
} else if (localStorage.getItem('cartItems')) {
  initialCartItems = JSON.parse(localStorage.getItem('cartItems'));
}
// অতিথি ব্যবহারকারীর জন্য initialState-এ cartItems সবসময় খালি থাকবে, localStorage থেকে লোড হবে না।

const initialState = {
  userInfo: initialUserInfo,
  cart: {
    shippingAddress: localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : {},
    paymentMethod: localStorage.getItem('paymentMethod')
      ? localStorage.getItem('paymentMethod')
      : '',
    cartItems: initialCartItems, // লগইন করা ইউজারের জন্য তার সেভ করা কার্ট, অথবা গেস্ট/নতুন ইউজারের জন্য খালি
  },
};

// --- Reducer ফাংশন ---
function reducer(state, action) {
  switch (action.type) {
    case 'USER_LOGIN':
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
      // এই ইউজারের জন্য তার নিজস্ব সেভ করা কার্ট (যদি থাকে) localStorage থেকে লোড করা
      let userCartItemsOnLogin = [];
      const userCartData = localStorage.getItem(`cartItems_${action.payload._id}`);
      if (userCartData) {
        userCartItemsOnLogin = JSON.parse(userCartData);
      }
      // লগইন করার সময় আগের (অতিথি অবস্থার) স্টেট-এর কার্ট বা localStorage-এর guestCartItems ব্যবহার করা হবে না।
      // শিপিং এবং পেমেন্ট তথ্যও রিসেト করা হচ্ছে
      localStorage.removeItem('shippingAddress'); // নতুন লগইন সেশনের জন্য এগুলো রিসেট
      localStorage.removeItem('paymentMethod');
      return {
        ...state,
        userInfo: action.payload,
        cart: {
          cartItems: userCartItemsOnLogin, // ইউজারের নিজস্ব কার্ট লোড করা হলো
          shippingAddress: {},
          paymentMethod: '',
        },
      };

    case 'USER_LOGOUT':
      // ইউজারের কার্টের আইটেমগুলো তার ID দিয়ে localStorage এ সেভ করা আছে (CART_ADD_ITEM দ্বারা)।
      // তাই লগআউটের সময় সেগুলো মোছার দরকার নেই, যাতে সে আবার লগইন করলে পায়।
      localStorage.removeItem('userInfo');
      localStorage.removeItem('shippingAddress');
      localStorage.removeItem('paymentMethod');
      return {
        ...state,
        userInfo: null,
        cart: {
          cartItems: [], // UI-তে কার্ট খালি দেখাবে (অতিথি অবস্থার জন্য)
          shippingAddress: {},
          paymentMethod: '',
        },
      };
    
    case 'CART_ADD_ITEM': {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      if (state.userInfo) {
        localStorage.setItem(`cartItems_${state.userInfo._id}`, JSON.stringify(cartItems));
      } else {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
      }
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      if (state.userInfo) {
        localStorage.setItem(`cartItems_${state.userInfo._id}`, JSON.stringify(cartItems));
      } else {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
      }
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'CART_CLEAR':
      if (state.userInfo) {
        localStorage.removeItem(`cartItems_${state.userInfo._id}`);
      } else {
        localStorage.removeItem('cartItems');
      }
      return { ...state, cart: { ...state.cart, cartItems: [] } };
    
    case 'SAVE_SHIPPING_ADDRESS':
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
      return { ...state, cart: { ...state.cart, shippingAddress: action.payload } };
    case 'SAVE_PAYMENT_METHOD':
      localStorage.setItem('paymentMethod', action.payload);
      return { ...state, cart: { ...state.cart, paymentMethod: action.payload } };
    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{children}</Store.Provider>;
}