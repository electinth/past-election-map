import React from 'react';
import { Link } from 'react-router-dom';

const Nav = () => {
  return (
    <nav className="nav">
      <a href="https://elect.in.th" className="nav--logo nav--logo__elect">
        ELECT
      </a>
      <Link className="nav--header__link" to="/">
        <h1 className="nav--header">
          ย้อนดู 'แบ่งเขตเลือกตั้ง' ในอดีตของประเทศไทย
        </h1>
      </Link>
      <Link to="/about-us" className="nav--about-us__link">
        <span className="nav--about-us">About Us</span>
      </Link>
    </nav>
  );
};

export default Nav;
