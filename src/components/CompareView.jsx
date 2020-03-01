import React from 'react';

const CompareView = ({
  match: {
    params: { province }
  }
}) => {
  return (
    <h2>
      <span>Compare {province}</span>
    </h2>
  );
};

export default CompareView;
