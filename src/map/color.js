const party62 = partyname => {
  const colors = {
    เพื่อไทย: '#da3731',
    ประชาธิปัตย์: '#06aff3',
    ชาติไทยพัฒนา: '#ff72a8',
    ภูมิใจไทย: '#209fa0',
    ชาติพัฒนา: '#ffaf41',
    เศรษฐกิจใหม่: '#6e2fff',
    พลังประชารัฐ: '#1f6fff',
    อนาคตใหม่: '#ef7824',
    รวมพลังประชาชาติไทย: '#303d8e',
    ประชาชาติ: '#a35f26'
  };
  return colors[partyname];
};

const party54 = partyname => {
  const colors = {
    เพื่อไทย: '#da3731',
    ประชาธิปัตย์: '#06aff3',
    ชาติไทยพัฒนา: '#ff72a8',
    ภูมิใจไทย: '#209fa0',
    ชาติพัฒนาเพื่อแผ่นดิน: '#bf8331',
    พลังชล: '#51daef',
    มาตุภูมิ: '#4a8d30'
  };
  return colors[partyname];
};

const party50 = partyname => {
  const colors = {
    พลังประชาชน: '#6d1c19',
    ประชาธิปัตย์: '#06aff3',
    ชาติไทย: '#bf567e',
    มัชฌิมาธิปไตย: '#187778',
    รวมใจไทยชาติพัฒนา: '#ffbf67',
    เพื่อแผ่นดิน: '#0d8bb1',
    ประชาราช: '#c6920c'
  };
  return colors[partyname];
};

const partyColor = electionYear => {
  const yearColor = {
    'election-2562': party62,
    'election-2554': party54,
    'election-2550': party50,
    'election-2557': () => 'white'
  };
  return yearColor[electionYear];
};

export { party62, party54, party50 };
export default partyColor;
