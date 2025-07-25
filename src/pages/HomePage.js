import React, { useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useLocation, Link, useNavigate } from 'react-router-dom';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, ...action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get('keyword') || '';
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const limit = 8;

  const [{ loading, error, products, pages, total }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: '',
    pages: 1,
    total: 0,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL || ''}/api/products?keyword=${keyword}&page=${page}&limit=${limit}`
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchProducts();
  }, [keyword, page]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
    const params = new URLSearchParams(location.search);
    if (newPage > 1) {
      params.set('page', newPage);
    } else {
      params.delete('page');
    }
    navigate({ search: params.toString() });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 md:px-0">
      {keyword && products && products.length > 0 && (
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Results for: "{keyword}"
        </h2>
      )}

      {keyword && (!products || products.length === 0) && !loading && (
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
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center md:text-left">
          Latest Products
        </h1>
      )}

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <span className="text-lg text-gray-500">Loading...</span>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : products && products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          {/* Pagination Controls */}
          <div className="flex flex-wrap justify-center items-center gap-2 mb-8">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition"
            >
              Prev
            </button>
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => handlePageChange(p)}
                className={`px-3 py-1 rounded font-bold mx-1 border-2 transition ${
                  p === page
                    ? 'bg-blue-600 text-white border-blue-600 shadow'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= pages}
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition"
            >
              Next
            </button>
          </div>
          <div className="text-center text-gray-500 mb-4">
            Showing {(page - 1) * limit + 1} - {Math.min(page * limit, total)} of {total} products
          </div>
        </>
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
