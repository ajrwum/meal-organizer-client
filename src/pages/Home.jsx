import React from 'react';
import useDeviceDetection from '../hooks/useDeviceDetection';

import weekView from '../assets/img/mo-0-semaine.png';
import weekViewMobile from '../assets/img/mo-0-semaine-mobile.png';
import foodCategories from '../assets/img/mo-1-categories-aliment.png';
import foodsList from '../assets/img/mo-2-liste-aliments.png';

import '../styles/home.css';

const Home = () => {
  const deviceType = useDeviceDetection();

  return (
    <div className="home-page">
      <h1>Adoptez MO !</h1>

      <div className="home-block">
        <div className="text">
          <p className="mo">« Meal Organizer »</p>
          <p>Avec MO, planifiez vos repas des semaines à venir</p>
        </div>
        <div className="img">
          {deviceType === 'mobile' ? (
            <img src={weekViewMobile} alt="Semaine planifiée de repas" />
          ) : (
            <img src={weekView} alt="Semaine planifiée de repas" />
          )}
        </div>
      </div>

      <div className="home-block">
        <div className="text">
          <p>Vous pouvez créer les aliments de votre quotidien.</p>
          <p>Ils sont associés à une catégorie reconnaissable à sa couleur.</p>
        </div>
        <div className="img">
          <img
            className="duo"
            src={foodCategories}
            alt="Création d'alimment - Catégories des aliments"
          />
          <img
            className="duo"
            src={foodsList}
            alt="Création d'alimment - Catégories des aliments"
          />
        </div>
      </div>

      <div className="home-block">
        <div className="text">
          <p>Une fois vos aliments créés, composez vos repas jour par jour.</p>
          <p>À chaque heure du jour son repas.</p>
          <p>MO s'adapte à votre rythme de vie.</p>
        </div>
        <div className="img">
          {/* <img src="" alt="Création de repas - Types de repas" /> */}
        </div>
      </div>
    </div>
  );
};

export default Home;
