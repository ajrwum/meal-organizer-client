import React from 'react';

const FoodCategoryFilter = ({ category, cssClass, actionClbk }) => {
  return (
    <button
      key={category._id}
      id={category._id}
      className={cssClass}
      style={{ backgroundColor: category.color }}
      onClick={actionClbk}
    >
      {category.name}
    </button>
  );
};

export default FoodCategoryFilter;
