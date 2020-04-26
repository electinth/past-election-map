import React, { useContext } from 'react';
import MapContext from '../../../map/context';
import partyColor from '../../../map/color';
import './styles.scss';

const PartyList = ({ byPartySorted, view }) => {
  const { electionYear } = useContext(MapContext);
  const borderTop =
    view === 'nationView' ? { borderTop: '1px solid black' } : {};
  return (
    <ul className="party-list--list" style={borderTop}>
      {byPartySorted.map(({ party, candidate }) => (
        <li key={party} className="party-list--list-item">
          <span
            className="party-list--party-box"
            style={{
              backgroundColor: partyColor(electionYear)(party)
            }}
          ></span>
          <a href={`https://theyworkforus.elect.in.th/party/${party}`} target="_blank">พรรค{party}</a>
          {' '}
          <span className="party-list--count">
            {' '}
            <span style={{ fontFamily: 'Noto Sans', fontWeight: 500 }}>
              {candidate}
            </span>{' '}
            คน
          </span>
        </li>
      ))}
    </ul>
  );
};

export default PartyList;
