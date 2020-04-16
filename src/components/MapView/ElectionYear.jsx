import React, { useEffect, useContext } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import MapContext from '../../map/context';

const TH_ELECTION_YEAR = [
  { en: 'election-2562', th: 'ปี 2562' },
  { en: 'election-2557', th: 'ปี 2557' },
  { en: 'election-2554', th: 'ปี 2554' },
  { en: 'election-2550', th: 'ปี 2550' }
];

const ElectionYear = props => {
  const { year: paramYear } = useParams();
  const { province, electionYear, setElectionYear } = useContext(MapContext);

  useEffect(() => {
    if (!paramYear) return;
    setElectionYear(`election-${paramYear}`);
  }, [paramYear]);

  return (
    <ul className="year-choice--list">
      {TH_ELECTION_YEAR.map(({ en, th }) => (
        <li
          className={`year-choice--list-item ${en === electionYear &&
            'year-choice--list-item__active'}`}
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
