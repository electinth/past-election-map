import React, { useContext, useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import MapContext from '../../map/context';

let provinces = [];
const Dropdown = props => {
  const { electionYear, setProvince, CountryTopoJson } = useContext(MapContext);
  const {
    ref,
    isComponentVisible: showItems,
    setIsComponentVisible: setShowItems
  } = useComponentVisible(false);
  useEffect(() => {
    if (CountryTopoJson.length === 0) return;
    provinces = Array.from(
      new Set(
        CountryTopoJson.objects[electionYear].geometries.map(
          d => d.properties.province_name
        )
      )
    ).sort();

    provinces.unshift('ประเทศไทย');
  }, [electionYear, CountryTopoJson]);
  return (
    <div className="dropdown--container" ref={ref}>
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
                province === 'ประเทศไทย'
                  ? props.history.push(`/${electionYear}`)
                  : props.history.push(`/${electionYear}/${province}`);
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

function useComponentVisible(initialIsVisible) {
  const [isComponentVisible, setIsComponentVisible] = useState(
    initialIsVisible
  );
  const ref = useRef(null);

  const handleClickOutside = event => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsComponentVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });

  return { ref, isComponentVisible, setIsComponentVisible };
}
