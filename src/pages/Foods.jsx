import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiHandler from "../api/apiHandler";
import FoodItem from "../components/Food/FoodItem";
import "../styles/Foods.css";

const Foods = () => {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    console.log("component mounted");
    apiHandler.get("/foods").then(({ data }) => {
      console.log("foods - apiRes.data >>>", data);
      setFoods(data);
    });
  }, []);

  const handleDelete = (e) => {
    apiHandler.delete(`/foods/food/${e.target.id}`).then((response) => {
      setFoods(foods.filter((food) => food._id !== e.target.id));
    });
  };

  return (
    <div className="container">
      <h2>
        Tous mes Aliments{" "}
        <span className="addFood">
          <Link to="/foods/food/new">
            <i className="fa-solid fa-plus"></i>
          </Link>
        </span>
      </h2>

      {foods &&
        foods.map((food) => {
          return (
            <>
              <FoodItem
                key={food._id}
                food={food}
                viewClbk
                editClbk
                deleteClbk={handleDelete}
              />
            </>
          );
        })}
    </div>
  );
};

export default Foods;
