import React from 'react';
import { Link } from 'react-router-dom';
import siteLogoImage from '../images/site-logo.png';

const Nav = () => {
  return (
    <nav className="nav">
      <a href="https://elect.in.th" className="nav--logo nav--logo__elect">
        <img src={siteLogoImage} className="nav--logo-image"></img>
      </a>
      <Link className="nav--header__link" to="/">
        <h1 className="nav--header">ย้อนดู 'แบ่งเขตเลือกตั้ง' ในอดีต</h1>
      </Link>
      <Link to="/about-us" className="nav--about-us__link">
        <span className="nav--about-us">About Us</span>
      </Link>
    </nav>
  );
};

export default Nav;
