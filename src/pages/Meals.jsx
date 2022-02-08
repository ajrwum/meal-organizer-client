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
    mondayDate = getMondayBeforeOrEqual(new Date());
  }

  const [meals, setMeals] = useState([]);

  useEffect(() => {
    apiHandler.get(`/meals/${mondayDate}`).then(({ data }) => {
      console.log('data :>> ', data);
      setMeals(data);
    });
  }, []);

  const mondayDateForDisplay = mondayDate.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const weekDates = getWeekDates(mondayDate);

  const navDays = getNavDates(mondayDate);

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
        {weekDates &&
          weekDates.map((dayDate, index) => {
            return <Day key={index} dayDate={dayDate} />;
          })}
      </div>
    </div>
  );
};

export default Meals;
