import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import MetaTags from 'react-meta-tags';

import siteLogoImage from '../images/site-logo.png';
import ogImage from '../images/elect-map-og-image.png';

const Nav = () => {
  const location = useLocation();
  const isCompareView = location.pathname.split('/')[1] === 'compare';
  const province = isCompareView ? location.pathname.split('/')[2] : '';
  return (
    <nav className="nav">
      <MetaTags>
        <meta
          hid="og:title"
          property="og:title"
          content="แผนที่เขตเลือกตั้งย้อนหลังของประเทศไทย"
        />
        <meta
          hid="og:description"
          property="og:description"
          content="ย้อนดูการแบ่งเขตและผลการเลือกตั้งในอดีตของไทยได้ที่นี่"
        />

        <meta
          hid="og:url"
          property="og:url"
          content="https://past-election-map.netlify.app/"
        />
        <meta hid="og:image" property="og:image" content={ogImage} />
        <link
          rel="icon"
          href="https://elect.in.th/wp-content/uploads/2018/10/favicon.ico"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </MetaTags>
      <a href="https://elect.in.th" className="nav--logo nav--logo__elect">
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
