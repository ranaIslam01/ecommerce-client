import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
      <Link to={`/product/${product._id}`}>
        <img className="w-full h-56 object-cover" src={product.image} alt={product.name} />
      </Link>
      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
        </Link>
        <div className="flex items-center my-2">
          {/* In a real app, you'd have a Rating component here */}
          <span className="text-gray-600 ml-2">{product.numReviews} reviews</span>
        </div>
        <p className="text-2xl font-bold text-gray-900">${product.price}</p>
      </div>
    </div>
  );
};

export default ProductCard;