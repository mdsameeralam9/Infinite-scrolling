import React from 'react';
import './card.css';


const sampleProduct = {
  name: 'Wireless Headphones',
  price: 2999,
  image: 'https://via.placeholder.com/250x180.png?text=Product+Image'
};


const Card = ({ product={...sampleProduct} }) => {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} className="product-image" />
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">₹{product.price}</p>
      </div>
    </div>
  );
};

export default Card;
