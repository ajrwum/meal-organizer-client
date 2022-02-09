import React from "react";
import { Link } from "react-router-dom";

const FoodItem = ({ food, viewClbk, editClbk, deleteClbk }) => {
  return (
    <div className="box" key={food._id}>
      <div className="left-items">
        <div
          className="catColor"
          style={{ backgroundColor: food.category?.color }}
        ></div>
        <span className="food">{food.name}</span>
      </div>
      <div className="actionBtn">
        <span>
          <Link to={`/foods/food/view/${food._id}`}>
            <i className="fa-solid fa-eye"></i>
          </Link>
        </span>
        <span>
          <Link to={`/foods/food/edit/${food._id}`}>
            <i className="fa-solid fa-pencil"></i>
          </Link>
        </span>
        <span>
          <i
            id={food._id}
            className="fa-solid fa-trash-can"
            onClick={deleteClbk}
          ></i>
        </span>
      </div>
    </div>
  );
};

export default FoodItem;
