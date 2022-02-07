import React, { useState } from "react";
import { Link } from "react-router-dom";
import apiHandler from "../api/apiHandler";
import NavMain from "../components/Nav/NavMain";

const Foods = () => {
  const { foods, setFoods } = useState([]);

  useEffect(() => {
    apiHandler.get("/foods").then(({ data }) => {
      console.log("foods - apiRes.data >>>", data);
      setFoods(data);
    });
  }, [foods, setFoods]);

  return (
    <div className="container">
      <NavMain />
      <h2>Tous mes Aliments</h2>
      {foods.map((food) => {
        return (
          <div className="box">
            <div className="catColor"></div>
            <span className="food">{food.name}</span>
            <div className="actionBtn">
              <span>
                <i className="fa-solid fa-eye">
                  <Link to="/foods/food"></Link>
                </i>
              </span>
              <span>
                <i className="fa-solid fa-pencil">
                  <Link to="/foods/:id"></Link>
                </i>
              </span>
              <span>
                <i className="fa-solid fa-trash-can" onClick={handleDelete}></i>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Foods;
