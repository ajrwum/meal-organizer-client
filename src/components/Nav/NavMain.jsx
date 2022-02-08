import { NavLink } from "react-router-dom";
import useAuth from "../../auth/useAuth";
import "../../styles/NavMain.css";

const NavMain = () => {
  const { isLoggedIn, currentUser, removeUser } = useAuth();
  return (
    <nav className="NavMain">
      <NavLink className="logo" to="/">
        MO
      </NavLink>
      {isLoggedIn && (
        <>
          <NavLink to="/profile">{currentUser && currentUser.email}</NavLink>
          <NavLink to="/meals">Mes repas de la semaine</NavLink>
          <NavLink to="/meals/meal/new">Créer un Repas</NavLink>
          <NavLink to="/foods">Mes Aliments</NavLink>
          <div className="navLogout">
            <button onClick={removeUser}>Déconnexion</button>
          </div>
        </>
      )}
      {!isLoggedIn && (
        <>
          <div className="navActions">
            <NavLink to="/signin">Connexion</NavLink>
            <NavLink to="/signup">Inscription</NavLink>
          </div>
        </>
      )}
    </nav>
  );
};

export default NavMain;
