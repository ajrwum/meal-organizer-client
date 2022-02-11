import React from 'react';

const ResetCategoryFilter = ({ label, cssClass, actionClbk }) => {
  return (
    <button className={cssClass} onClick={actionClbk}>
      {label}
    </button>
  );
};

export default ResetCategoryFilter;
