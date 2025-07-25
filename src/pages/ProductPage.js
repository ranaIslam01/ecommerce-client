import React, { useState, useEffect, useContext, useReducer } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Link import kora hocche
import axios from 'axios';
import { Store } from '../context/Store';

// Product fetch korar jonno reducer
const productFetchReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// Review submit korar jonno reducer
const reviewSubmitReducer = (state, action) => {
  switch (action.type) {
    case 'SUBMIT_REQUEST':
      return { ...state, loadingSubmit: true };
    case 'SUBMIT_SUCCESS':
      return { ...state, loadingSubmit: false, successSubmit: true };
    case 'SUBMIT_FAIL':
      return { ...state, loadingSubmit: false, errorSubmit: action.payload };
    case 'SUBMIT_RESET':
      return { ...state, loadingSubmit: false, successSubmit: false, errorSubmit: '' };
    default:
      return state;
  }
};

export default function ProductPage() {
  const navigate = useNavigate();
  const params = useParams();
  const { id: productId } = params;

  // Product fetch korar jonno state ebong dispatch
  const [{ loading, error, product }, dispatchProduct] = useReducer(productFetchReducer, {
    product: { reviews: [] }, // reviews k khali array diye initialize kora hocche
    loading: true,
    error: '',
  });

  // Review submit korar jonno state ebong dispatch
  const [{ loadingSubmit, errorSubmit, successSubmit }, dispatchReview] = useReducer(reviewSubmitReducer, {
    loadingSubmit: false,
    errorSubmit: '',
    successSubmit: false,
  });
  
  const [qty, setQty] = useState(1);
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  // Notun review er jonno state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      dispatchProduct({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(`/api/products/${productId}`);
        dispatchProduct({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatchProduct({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchProduct();

    if (successSubmit) { // Jodi review submit shofol hoy, tahole state reset kora hocche
        dispatchReview({ type: 'SUBMIT_RESET' });
        setRating(0);
        setComment('');
        // Optionally, refetch product to show new review immediately
        // fetchProduct(); // Comment out if you don't want to auto-refresh
    }

  }, [productId, successSubmit]); // successSubmit k dependency te add kora hocche

  const addToCartHandler = () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.qty + qty : qty;

    if (product.countInStock < quantity) {
      alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, qty: quantity },
    });
    navigate('/cart');
  };

  // Review submit korar handler function
  const submitReviewHandler = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      alert('Please enter comment and rating');
      return;
    }
    dispatchReview({ type: 'SUBMIT_REQUEST' });
    try {
      await axios.post(
        `/api/products/${productId}/reviews`,
        { rating, comment },
        // Token pathanor dorkar nei karon amra cookie bebohar korchi
        // { headers: { Authorization: `Bearer ${userInfo.token}` }, } 
      );
      dispatchReview({ type: 'SUBMIT_SUCCESS' });
      alert('Review submitted successfully. It might take a moment to appear.');
      // Optionally, refetch product to show new review immediately or update state locally
      // For simplicity, we are not auto-refreshing here. User can refresh.
    } catch (err) {
      dispatchReview({ type: 'SUBMIT_FAIL', payload: err.response?.data?.message || err.message });
      alert(err.response?.data?.message || 'Failed to submit review');
    }
  };

  return loading ? (
    <div>Loading...</div>
  ) : error ? (
    <div className="text-red-500">{error}</div>
  ) : (
    <div>
      {/* Product Details Section - Ager মতোই থাকবে */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <img className="w-full rounded-lg shadow-lg" src={product.image} alt={product.name} />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{product.name}</h1>
          {/* Rating Stars - ProductCard e o add kora jete pare */}
          <div className="flex items-center mb-2">
            {/* Placeholder for star rating component */}
            <span className="text-yellow-500">{'⭐'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}</span>
            <span className="ml-2 text-gray-600">({product.numReviews} reviews)</span>
          </div>
          <p className="text-gray-600 border-t border-b py-4 my-4">{product.description}</p>
          <div className="text-3xl font-bold text-gray-900 mb-4">
            Price: ${product.price}
          </div>
          <div className="border p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg">Status:</span>
              <span className={product.countInStock > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            {product.countInStock > 0 && (
              <div className="flex justify-between items-center my-2">
                <span className="text-lg">Quantity:</span>
                <select value={qty} onChange={(e) => setQty(Number(e.target.value))} className="p-2 border rounded">
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>{x + 1}</option>
                  ))}
                </select>
              </div>
            )}
            <button onClick={addToCartHandler} disabled={product.countInStock === 0} className="mt-4 w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed">
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section - Notun ongsho */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
        {product.reviews?.length === 0 && <div className="p-4 border rounded-md bg-gray-50">No reviews yet.</div>}
        <div className="space-y-4">
          {product.reviews?.map((review) => (
            <div key={review._id} className="p-4 border rounded-md bg-white shadow">
              <div className="flex items-center mb-1">
                <strong className="mr-2">{review.name}</strong>
                <span className="text-yellow-500">{'⭐'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
              </div>
              <p className="text-gray-500 text-sm mb-1">{review.createdAt.substring(0, 10)}</p>
              <p>{review.comment}</p>
            </div>
          ))}
        </div>

        {/* Write a Review Section - Notun ongsho */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-3">Write a Customer Review</h3>
          {userInfo ? ( // Shudhumatro login kora user review form dekhte parbe
            <form onSubmit={submitReviewHandler} className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-4">
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <select 
                  id="rating" 
                  value={rating} 
                  onChange={(e) => setRating(Number(e.target.value))} 
                  required 
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select...</option>
                  <option value="1">1 - Poor</option>
                  <option value="2">2 - Fair</option>
                  <option value="3">3 - Good</option>
                  <option value="4">4 - Very Good</option>
                  <option value="5">5 - Excellent</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                <textarea 
                  id="comment" 
                  rows="4" 
                  value={comment} 
                  onChange={(e) => setComment(e.target.value)} 
                  required 
                  className="w-full p-2 border rounded-md"
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={loadingSubmit} 
                className="bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 disabled:bg-gray-400"
              >
                {loadingSubmit ? 'Submitting...' : 'Submit Review'}
              </button>
              {errorSubmit && <div className="text-red-500 mt-2">{errorSubmit}</div>}
            </form>
          ) : (
            <div className="p-4 border rounded-md bg-gray-50">
              Please <Link to={`/login?redirect=/product/${productId}`} className="text-blue-600 hover:underline">sign in</Link> to write a review.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}