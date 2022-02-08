import React from 'react';

const Day = ({ dayDate }) => {
  console.log('dayDate :>> ', dayDate);
  const dayDateForDisplay = dayDate.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  console.log('dayDateForDisplay :>> ', dayDateForDisplay);

  return (
    <div className="day-container">
      <h3>{dayDateForDisplay}</h3>
    </div>
  );
};

export default Day;
