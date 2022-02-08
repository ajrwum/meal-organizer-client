import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiHandler from "../api/apiHandler";
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
                  <Link to={`/foods/food/edit/${food._id}`} action={"edit"}>
                    <i className="fa-solid fa-pencil"></i>
                  </Link>
                </span>
                <span>
                  <i
                    id={food._id}
                    className="fa-solid fa-trash-can"
                    onClick={handleDelete}
                  ></i>
                </span>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Foods;
