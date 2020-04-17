import React, { useEffect, useContext } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import MapContext from '../../map/context';
import { ELECTION_YEAR } from '../../config';

const ElectionYear = props => {
  const { year: paramYear } = useParams();
  const { province, electionYear, setElectionYear } = useContext(MapContext);

  useEffect(() => {
    if (!paramYear) return;
    setElectionYear(`election-${paramYear}`);
  }, [paramYear]);

  return (
    <ul className="year-choice--list">
      {ELECTION_YEAR.map(({ en, th }) => (
        <li
          className={`year-choice--list-item ${`election-${en}` ===
            electionYear && 'year-choice--list-item__active'}`}
          key={en}
          onClick={() =>
            province === 'ประเทศไทย'
              ? props.history.push(`/${en}`)
              : props.history.push(`/${en}/${province}`)
          }
        >
          {th}
        </li>
      ))}
    </ul>
  );
};

export default withRouter(ElectionYear);
