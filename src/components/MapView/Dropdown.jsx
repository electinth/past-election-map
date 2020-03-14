import React, { useContext, useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import MapContext from '../../map/context';

let provinces = [];
const Dropdown = props => {
  const { electionYear, setProvince, CountryTopoJson } = useContext(MapContext);
  const [showItems, setShowItems] = useState(false);
  useEffect(() => {
    if (CountryTopoJson.length === 0) return;
    provinces = Array.from(
      new Set(
        CountryTopoJson.objects[electionYear].geometries.map(
          d => d.properties.province_name
        )
      )
    ).sort();
    console.log('Run', electionYear);
  }, [electionYear, CountryTopoJson]);
  return (
    <div className="dropdown--container">
      <button
        className="dropdown--button"
        onClick={() => setShowItems(prev => !prev)}
      >
        {props.children}
        <i className="dropdown--chevron"></i>
      </button>
      {showItems && (
        <div className="dropdown--items">
          {provinces.map(province => (
            <div
              className="dropdown--item"
              key={province}
              onClick={() => {
                setProvince(province);
                setShowItems(prev => !prev);
                props.history.push(`/${electionYear}/${province}`);
              }}
            >
              {province}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default withRouter(Dropdown);
