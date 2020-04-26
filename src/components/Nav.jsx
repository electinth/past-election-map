import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import siteLogoImage from '../images/site-logo.png';

const Nav = () => {
  const location = useLocation();
  const isCompareView = location.pathname.split('/')[1] === 'compare';
  const province = isCompareView ? location.pathname.split('/')[2] : '';
  return (
    <nav className="nav">
      <a href="https://elect.in.th" target="_blank" className="nav--logo nav--logo__elect">
        <img src={siteLogoImage} className="nav--logo-image"></img>
      </a>
      {isCompareView ? (
        <h1 className="nav--header">
          เขตเลือกตั้งจังหวัด{province} เปรียบเทียบ 4 ปี
        </h1>
      ) : (
        <Link className="nav--header__link" to="/">
          <h1 className="nav--header">
            ย้อนดู 'แบ่งเขตเลือกตั้ง' ในอดีตของประเทศไทย
          </h1>
        </Link>
      )}
      <Link to="/about-us" className="nav--about-us__link">
        <span className="nav--about-us">About Us</span>
      </Link>
    </nav>
  );
};

export default Nav;
