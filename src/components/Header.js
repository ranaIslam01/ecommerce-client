import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate import kora hoyeche
import { Store } from '../context/Store';
import SearchBox from './SearchBox'; // SearchBox import kora hoyeche

const Header = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navigate = useNavigate(); // useNavigate hook initialize kora hoyeche

  const logoutHandler = () => {
    ctxDispatch({ type: 'USER_LOGOUT' });
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
    // navigate('/login'); // Logout er por login page e redirect kora jete pare (optional)
  };
  
  // Mobile menu theke search korle menu bondho korar jonno function
  const handleMobileSearch = () => {
    setIsMobileMenuOpen(false); 
  };

  const cartItemCount = cart.cartItems.reduce((a, c) => a + c.qty, 0);

  const cartBadgeContent = cart.cartItems.length > 0 && (
    <span className="absolute -top-2 -right-3 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
      {cartItemCount}
    </span>
  );
  
  const mobileCartBadgeContent = cart.cartItems.length > 0 && (
    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
      {cartItemCount}
    </span>
  );

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="text-2xl font-bold text-gray-900" 
              onClick={() => { setIsMobileMenuOpen(false); setIsProfileDropdownOpen(false); }}
            >
              MERN-Shop
            </Link>
          </div>

          {/* Desktop SearchBox - Logo er pore ebong nav item er age */}
          {/* Shudhu boro screen-e dekhabe (md breakpoint er opore) */}
          <div className="hidden md:flex flex-grow max-w-xl mx-4"> {/* flex-grow max-w-xl mx-4 class gulo search box ke expand korbe */}
            <SearchBox />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/cart" className="relative text-gray-600 hover:text-gray-900 font-medium">
              Cart {cartBadgeContent}
            </Link>
            {userInfo ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="text-gray-600 hover:text-gray-900 font-medium focus:outline-none"
                >
                  {userInfo.name}
                </button>
                <div
                  className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 ${
                    isProfileDropdownOpen ? 'block' : 'hidden'
                  }`}
                >
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="#logout"
                    onClick={logoutHandler} 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </Link>
                </div>
              </div>
            ) : (
              <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button & Mobile Cart Icon */}
          <div className="md:hidden flex items-center"> {/* Shudhu choto screen-e dekhabe */}
            <Link 
              to="/cart" 
              className="relative text-gray-600 hover:text-gray-900 p-2 mr-2" 
              onClick={() => setIsMobileMenuOpen(false)}
            >
               <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {mobileCartBadgeContent}
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none p-2"
              aria-label="Open main menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute top-16 inset-x-0 z-40"> {/* Shudhu choto screen-e dekhabe */}
          {/* Mobile SearchBox - Menu er shurute */}
          <div className="px-4 pt-3 pb-2 border-b border-gray-200"> {/* Border add kora hocche alada korar jonno */}
            <SearchBox onSearch={handleMobileSearch} /> {/* onSearch prop pass kora hocche */}
          </div>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {userInfo ? (
              <>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile ({userInfo.name})
                </Link>
                <Link
                  to="#logout"
                  onClick={logoutHandler}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Sign Out
                </Link>
              </>
            ) : (
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
