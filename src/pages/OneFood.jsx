import React, { useState, useEffect } from "react";
import apiHandler from "../api/apiHandler";
import { useParams, Link, useNavigate, NavLink } from "react-router-dom";
import "../styles/Foods.css";

const OneFood = () => {
  const [food, setFood] = useState({});
  const [foods, setFoods] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    apiHandler
      .get(`/foods/food/${id}`)
      .then((response) => {
        console.log("***response*** :>> ", response);
        setFood(response.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = (e) => {
    apiHandler.delete(`/foods/food/${e.target.id}`).then((response) => {
      setFoods(foods.filter((food) => food._id !== e.target.id));
      navigate("/foods");
    });
  };

  return (
    <>
      <div className="container">
        <div className="nameWrapper">
          <div className="nameLeft">
            <h2 className="foodName">{food?.name}</h2>
          </div>
          <div className="actionsBtn">
            <Link to={`/foods/food/edit/${id}`}>
              <i className="fa-solid fa-pencil"></i>
            </Link>

            <i
              id={id}
              className="fa-solid fa-trash-can"
              onClick={handleDelete}
            ></i>
          </div>
        </div>
        <div className="categoryWrapper">
          <div className="categoryLeft">
            <p>
              <b>Catégorie : </b>
            </p>
            <span>{food.category?.name}</span>
          </div>
          <div
            className="catColor"
            style={{ backgroundColor: food.category?.color }}
          ></div>
        </div>
        <div className="descriptionWrapper">
          <p>
            <b>Description :</b>
          </p>
          <p>{food.description}</p>
          <NavLink to="/foods" className="submit-btn">
            Retour
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default OneFood;
