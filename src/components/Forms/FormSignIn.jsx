import React, { useState } from "react";
import useForm from "../../hooks/useForm";
import apiHandler from "../../api/apiHandler";
import useAuth from "../../auth/useAuth";
import { useNavigate } from "react-router-dom";
import "../../styles/SignInUp.css";

const FormSignIn = () => {
  const [{ email, password }, handleChange] = useForm({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { authenticateUser } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    apiHandler
      .signin({ email, password })
      .then((res) => {
        console.log(res);
        authenticateUser();
        navigate("/");
      })
      .catch((e) => {
        setError(e.response.data);
      });
  };

  return (
    <>
      {error && <h3 className="error">{error.message}</h3>}
      <form onSubmit={handleSubmit}>
        <h2 className="title">Connexion</h2>
        <div className="form-group">
          <label htmlFor="email">Email :</label>
          <br />
          <input
            className="form-control"
            type="email"
            id="email"
            name="email"
            onChange={handleChange}
            value={email}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe :</label>
          <br />
          <input
            className="form-control"
            type="password"
            id="password"
            name="password"
            onChange={handleChange}
            value={password}
          />
        </div>
        <button className="signInBtn">Connexion</button>
      </form>
    </>
  );
};

export default FormSignIn;
