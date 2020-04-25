import React from 'react';
import styled from 'styled-components';

import { device } from './size';

const DISTRICT_SOURCE = [
  {
    year: 'ปี 2550',
    site: 'ratchakitcha.soc.go.th',
    link: 'http://www.ratchakitcha.soc.go.th/DATA/PDF/2550/A/076/15.PDF'
  },
  {
    year: 'ปี 2554',
    site: 'ratchakitcha.soc.go.th',
    link: 'http://www.ratchakitcha.soc.go.th/DATA/PDF/2554/A/019/29.PDF'
  },
  {
    year: 'ปี 2554 แก้ไขเพิ่มจังหวัดบึงกาฬ',
    site: 'ratchakitcha.soc.go.th',
    link: 'http://www.ratchakitcha.soc.go.th/DATA/PDF/2554/A/030/38.PDF'
  },
  {
    year: 'ปี 2557',
    site: 'ratchakitcha.soc.go.th',
    link: 'http://www.ratchakitcha.soc.go.th/DATA/PDF/2556/A/122/1.PDF'
  },
  {
    year: 'ปี 2562',
    site: 'ratchakitcha.soc.go.th',
    link: 'http://www.ratchakitcha.soc.go.th/DATA/PDF/2562/A/010/T_0002.PDF'
  }
];

const ELECTION_RESULT = [
  {
    year: 'ปี 2550',
    site: 'ect.go.th',
    link: 'https://www.ect.go.th/ewt/ewt/ect_th/ewt_dl_link.php?nid=2395f'
  },
  {
    year: 'ปี 2554',
    site: 'ect.go.th',
    link: 'https://www.ect.go.th/ewt/ewt/ect_th/ewt_dl_link.php?nid=2394'
  },
  {
    year: 'ปี 2562',
    site: 'ect.go.th',
    link:
      'https://www.ect.go.th/ect_th/download/article/article_20190507142930.pd'
  }
];

const Table = styled.table`
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;

  & caption {
    text-align: left;
    margin-bottom: 1rem;
  }

  & thead tr th {
    font-weight: normal;
    border-top: 1px solid var(--color-black);
    border-bottom: 1px solid var(--color-black);
  }

  & tbody tr:last-child td {
    border-bottom: 1px solid var(--color-black);
  }

  & td,
  & th {
    padding: 0.25rem 2rem;
  }

  & th {
    @media ${device.mobile} {
      width: 10rem;
    }
  }
`;

const GithubButton = styled.div`
  text-align: center;
  & a {
    text-decoration: none;
    font-size: 2.5rem;
    font-family: 'The MATTER', sans-serif;
    color: var(--color-white);
    background-color: var(--color-black);
    padding: 1rem 5rem;
    border-radius: 1rem;
    border: 0;

    @media ${device.mobile} {
      font-size: 2rem;
      padding: 1rem 3rem;
    }
  }
`;

const Copyright = styled.div`
  display: block;
  text-align: center;
  margin-top: 2rem;
  font-size: 1.4rem;
`;

const AboutUs = props => {
  return (
    <div className="about-us">
      <h2 className="about-us--header">เกี่ยวกับโปรเจ็คนี้</h2>
      <section className="about-us--section about-us--section__source">
        <h3 className="about-us--source-header">ที่มาของข้อมูล</h3>

        <ul className="about-us--source-list">
          <li className="about-us--source-list-item">
            <Table>
              <caption>ข้อมูลการแบ่งเขตการเลือกตั้ง</caption>
              <thead>
                <tr>
                  <th>ปี</th>
                  <th>ที่มา</th>
                </tr>
              </thead>
              <tbody>
                {DISTRICT_SOURCE.map(({ year, link, site }) => (
                  <tr key={year}>
                    <td>{year}</td>
                    <td>
                      <a href={link}>{site}</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </li>
          <li className="about-us--source-list-item">
            <Table>
              <caption>
                ข้อมูลผลการเลือกตั้ง{' '}
              </caption>
              <thead>
                <tr>
                  <th>ปี</th>
                  <th>ที่มา</th>
                </tr>
              </thead>
              <tbody>
                {ELECTION_RESULT.map(({ year, link, site }) => (
                  <tr key={year}>
                    <td>{year}</td>
                    <td>
                      <a href={link}>{site}</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <p className="remarks">
              * หมายเหตุ: ยึดเอาข้อมูลอย่างเป็นทางการที่รับรองโดย กกต. สำหรับการแสดงผล
              โดยไม่รวมการเปลี่ยนแปลงจากการลาออก พ้นสภาพ หรือเลือกตั้งซ่อม
            </p>
          </li>
        </ul>
      </section>

      <section className="about-us--section about-us--section__program">
        <h3 className="about-us--program-header">เขียนโปรแกรม</h3>
        <span>
          <a href="https://github.com/thasarito">thasarito</a>
        </span>
        <span>
          <a href="https://github.com/phoneee/">phoneee</a>
        </span>
        <span>
          <a href="https://github.com/tesol2y090">tesol2y090</a>
        </span>
        <span>
          <a href="https://github.com/rapee">rapee</a>
        </span>
      </section>

      <section className="about-us--section about-us--section__design">
        <h3 className="about-us--design-header">
          ออกแบบ บรรณาธิการ และประสานงาน
        </h3>
        <span>
          <a href="https://punchup.world/">Punch Up</a>
        </span>
      </section>

      <section className="about-us--section about-us--section__other">
        <article className="about-us--other">
          หากมีข้อสงสัยต้องการสอบถามเพิ่มเติม
          ประสงค์แจ้งเปลี่ยนแปลงหรือเพิ่มเติมข้อมูลเพื่อความถูกต้อง
          หรือมีข้อเสนอแนะใดๆ สามารถติดต่อได้ที่ contact [at] elect.in.th
          งานชิ้นนี้ได้รับการสนับสนุนทุนในการดำเนินงานจาก
          กองทุนพัฒนาสื่อปลอดภัยและสร้างสรรค์
        </article>
      </section>
      <GithubButton>
        <a
          href="https://github.com/codeforthailand/past-election-map"
          target="_blank"
        >
          View This Project on Github
        </a>
      </GithubButton>
      <Copyright>&copy; 2019 ELECT - All Rights Reserved</Copyright>
    </div>
  );
};

export default AboutUs;
