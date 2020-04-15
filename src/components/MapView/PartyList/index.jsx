import React, { useContext } from 'react';
import MapContext from '../../../map/context';
import partyColor from '../../../map/color';
import './styles.scss';

const PartyList = ({ byPartySorted }) => {
  const { electionYear } = useContext(MapContext);
  return (
    <ul className="party-list--list">
      {byPartySorted.map(({ party, candidate }) => (
        <li key={party} className="party-list--list-item">
          <span
            className="party-list--party-box"
            style={{
              backgroundColor: partyColor(electionYear)(party)
            }}
          ></span>
          {party} <span className="party-list--count">{candidate} คน</span>
        </li>
      ))}
    </ul>
  );
};

export default PartyList;
