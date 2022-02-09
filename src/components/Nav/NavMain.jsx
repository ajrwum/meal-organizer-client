import { NavLink } from 'react-router-dom';
import useAuth from '../../auth/useAuth';
import '../../styles/NavMain.css';

const NavMain = () => {
  const { isLoggedIn, currentUser, removeUser } = useAuth();
  const today = new Date();
  return (
    <nav className="NavMain">
      <NavLink className="logo" to="/">
        MO
      </NavLink>
      {isLoggedIn && (
        <>
          <NavLink to="/profile">{currentUser && currentUser.email}</NavLink>
          <NavLink to={`/meals/${today.toISOString()}`}>
            Mes repas de la semaine
          </NavLink>
          <NavLink to="/meals/meal/new">Créer un Repas</NavLink> // dev mode
          <NavLink to="/foods">Mes Aliments</NavLink>
          <button onClick={removeUser}>Déconnexion</button>
        </>
      )}
      {!isLoggedIn && (
        <>
          <NavLink to="/signin">Connexion</NavLink>
          <NavLink to="/signup">Inscription</NavLink>
        </>
      )}
    </nav>
  );
};

export default NavMain;
