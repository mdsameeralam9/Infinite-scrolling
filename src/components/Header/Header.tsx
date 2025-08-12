import React from 'react';
import { Link } from 'react-router-dom';
import "./header.css";

const Header = () => {
  return (
    <div className='header'>
      <h2>Infinite Scrolling With</h2>
      <div className="right">
        <Link to="/">Screen Hieght</Link>
        <Link to="/intersection">Intersection Observer</Link>
      </div>
    </div>
  )
}

export default Header