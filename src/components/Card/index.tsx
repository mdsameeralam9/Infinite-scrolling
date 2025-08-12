import './card.css';

const Card = ({ label="" }) => {
  return (
    <div className="product-card">
      <img src={'https://picsum.photos/536/354'} alt={label} className="product-image" />
      <div className="product-info">
        <h3 className="product-name">{label}</h3>
        <p className="product-price">{""}</p>
      </div>
    </div>
  );
};

export default Card;
