import React, { useEffect, useReducer } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useLocation, Link } from 'react-router-dom';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const HomePage = () => {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: '',
  });

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get('keyword') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(`/api/products?keyword=${keyword}`);
        console.log('Fetched data:', data); // Debug: check structure
        dispatch({ type: 'FETCH_SUCCESS', payload: data }); // ✅ FIXED LINE
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchProducts();
  }, [keyword]);

  return (
    <div>
      {keyword && products.length > 0 && (
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Results for: "{keyword}"
        </h2>
      )}

      {keyword && products.length === 0 && !loading && (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600 mb-2">
            No products found for "{keyword}"
          </p>
          <Link to="/" className="text-blue-600 hover:underline">
            Back to Homepage
          </Link>
        </div>
      )}

      {!keyword && (
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Latest Products
        </h1>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : Array.isArray(products) && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        !keyword && (
          <div className="text-center py-10">
            <p className="text-xl text-gray-600">
              No products available at the moment.
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default HomePage;
