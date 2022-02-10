import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiHandler from '../../api/apiHandler';

const Day = ({ dayDate, meals, deleteClbk }) => {
  console.log('--- Day');
  const navigate = useNavigate();

  console.log('dayDate :>> ', dayDate);
  console.log('dayDate.toISOString() :>> ', dayDate.toISOString());
  const dayDateForDisplay = dayDate.toLocaleDateString(undefined, {
    weekday: 'short',
    // year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  console.log('dayDateForDisplay :>> ', dayDateForDisplay);

  console.log('meals :>> ', meals);

  const handleAddMeal = (e) => {
    const mealDate = e.target.id;
    console.log('handleAddMeal - mealDate :>> ', mealDate);
    navigate(`/meals/meal/new/${mealDate}`);
  };

  return (
    <div className="day-container">
      <div className="day-title">
        <h4>{dayDateForDisplay}</h4>
        <i
          id={dayDate.toISOString()}
          className="fa-solid fa-plus"
          onClick={handleAddMeal}
        ></i>
      </div>
      <div className="day-meals">
        {meals &&
          meals.map((meal, i) => {
            return (
              <>
                <div key={meal._id} className="meal-card">
                  <div className="meal-card-title">
                    <div>{meal.type.name}</div>
                    <div className="meal-card-btn actionBtn">
                      <span>
                        <Link to={`/meals/meal/edit/${meal._id}`}>
                          <i className="fa-solid fa-pencil"></i>
                        </Link>
                      </span>
                      <span>
                        <i
                          id={meal._id}
                          className="fa-solid fa-trash-can"
                          onClick={deleteClbk}
                        ></i>
                      </span>
                    </div>
                  </div>
                  {meal.foods &&
                    meal.foods.map((food, j) => {
                      return (
                        // <div
                        //   key={`${food._id}_${i}_${j}`}
                        //   className="meal-food"
                        // >
                        //   <span>{food.name}</span>
                        // </div>
                        <div
                          key={`${food._id}_${i}_${j}`}
                          className="food-info"
                        >
                          <div
                            className="catColor"
                            style={{
                              backgroundColor: food.category?.color,
                            }}
                          ></div>
                          <span className="meal-food">{food.name}</span>
                        </div>
                      );
                    })}
                </div>
              </>
            );
          })}
      </div>
    </div>
  );
};

export default Day;
