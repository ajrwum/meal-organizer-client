import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiHandler from '../api/apiHandler';
import {
  getMondayBeforeOrEqual,
  getWeekDates,
  getNavDates,
} from '../utils/date.utils';

import Day from './../components/Meal/Day';

const Meals = () => {
  console.log('--- Meals');

  let mondayDate;
  const params = useParams();
  if (params?.date) {
    console.log('params.date :>> ', params.date);
    mondayDate = getMondayBeforeOrEqual(params.date);
  } else {
    console.log('params :>> ', params);
    const today = new Date();
    console.log('today :>> ', today);
    mondayDate = getMondayBeforeOrEqual(today);
  }
  const navDays = getNavDates(mondayDate);
  const weekDates = getWeekDates(mondayDate);
  const mondayDateForDisplay = mondayDate.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  console.log('mondayDate :>> ', mondayDate);

  const [meals, setMeals] = useState([]);
  const [needReload, setNeedReload] = useState(false);

  useEffect(() => {
    console.log('===== Meals mounted, call to apiHandler');
    apiHandler.get(`/meals/${mondayDate.toISOString()}`).then(({ data }) => {
      console.log('*********************');
      console.log('*********************');
      console.log('*********************');
      console.log('*********************');
      console.log('*********************');
      console.log('dbMeals - data :>> ', data);
      // sorting meals depending on the type.position value
      data.forEach((dayMeals) =>
        dayMeals.sort((a, b) => a.type.position - b.type.position)
      );
      setMeals(data);
    });
  }, [params.date, needReload]);

  const handleDeleteMeal = (e) => {
    const mealId = e.target.id;
    console.log('handleDeleteMeal - mealId :>> ', mealId);
    apiHandler.delete(`/meals/meal/${mealId}`).then((response) => {
      console.log('response.data :>> ', response.data);
      setMeals(meals.filter((meal) => meal._id !== mealId));
      setNeedReload(!needReload);
    });
  };

  return (
    <div>
      <h2>Semaine du {mondayDateForDisplay}</h2>
      <div className="meal-week-nav">
        <Link to={`/meals/${navDays.previous.toISOString()}`}>
          Semaine précédente
        </Link>
        <Link to={`/meals/${navDays.next.toISOString()}`}>
          Semaine suivante
        </Link>
      </div>
      <div className="meal-week">
        {meals &&
          weekDates.map((dayDate, index) => {
            return (
              <Day
                key={index}
                dayDate={dayDate}
                meals={meals[index]}
                deleteClbk={handleDeleteMeal}
              />
            );
          })}
      </div>
    </div>
  );
};

export default Meals;
