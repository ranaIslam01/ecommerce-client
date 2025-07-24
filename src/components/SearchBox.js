import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate import kora hoyeche

const SearchBox = ({ onSearch }) => { // onSearch prop neoya hocche mobile menu bondho korar jonno
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/?keyword=${keyword}`); // Search query shoh homepage e redirect kora hocche
      setKeyword(''); // Input field khali kora hocche
      if (onSearch) { // Jodi onSearch function pass kora hoy (mobile menu theke)
        onSearch(); // Mobile menu bondho korar jonno onSearch call kora hocche
      }
    } else {
      // Jodi keyword khali thake, tahole shudhu homepage e jabe (optional)
      // navigate('/'); 
      // Othoba kichu na kore input field e focus rakhte paren
    }
  };

  return (
    <form onSubmit={submitHandler} className="flex items-center w-full"> {/* w-full add kora hocche */}
      <input
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder="Search Products..."
        className="text-sm appearance-none rounded-l-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
      />
      <button
        type="submit"
        className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-r-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBox;