import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiHandler from "../../api/apiHandler";

const EditFoodForm = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [categories, setCategories] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    apiHandler.get("/foods/categories").then((response) => {
      console.log("response :>> ", response);
      setCategories(response.data);
    });
  }, []);

  useEffect(() => {
    apiHandler.get(`/foods/food/${id}`).then((response) => {
      console.log("response :>>", response.data);
      setName(response.data.name);
      setCategory(response.data.category._id);
      setDescription(response.data.description);
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
      .patch(`/foods/food/${id}`, data)
      .then((response) => {
        console.log("response :>> ", response);
        navigate("/foods");
      })
      .catch((err) => console.error(err));
  };

  return (
    <form>
      <h2>Editer l'aliment</h2>
      <div className="form-group">
        <label htmlFor="name">Nom :</label>
        <br />
        <input
          type="text"
          name="name"
          id="name"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="name">Catégorie :</label>
        <br />
        <select
          name="category"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
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
        <label htmlFor="name">Description :</label>
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
      <button className="submit-btn" onClick={handleSubmit}>
        Mettre à jour
      </button>
    </form>
  );
};

export default EditFoodForm;
