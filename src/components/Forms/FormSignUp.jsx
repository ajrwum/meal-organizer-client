import useForm from "../../hooks/useForm";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiHandler from "../../api/apiHandler";
import "../../styles/SignInUp.css";

const FormSignUp = () => {
  const [values, handleChange] = useForm({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    apiHandler
      .signup(values)
      .then(() => {
        navigate("/signin");
      })
      .catch((error) => {
        setError(error.response.data);
      });
  };
  return (
    <>
      {error && <h3 className="error">{error.message}</h3>}
      <form onSubmit={handleSubmit}>
        <h2 className="title">S'inscrire</h2>
        <div className="form-group">
          <label htmlFor="name">Nom :</label>
          <br />
          <input
            className="form-control"
            onChange={handleChange}
            value={values.name}
            type="text"
            id="name"
            name="name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email :</label>
          <br />
          <input
            className="form-control"
            onChange={handleChange}
            value={values.email}
            type="email"
            id="email"
            name="email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe :</label>
          <br />
          <input
            className="form-control"
            onChange={handleChange}
            value={values.password}
            type="password"
            id="password"
            name="password"
          />
        </div>
        <button className="signUpBtn">S'inscrire</button>
      </form>
    </>
  );
};

export default FormSignUp;
