import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiHandler from "../api/apiHandler";
import FoodItem from "../components/Food/FoodItem";
import "../styles/Foods.css";

const Foods = () => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState(null);
  const [isFilterDeactivated, setIsFilterDeactivated] = useState(false);

  useEffect(() => {
    console.log("component mounted");
    apiHandler.get("/foods").then(({ data }) => {
      console.log("foods - apiRes.data >>>", data);
      setFoods(data);
    });
  }, [isFilterDeactivated]);

  useEffect(() => {
    apiHandler.get("/foods/categories").then((response) => {
      console.log("response :>> ", response);
      setCategories(response.data);
    });
  }, []);

  const handleDelete = (e) => {
    apiHandler.delete(`/foods/food/${e.target.id}`).then((response) => {
      setFoods(foods.filter((food) => food._id !== e.target.id));
    });
  };

  const handleFilter = (e) => {
    console.log("filtering... :>> ");
    e.preventDefault();
    apiHandler.get(`/foods/${e.target.id}`).then((response) => {
      console.log("***response*** :>> ", response);
      setFoods(response.data);
    });
  };

  return (
    <div className="container">
      <div className="foodTitle">
        <h2>Tous mes Aliments </h2>
        <span className="addFood">
          <Link to="/foods/food/new">
            <i className="fa-solid fa-plus"></i>
          </Link>
        </span>
      </div>
      <div className="filters">
        <button
          className="allFoodBtn"
          onClick={() => setIsFilterDeactivated(!isFilterDeactivated)}
        >
          Tous
        </button>
        {categories &&
          categories.map((category) => {
            return (
              <button
                key={category._id}
                id={category._id}
                className="filterBtn"
                style={{ backgroundColor: category.color }}
                onClick={handleFilter}
              >
                {category.name}
              </button>
            );
          })}
      </div>

      {foods &&
        foods.map((food) => {
          return (
            <FoodItem
              key={food._id}
              food={food}
              viewClbk
              editClbk
              deleteClbk={handleDelete}
            />
          );
        })}
    </div>
  );
};

export default Foods;
