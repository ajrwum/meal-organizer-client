import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiHandler from "../../api/apiHandler";
import "../../styles/Foods.css";

const OneFoodForm = ({ action }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(null);
  const [description, setDescription] = useState("");

  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    apiHandler.get("/foods/categories").then((response) => {
      console.log("response :>> ", response);
      setCategories(response.data);
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      name,
      category,
      description,
    };

    apiHandler
      .post("/foods/food", data)
      .then((response) => {
        console.log("response :>> ", response);
        navigate("/foods");
      })
      .catch((err) => console.error(err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="title">Créer un Aliment</h2>
      <div className="form-group">
        <label htmlFor="name">Nom :</label>
        <br />
        <input
          className="form-control"
          type="text"
          name="name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">Catégorie :</label>
        <br />
        <select
          className="form-control"
          name="category"
          id="category"
          // value={categories}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="-1" disabled selected>
            Selectionnez une catégorie
          </option>
          {categories &&
            categories.map((category) => {
              return (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              );
            })}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="description">Description :</label>
        <br />
        <textarea
          className="form-control"
          name="description"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          cols="70"
          rows="5"
        ></textarea>
      </div>
      <button className="submit-btn">Créer</button>
    </form>
  );
};

export default OneFoodForm;
