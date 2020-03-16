import React from 'react';

const DISTRICT_SOURCE = [
  {
    year: 'ปี 2550',
    link: 'http://www.ratchakitcha.soc.go.th/DATA/PDF/2550/A/076/15.PDF'
  },
  {
    year: 'ปี 2554',
    link: 'http://www.ratchakitcha.soc.go.th/DATA/PDF/2554/A/019/29.PDF'
  },
  {
    year: 'ปี 2554 (แก้ไขเพิ่มจังหวัดบึงกาฬ)',
    link: 'http://www.ratchakitcha.soc.go.th/DATA/PDF/2554/A/030/38.PDF'
  },
  {
    year: 'ปี 2557',
    link: 'http://www.ratchakitcha.soc.go.th/DATA/PDF/2556/A/122/1.PDF'
  },
  {
    year: 'ปี 2562',
    link: 'http://www.ratchakitcha.soc.go.th/DATA/PDF/2562/A/010/T_0002.PDF'
  }
];

const ELECTION_RESULT = [
  {
    year: 'ปี 2550',
    link: 'https://www.ect.go.th/ewt/ewt/ect_th/ewt_dl_link.php?nid=2395f'
  },
  {
    year: 'ปี 2554',
    link: 'https://www.ect.go.th/ewt/ewt/ect_th/ewt_dl_link.php?nid=2394'
  },
  {
    year: 'ปี 2562',
    link:
      'https://www.ect.go.th/ect_th/download/article/article_20190507142930.pd'
  }
];

const AboutUs = props => {
  return (
    <div className="about-us">
      <h2 className="about-us--header">เกี่ยวกับโปรเจ็คนี้</h2>
      <section className="about-us--section about-us--section__source">
        <h3 className="about-us--source-header">ที่มาของข้อมูล</h3>

        <ul className="about-us--source-list">
          <li className="about-us--source-list-item">
            <table className="about-us--source-table">
              <caption>ข้อมูลการแบ่งเขตการเลือกตั้ง</caption>
              <thead>
                <tr>
                  <th>ปี</th>
                  <th>ที่มา</th>
                </tr>
              </thead>
              <tbody>
                {DISTRICT_SOURCE.map(({ year, link }) => (
                  <tr key={year}>
                    <td>{year}</td>
                    <td>
                      <a href={link}>{link}</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </li>
          <li className="about-us--source-list-item">
            <table className="about-us--source-table">
              <caption>
                ข้อมูลผลการเลือกตั้ง (ยึดเอาข้อมูลอย่างเป็นทางการที่รับรองโดย
                กกต. สำหรับการแสดงผล โดยไม่รวมการเปลี่ยนแปลงจากการลาออก พ้นสภาพ
                หรือเลือกตั้งซ่อม)
              </caption>
              <thead>
                <tr>
                  <th>ปี</th>
                  <th>ที่มา</th>
                </tr>
              </thead>
              <tbody>
                {ELECTION_RESULT.map(({ year, link }) => (
                  <tr key={year}>
                    <td>{year}</td>
                    <td>
                      <a href={link}>{link}</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </li>
        </ul>
      </section>

      <section className="about-us--section about-us--section__program">
        <h3 className="about-us--program-header">เขียนโปรแกรม</h3>
        <span>
          <a href="https://github.com/rapee">rapee</a>
        </span>
        <span>
          <a href="https://github.com/thasarito">thasarito</a>
        </span>
        <span>
          <a href="https://github.com/phoneee/">phoneee</a>
        </span>
      </section>

      <section className="about-us--section about-us--section__design">
        <h3 className="about-us--design-header">
          ออกแบบ บรรณาธิการ และประสานงาน
        </h3>
        <span>
          <a href="https://punchup.world/">Punch Up Team</a>
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
    </div>
  );
};

export default AboutUs;
