import React, { useEffect, useReducer } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useLocation, Link } from 'react-router-dom'; // useLocation এবং Link import করা হয়েছে

// Reducer function state management er jonno
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true }; // Data fetch shuru hole loading true hobe
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false }; // Data fetch shofol hole products update hobe, loading false hobe
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }; // Data fetch byartho hole error message dekhabe, loading false hobe
    default:
      return state;
  }
};

const HomePage = () => {
  // useReducer hook bebohar kore state ebong dispatch function neoya hocche
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: '',
  });

  const location = useLocation(); // Bortoman URL er information paoar jonno
  const searchParams = new URLSearchParams(location.search); // URL theke query parameters neoya hocche
  const keyword = searchParams.get('keyword') || ''; // 'keyword' query parameter-er value neoya hocche, na thakle khali string

  // useEffect hook bebohar kore component mount howar por ebong keyword poriborton hole product fetch kora hocche
  useEffect(() => {
    const fetchProducts = async () => {
      dispatch({ type: 'FETCH_REQUEST' }); // Fetch request shuru
      try {
        // Jodi keyword thake, tahole API call e sheta pathano hocche
        // Example: /api/products?keyword=laptop
        const { data } = await axios.get(`/api/products?keyword=${keyword}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data }); // Fetch shofol
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message }); // Fetch byartho
      }
    };
    fetchProducts();
  }, [keyword]); // Dependency array-te keyword rakha hoyeche, tai keyword poriborton holei ei effect abar cholbe

  return (
    <div>
      {/* Jodi search keyword thake ebong product paoya jay, tahole search result er jonno heading dekhabe */}
      {keyword && products.length > 0 && (
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Results for: "{keyword}"
        </h2>
      )}
      {/* Jodi search keyword thake kintu kono product paoya na jay (ebong loading shesh) */}
      {keyword && products.length === 0 && !loading && (
         <div className="text-center py-10">
            <p className="text-xl text-gray-600 mb-2">No products found for "{keyword}"</p>
            <Link to="/" className="text-blue-600 hover:underline">Back to Homepage</Link>
        </div>
      )}
      {/* Jodi kono search keyword na thake (normal homepage) */}
      {!keyword && (
         <h1 className="text-3xl font-bold text-gray-800 mb-6">Latest Products</h1>
      )}
      
      {/* Loading state handle kora hocche */}
      {loading ? (
        <div>Loading...</div>
      ) : error ? ( // Error state handle kora hocche
        <div className="text-red-500">{error}</div>
      ) : products.length > 0 ? ( // Jodi product thake (search result ba normal homepage)
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        // Ei else block ta shudhu tokhon kaaj korbe jokhon keyword nei ebong products o nei (jemon database khali thakle)
        // Ekhon "No products found" message-ti uporei handle kora hocche keyword er jonno
        // Tai, jodi keyword na thake ebong product list khali thake, tahole ei message dekhabe
        !keyword && <div className="text-center py-10"><p className="text-xl text-gray-600">No products available at the moment.</p></div>
      )}
    </div>
  );
};

export default HomePage;