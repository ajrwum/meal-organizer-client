import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiHandler from '../../api/apiHandler';
import UserContext from '../../auth/UserContext';

import './../../styles/meals.css';

const EditMealForm = () => {
  const { mealId } = useParams();
  console.log('--- EditMealForm - mealId :>> ', mealId);

  // reference lists from db
  const [mealTypes, setMealTypes] = useState([]);
  const [dbFoods, setDbFoods] = useState([]);
  console.log('dbFoods[0] :>> ', dbFoods[0]);

  // states for the meal form
  const [type, setType] = useState('');
  const [foods, setFoods] = useState([]);
  const [date, setDate] = useState(null);
  const [dateTemp, setDateTemp] = useState('');
  // state for the added food(s) after drag & drop
  const [addedFoods, setAddedFoods] = useState([]);

  // state for message to display in cadse of unexpected action
  const [msg, setMsg] = useState(null);

  const navigate = useNavigate();

  const userContext = useContext(UserContext);
  const { currentUser } = userContext;
  console.log('currentUser :>> ', currentUser.currentUser._id);

  // const mealDateForDisplay = dateTemp;
  const mealDateForDisplay = new Date(dateTemp).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  console.log('mealDateForDisplay :>> ', mealDateForDisplay);
  console.log('******** dateTemp :>> ', dateTemp);

  // getting current values for the meal to edit
  useEffect(() => {
    apiHandler.get(`/meals/meal/${mealId}`).then(({ data }) => {
      console.log('============');
      console.log('MEAL TO EDIT - data :>> ', data);
      console.log('data.date :>> ', data.date);
      console.log('type Date ???', data.date instanceof Date);
      console.log('typeof ???', typeof data.date);
      setType(data.type._id);
      setDate(new Date(data.date.slice(0, 10)));
      setDateTemp(data.date.slice(0, 10));
      const foodIdsArray = data.foods ? data.foods.map((food) => food._id) : [];
      console.log('foodIdsArray :>> ', foodIdsArray);
      setFoods(foodIdsArray);
      setAddedFoods(data.foods);
    });
  }, []);

  // getting meal types for the select input
  useEffect(() => {
    apiHandler.get('/meals/mealtypes').then(({ data }) => {
      console.log('mealtypes - apiRes.data :>> ', data);
      setMealTypes(data);
    });
  }, []);

  // getting all available foods for the reference foods' list
  useEffect(() => {
    apiHandler.get('/foods').then(({ data }) => {
      console.log('dbFoods - apiRes.data :>> ', data);
      setDbFoods(data);
    });
  }, [foods, addedFoods]);

  const handleDragStart = (e) => {
    // e.preventDefault();
    console.log('--- handleDragStart - e.target :>> ', e.target);
    console.log('dragStart: dropEffect = ', e.dataTransfer.dropEffect);
    console.log('dragStart: effectAllowed = ', e.dataTransfer.effectAllowed);

    e.dataTransfer.setData('id', e.target.id);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e) => {
    // console.log('--- handleDragOver - e.target :>> ', e.target);
    console.log('dragOver: dropEffect = ', e.dataTransfer.dropEffect);
    console.log('dragOver: effectAllowed = ', e.dataTransfer.effectAllowed);

    // e.preventDefault();
    if (e.preventDefault) {
      e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'copy';
    return false;
  };

  const handleDrop = (e) => {
    console.log('--- handleDrop - e.target :>> ', e.target);
    // reset message for new drop
    setMsg(null);
    e.target.parentElement.classList.toggle('over');
    console.log('drop: dropEffect = ', e.dataTransfer.dropEffect);
    console.log('drop: effectAllowed = ', e.dataTransfer.effectAllowed);

    console.log('foods :>> ', foods);
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    const foodId = e.dataTransfer.getData('id');
    e.dataTransfer.dropEffect = 'copy';
    console.log('foodId :>> ', foodId);
    console.log(
      'document.getElementById(foodId) :>> ',
      document.getElementById(foodId)
    );
    if (!foods.includes(foodId)) {
      // e.target.appendChild(document.getElementById(foodId));
      const foodName = document.getElementById(foodId).innerHTML;
      // const clone = document.getElementById(foodId).cloneNode();
      // clone.innerHTML = foodName;
      // console.log('clone :>> ', clone);
      // e.target.appendChild(clone);
      setFoods([...foods, foodId]);
      apiHandler.get(`/foods/food/${foodId}`).then(({ data }) => {
        setAddedFoods([...addedFoods, data]);
      });
    } else {
      setMsg({ type: 'warn', text: 'Cet aliment a déjà été ajouté' });
    }
    return false;
  };

  const handleDeleteFoodFromMeal = (e) => {
    console.log('--- handleDeleteFoodFromMeal');
    // prevent action on button to submit the meal form
    e.preventDefault();
    // console.log('parentElement :>> ', e.target.parentElement);
    // console.log('parentElement.id :>> ', e.target.parentElement.id);
    console.log('addedFoods :>> ', addedFoods);

    // get the foodId to remove from meal
    const foodId = e.target.parentElement.id.split('_')[1];

    // remove food from meal and related states
    const tmpFoods = foods.filter((food) => food != foodId);
    setFoods(tmpFoods);
    const tmpAddedFoods = addedFoods.filter(
      (addedFood) => addedFood._id != foodId
    );
    setAddedFoods(tmpAddedFoods);
  };

  const handleSubmit = (e) => {
    console.log('--- handleSubmit - e.target :>> ', e.target);
    e.preventDefault();

    // set the meal object
    const meal = {
      type: type,
      foods: foods,
      user: currentUser.currentUser._id,
      date: new Date(dateTemp),
    };
    console.log('meal :>> ', meal);

    // call the apiHandler to get to the server
    apiHandler
      .patch(`/meals/meal/${mealId}`, meal)
      .then((response) => {
        console.log('response :>> ', response);
        navigate(`/meals/${new Date(date).toISOString()}`);
      })
      .catch((e) => {
        console.error(e);
        setMsg({
          type: 'error',
          text: 'Erreur, veuillez vérifier le repas et réessayer.',
        });
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Modification de repas</h2>

      {msg && (
        <div className={`msg ${msg.type}`}>
          <span>{msg.text}</span>
        </div>
      )}

      <div className="form-content-div">
        <div className="meal-date">
          <label htmlFor="date">Date : </label>
          {/* <span>{mealDateForDisplay}</span> */}
          <input
            type="date"
            name="date"
            id="date"
            value={dateTemp}
            onChange={(e) => setDateTemp(e.target.value)}
          />
        </div>
        <div className="meal-type">
          <label htmlFor="type">Type de repas : </label>
          <select
            name="type"
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            {mealTypes &&
              mealTypes.map((mealType) => {
                return (
                  <option
                    key={mealType._id}
                    value={mealType._id}
                    // selected={mealType._id === type?._id}
                  >
                    {mealType.name} - {mealType.timeslot}
                  </option>
                );
              })}
          </select>
        </div>

        <div className="dnd-action-div">
          <div className="meal-drag-div">
            <h3>Tous les aliments :</h3>
            <div>
              {dbFoods &&
                dbFoods.map((dbFood) => {
                  return (
                    <div
                      key={dbFood._id}
                      id={dbFood._id}
                      value={dbFood._id}
                      className="draggable-food"
                      draggable="true"
                      onDragStart={handleDragStart}
                    >
                      {dbFood.name}
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="meal-drop-div">
            <div>
              <h3>Aliments du repas :</h3>
              {/* <label htmlFor="foods">Aliments du repas : </label> */}
              <div
                name="foods"
                id="foods"
                value={foods}
                className="drop-zone"
                droppable="true"
                onDragEnter={(e) =>
                  e.target.parentElement.classList.toggle('over')
                }
                onDragLeave={(e) =>
                  e.target.parentElement.classList.toggle('over')
                }
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div key="-1">Déposer ici les aliments souhaités :</div>
                {addedFoods &&
                  addedFoods.map((addedFood) => {
                    return (
                      <div
                        key={`added_${addedFood._id}`}
                        id={`added_${addedFood._id}`}
                        value={addedFood._id}
                        className="added-food"
                      >
                        <span>{addedFood.name}</span>
                        <button onClick={handleDeleteFoodFromMeal}>
                          Supprimer
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <button>Ok</button>
    </form>
  );
};

export default EditMealForm;
