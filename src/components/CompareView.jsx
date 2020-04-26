import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import _ from 'lodash';
import * as d3 from 'd3';
import styled from 'styled-components';

import MapContext from '../map/context';
import partyColor from '../map/color';
import { ELECTION_YEAR } from '../config';
import { isMobile, device } from './size';

import StackedBar from './MapView/StackedBar';
import { NoVoteDisplay, NoBeungKanProvince } from './MapView/NationalView';
import { SeePartyMenu, SeeWinnerMenu } from './MapView/ProvincialView';
import D3Compare from './MapView/ProvincialViewDetail/D3Compare';

const Container = styled.div`
  position: fixed;
  display: block;
  width: 100%;
  top: 6rem;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f0f0f0;
  z-index: 2;
  overflow: scroll;
`;

const ZoneDetailTitle = styled.div`
  white-space: pre-wrap;
`;

const ZoneDetailText = styled.p`
  width: 300px;
  font-size: 1.2rem;
  font-family: 'Noto Sans Thai';
  white-space: normal;
`;

const Header = styled.div`
  margin: 0 auto;
  margin-top: 26px;
  width: 100%;
  height: 5rem;
  display: flex;

  @media ${device.tablet} {
    width: 100%;
    height: 11rem;
    margin-top: 0;
    padding: 1rem;
    display: grid;
    grid-template-columns: 10rem 18rem;
    grid-template-rows: 3.2rem 3.2rem;
    grid-template-areas:
      'back dropdown'
      'view view';
    column-gap: 1rem;
    row-gap: 1rem;
    justify-items: stretch;
    align-items: start;
    justify-content: space-between;
    align-content: stretch;
  }
`;

const ViewParty = styled.div`
  width: 100%;
  // height: 800px;
  margin: 0 auto;
  margin-top: 28px;
  color: black;
`;

const PartyUL = styled.ul`
  display: flex;
  list-style-type: none;
  // align-items: center;
  justify-content: center;
  margin: 0 auto;
  width: 100%;

  @media ${device.tablet} {
    flex-direction: column;
  }
`;

const Year = styled.li`
  top: 0px;
  margin-bottom: 5rem;
  width: 344px;

  &:not(:last-child) {
    border-right: 2px solid #000000;
  }

  @media ${device.tablet} {
    width: 100%;

    &:not(:last-child) {
      border-right: none;
    }
  }
`;

const CardList = styled.div`
  width: 295px;
  // height: 700px;
  margin: 0 auto;
  text-align: center;

  @media ${device.tablet} {
    width: 100%;
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: 3rem 25rem auto;
    grid-template-areas:
      'year'
      'chart'
      'info';
    column-gap: 0;
    row-gap: 2rem;
    justify-items: stretch;
    align-items: start;
    justify-content: stretch;
    align-content: stretch;
  }
`;

const CardYearTitle = styled.h1`
  font-family: 'The MATTER';
  font-size: 3rem;

  @media ${device.tablet} {
    grid-area: year;
  }
`;

const CardMapSvg = styled.div`
  @media ${device.tablet} {
    grid-area: chart;
  }
`;

const CardInfo = styled.div`
  @media ${device.tablet} {
    grid-area: info;
  }
`;

const PartyCardContainer = styled.div`
  min-height: 240px;
  max-width: 260px;
  width: 90%;
  border-radius: var(--border-radius);
  background-color: #ffffff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  margin: 0 auto;
  padding: 10px;

  @media ${device.tablet} {
    margin-left: 0;
    max-width: initial;
    margin: 0 auto;
    min-height: 120px;
  }
`;

const PersonCardContainer = styled.div`
  min-height: 240px;
  max-width: 260px;
  width: 90%;
  border-radius: var(--border-radius);
  background-color: #ffffff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  margin: 0 auto;
  padding: 10px;

  @media ${device.tablet} {
    margin-left: 0;
    max-width: initial;
    margin: 0 auto;
    min-height: 120px;
  }
`;

const DistricExplain = styled.h2`
  color: #484848;
  font-family: 'The MATTER';
  font-size: 1.5rem;
  text-align: left;
  line-height: 21px;
`;

const Quota = styled.h1`
  color: #484848;
  font-family: 'The MATTER';
  font-size: 2.4rem;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 21px;
  text-align: left;
  margin-top: 15px;
`;

const LineHr = styled.hr`
  margin-top: 21px;
  border: none;
  border-bottom: 1px solid #000000;
`;

const UlPartyList = styled.ul`
  list-style: none;
  max-height: 35vh;
  overflow-y: scroll;
  a {
    color: inherit;
  }
`;

const LiPartyList = styled.li`
  font-size: 1.6rem;
  margin: 0.5rem 0;
  text-align: left;
  font-family: 'Noto Sans';
  overflow: hidden;
`;

const HeaderBack = styled.div`
  a {
    text-decoration: none;
  }

  @media ${device.tablet} {
    grid-area: back;
  }
`;

const BackButton = styled.div`
  height: 5rem;
  width: 16rem;
  left: 50px;
  border: 1px solid #333333;
  border-radius: var(--border-radius);
  background-color: #ffffff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
  position: absolute;
  font-family: 'The MATTER';
  font-size: 3rem;
  color: black;
  text-align: center;
  line-height: 40px;

  @media ${device.tablet} {
    position: static;
    width: 100%;
    font-size: 1.6rem;
    line-height: 1.5;
    padding: 0 1rem;
    height: auto;

    i {
      display: none;
    }
  }
`;

const HeaderViewMode = styled.div`
  width: 40rem;
  margin: 0 auto;

  .provincial-view--toggle {
    height: 100%;
    border-radius: var(--border-radius);
  }

  .provincial-view--toggle-button {
    height: 100%;
  }
  .toggle-container {
    position: absolute;
  }

  @media ${device.tablet} {
    grid-area: view;
    width: 100%;
    height: 100%;

    .provincial-view--toggle {
      .provincial-view--toggle-button {
        .toggle-container {
          font-size: 2rem !important;
          line-height: 1.2;
          bottom: 0 !important;
          position: static;
        }
      }
    }
  }
`;

const DropDownContainer = styled.div`
  right: 55px;
  width: 30rem;
  height: 5rem;
  position: absolute;
  .dropdown--container {
    height: 100%;
    width: 100%;
  }
  .dropdown--button {
    height: 100%;
    padding-top: 0;
    font-size: 3rem;
    overflow: hidden;
  }

  @media ${device.tablet} {
    grid-area: dropdown;
    position: static;
    width: 100%;

    .dropdown--button {
      position: static;
      width: 100%;
      font-size: 1.6rem;
      line-height: 1.5;
      padding: 0 1rem;
      height: auto;
    }

    .dropdown--items {
      top: 3.5rem;
    }

    i {
      border: none;
      height: 1.5rem;
      &::after {
        top: 0;
      }
    }
  }
`;

let maps;

function getMapDimension() {
  if (isMobile()) {
    const marginTop = 0,
      marginBottom = 0,
      marginLeft = 10,
      marginRight = 10;
    const w = innerWidth - marginLeft - marginRight,
      h = 250 - marginTop - marginBottom;
    return {
      w,
      h,
      marginTop,
      marginBottom,
      marginLeft,
      marginRight
    };
  } else {
    const marginTop = 0,
      marginBottom = 0,
      marginLeft = 25,
      marginRight = 25;
    const w = 300 - marginLeft - marginRight,
      h = 300 - marginTop - marginBottom;
    return {
      w,
      h,
      marginTop,
      marginBottom,
      marginLeft,
      marginRight
    };
  }
}

const mapDimension = getMapDimension();

const compareYears = ELECTION_YEAR.map(y => y.year);

const YearList = ({ view = 'party', party = [], person = [] }) => {
  const tooltipZoneRef = useRef();
  const { province, CountryTopoJson } = useContext(MapContext);
  const [tooltips, setTooltips] = useState([]);
  const [tooltipsStyles, setTooltipStyles] = useState({
    width: 0,
    left: null,
    top: null,
    opacity: 0
  });

  useEffect(() => {
    if (CountryTopoJson.length === 0) return;

    const $compare = d3.selectAll('svg[id*=compare-election-]');
    const $defs = d3.select(`#map-defs-compare`);
    maps = D3Compare(
      CountryTopoJson,
      compareYears,
      $compare,
      $defs,
      mapDimension,
      isMobile() ? 12000 : 15000,
      setTooltips
    );
  }, [CountryTopoJson]);

  useEffect(() => {
    if (CountryTopoJson.length === 0) return;
    maps.handleProvinceChange(province);
  }, [CountryTopoJson, province]);

  return (
    <ViewParty>
      <PartyUL>
        {compareYears.map((year, index) => {
          return (
            <Year key={year}>
              <CardList>
                <CardYearTitle>ปี {year}</CardYearTitle>
                <CardMapSvg>
                  <svg
                    id={`compare-election-${year}`}
                    data-election-year={`election-${year}`}
                    width={
                      mapDimension.w +
                      mapDimension.marginLeft +
                      mapDimension.marginRight
                    }
                    height={
                      mapDimension.h +
                      mapDimension.marginTop +
                      mapDimension.marginBottom
                    }
                    onMouseMove={e => {
                      const offset = tooltipZoneRef.current.offsetHeight;

                      if (tooltips.length !== 0) {
                        setTooltipStyles({
                          top: e.currentTarget.parentElement.offsetTop - offset,
                          left: e.clientX,
                          overflow: 'hidden',
                          transform: 'translate(-50%, 0%)',
                          whiteSpace: 'nowrap',
                          opacity: 1,
                          zIndex: '10'
                        });
                      } else {
                        setTooltipStyles({
                          width: 0,
                          top: null,
                          left: null,
                          opacity: 0
                        });
                      }
                    }}
                  >
                    <defs id={`map-defs-compare`}></defs>
                  </svg>
                </CardMapSvg>
                <CardInfo>
                  {view === 'party' ? (
                    <PartyCard data={party[index]} />
                  ) : (
                    <PersonCard data={person[index]} />
                  )}
                </CardInfo>
                <div className="tooltips" style={tooltipsStyles}>
                  <ZoneDetailTitle>{tooltips[0]}</ZoneDetailTitle>
                  <ZoneDetailText ref={tooltipZoneRef}>
                    {tooltips[1]}
                  </ZoneDetailText>
                </div>
              </CardList>
            </Year>
          );
        })}
      </PartyUL>
    </ViewParty>
  );
};

const TitleZone = ({ province, zone, numCandidateByZone }) => {
  return (
    <div>
      <DistricExplain>เขตเลือกตั้ง จังหวัด{province}</DistricExplain>
      <Quota>
        {zone} เขต / {numCandidateByZone} คน
      </Quota>
    </div>
  );
};

const PartyCard = ({ data = {} }) => {
  const { year: paramYear } = useParams();
  const isNovote = data.year === 'election-2557';
  const numCandidateByZone = data.data.reduce(
    (acc, val) => acc + val.candidate,
    0
  );
  return (
    <PartyCardContainer>
      <TitleZone
        province={data.province}
        zone={data.zone}
        numCandidateByZone={numCandidateByZone}
      />
      <LineHr />
      {isNovote ? (
        <NoVoteDisplay view={'compareView'} />
      ) : (
        <UlPartyList>
          {data.province === 'บึงกาฬ' && data.year === 'election-2550' ? (
            <NoBeungKanProvince year={paramYear} />
          ) : (
            data.data.map(({ party, candidate }) => (
              <LiPartyList key={party}>
                <span
                  className="party-list--party-box"
                  style={{
                    backgroundColor: partyColor(data.year)(party)
                  }}
                ></span>
                <a href={`https://theyworkforus.elect.in.th/party/${party}`} target="_blank">พรรค{party}</a>
                {' '}
                <span className="party-list--count">
                  <span style={{ fontFamily: 'Noto Sans', fontWeight: 500 }}>
                    {candidate}
                  </span>{' '}
                  คน
                </span>
              </LiPartyList>
            ))
          )}
        </UlPartyList>
      )}
    </PartyCardContainer>
  );
};

const PersonCard = ({ data = {} }) => {
  const isNovote = data.year === 'election-2557';
  const numCandidateByZone = data.data.reduce((acc, val) => acc + val.quota, 0);
  const districtWinners = data.data.map(({ zone_id, result, quota }) => {
    if (!result) return;
    result.sort((a, b) => b.score - a.score);
    const winnerResultArray = result
      .sort((a, b) => b.score - a.score)
      .slice(0, quota);
    const totalScore = result.reduce((total, cur) => (total += cur.score), 0);
    winnerResultArray.map(val => {
      val.ratio = val.score / totalScore;
    });
    return { zone_id, winnerResultArray, result, quota, year: data.year };
  });

  const percentageFormat = d3.format('.2%');

  return (
    <PersonCardContainer>
      <TitleZone
        province={data.province}
        zone={data.zone}
        numCandidateByZone={numCandidateByZone}
      />
      <LineHr />
      {isNovote ? (
        <NoVoteDisplay view={'compareView'} />
      ) : (
        <ul className="provincial-view--list">
          {data.province === 'บึงกาฬ' && data.year === 'election-2550' ? (
            <NoBeungKanProvince />
          ) : (
            <div>
              {districtWinners.map(
                ({ zone_id, winnerResultArray, result, quota, year }) => (
                  <li
                    key={zone_id + data.year}
                    className="provincial-view--list-item"
                  >
                    <div>
                      {' '}
                      <b className="provincial-view--list-zone">
                        เขต {zone_id}
                      </b>
                    </div>
                    {winnerResultArray.map(winner => (
                      <div
                        className="provincial-view--list-item__winner"
                        key={winner.first_name + winner.party}
                      >
                        <span
                          style={{
                            display: 'inline-block',
                            width: '1rem',
                            height: '1rem',
                            marginRight: '0.5rem',
                            backgroundColor: partyColor(data.year)(winner.party)
                          }}
                        ></span>
                        <a href={`https://theyworkforus.elect.in.th/people/${winner.first_name}-${winner.last_name}`} target="_blank">{winner.title} {winner.first_name} {winner.last_name}</a>
                        {", "}
                        <a href={`https://theyworkforus.elect.in.th/party/${winner.party}`} target="_blank">พรรค{winner.party}</a>
                        {', '}
                        <span
                          style={{ fontFamily: 'Noto Sans', fontWeight: 500 }}
                        >
                          {percentageFormat(winner.ratio)}
                        </span>
                      </div>
                    ))}
                    <StackedBar data={result} zoneQuota={quota} year={year} />
                  </li>
                )
              )}
            </div>
          )}
        </ul>
      )}
    </PersonCardContainer>
  );
};

const CompareView = () => {
  const [partyView, setPartyView] = useState(true);
  const { CountryTopoJson, setProvince, province } = useContext(MapContext);
  const { province: paramProvince, year: paramYear } = useParams();

  useEffect(() => {
    setProvince(paramProvince);
  }, [paramProvince]);
  let partyData, personData;

  if (CountryTopoJson.length !== 0) {
    const electionYear = compareYears.map(year => `election-${year}`);
    let provincialZone = [];
    let byParty = [];
    let byPartySorted = [];
    let byPersonSorted = [];

    electionYear.forEach(year => {
      let currentProvince = CountryTopoJson.objects[year].geometries
        .filter(geo => geo.properties.province_name === paramProvince)
        .map(geo => geo.properties);
      currentProvince.sort((a, b) => a.zone_id - b.zone_id);
      provincialZone.push(currentProvince);
      byPersonSorted.push({
        data: currentProvince
      });
    });

    provincialZone.forEach(zones => {
      let currentByParty = {};
      zones.forEach(zone => {
        if (!zone.result) {
          if (!('noresult' in currentByParty)) {
            currentByParty['noresult'] = ['novote'];
          } else {
            currentByParty['noresult'] = [
              ...currentByParty['noresult'],
              'novote'
            ];
          }
          return;
        }
        // get top candidates limited by zone quota
        zone.result
          .sort((a, b) => b.score - a.score)
          .slice(0, zone.quota)
          .forEach(person => {
            if (!(person.party in currentByParty)) {
              currentByParty[person.party] = [person];
            } else {
              currentByParty[person.party] = [
                ...currentByParty[person.party],
                person
              ];
            }
          });
      });
      byParty.push(currentByParty);
    });

    byParty.forEach(val => {
      let currentByPartySorted = [];
      for (let [party, winnerResult] of Object.entries(val)) {
        currentByPartySorted.push({ party, candidate: winnerResult.length });
      }
      currentByPartySorted.sort((a, b) => b.candidate - a.candidate);
      byPartySorted.push({
        data: currentByPartySorted
      });
    });

    electionYear.forEach((year, index) => {
      byPartySorted[index].year = year;
      byPartySorted[index].province = paramProvince;
      byPartySorted[index].zone = provincialZone[index].length;

      byPersonSorted[index].year = year;
      byPersonSorted[index].province = paramProvince;
      byPersonSorted[index].zone = provincialZone[index].length;
    });
    partyData = byPartySorted;
    personData = byPersonSorted;
  }

  return (
    <Container>
      <Header>
        <HeaderBack>
          <Link to={`/${paramYear}/${paramProvince}`}>
            <BackButton>
              <i className="icon--chevron icon--chevron__left"></i> กลับ
            </BackButton>
          </Link>
        </HeaderBack>
        <HeaderViewMode>
          <div className="provincial-view--toggle">
            <div
              className={`provincial-view--toggle-button ${partyView &&
                'active'}`}
              onClick={() => setPartyView(true)}
            >
              <SeePartyMenu partyView={partyView} view={'compareView'} />
            </div>
            <div
              className={`provincial-view--toggle-button ${!partyView &&
                'active'}`}
              onClick={() => setPartyView(false)}
            >
              <SeeWinnerMenu partyView={partyView} view={'compareView'} />
            </div>
            <span
              className="provincial-view--toggle-active"
              style={{ left: !partyView && '50%' }}
            ></span>
          </div>
        </HeaderViewMode>
        <DropDownContainer>
          <DropdownCompare>{paramProvince}</DropdownCompare>
        </DropDownContainer>
      </Header>
      {!partyData ? (
        <div
          style={{
            width: '100%',
            height: '300px',
            margin: '0 auto',
            position: 'relative',
            textAlign: 'center'
          }}
        >
          <h1 style={{ fontSize: '3rem', lineHeight: '300px', color: 'black' }}>
            กำลังโหลดข้อมูล
          </h1>
        </div>
      ) : (
        <YearList
          view={partyView ? 'party' : 'person'}
          party={partyData}
          person={personData}
        />
      )}
    </Container>
  );
};

let allProvinces = [];
const DropdownCompare = props => {
  const { setProvince, CountryTopoJson } = useContext(MapContext);
  const [filter, setFilter] = useState('');
  const [dropdownProvinces, setDropdownProvinces] = useState([]);
  const { year: paramYear } = useParams();
  const {
    ref,
    isComponentVisible: showItems,
    setIsComponentVisible: setShowItems
  } = useComponentVisible(false);
  const searchRef = useRef(null);

  useEffect(() => {
    if (CountryTopoJson.length === 0) return;
    allProvinces = Array.from(
      new Set(
        CountryTopoJson.objects['election-2562'].geometries.map(
          d => d.properties.province_name
        )
      )
    ).sort();

    setDropdownProvinces(allProvinces);
  }, [CountryTopoJson]);

  useEffect(() => {
    const filteredProvince = allProvinces.filter(province =>
      province.includes(filter)
    );
    setDropdownProvinces(filteredProvince);
  }, [filter]);

  useEffect(() => {
    setFilter('');
    if (showItems) searchRef.current.focus();
  }, [showItems]);

  return (
    <div className="dropdown--container" ref={ref}>
      <button
        className="dropdown--button"
        onClick={() => setShowItems(prev => !prev)}
        style={{
          paddingTop: '0px'
        }}
      >
        {props.children}
        <i className="dropdown--chevron" style={{ marginTop: '5px' }}></i>
      </button>
      {showItems && (
        <div className="dropdown--items">
          <div className="dropdown--items-wrapper">
            <div className="dropdown--search">
              <input
                type="text"
                className="dropdown--search-input"
                onChange={e => setFilter(e.target.value)}
                placeholder="พิมพ์จังหวัด"
                ref={searchRef}
              />
            </div>
            {dropdownProvinces.map(province => (
              <Link
                key={province}
                to={`/${paramYear}/compare/${province}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div
                  className="dropdown--item"
                  key={province}
                  onClick={() => {
                    setProvince(province);
                    setShowItems(prev => !prev);
                  }}
                >
                  {province}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

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

export default CompareView;
