import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiHandler from '../../api/apiHandler';
import UserContext from '../../auth/UserContext';
import useDeviceDetection from '../../hooks/useDeviceDetection'; // custom hook
import FoodCategoryFilter from '../Food/FoodCategoryFilter';
import ResetCategoryFilter from '../Food/ResetCategoryFilter';

import './../../styles/meals.css';

const CreateMealForm = () => {
  const { mealDate } = useParams();
  // console.log('--- CreateMealForm - mealDate :>> ', mealDate);

  // testing the device (mobile or not)
  const deviceType = useDeviceDetection();
  // console.log('>>>>>>> useDeviceDetection - deviceType :>> ', deviceType);

  // reference lists from db
  const [mealTypes, setMealTypes] = useState([]);
  const [dbFoods, setDbFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isFilterDeactivated, setIsFilterDeactivated] = useState(false);

  // states for the meal form
  const [type, setType] = useState('');
  const [foods, setFoods] = useState([]);
  const [date, setDate] = useState(new Date(mealDate.slice(0, 10)));
  // state for the added food(s) after drag & drop
  const [addedFoods, setAddedFoods] = useState([]);
  // state for message to display in cadse of unexpected action
  const [msg, setMsg] = useState(null);

  const navigate = useNavigate();

  // easy way to get the user id for the request to db
  const userContext = useContext(UserContext);
  const { currentUser } = userContext;
  // console.log('currentUser :>> ', currentUser.currentUser._id);

  // display the date for easy reading (locale used but not forced to any language)
  const mealDateForDisplay = date.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  // console.log('mealDateForDisplay :>> ', mealDateForDisplay);

  // getting the reference list of meal types for the select
  useEffect(() => {
    apiHandler.get('/meals/mealtypes').then(({ data }) => {
      // console.log('mealtypes - apiRes.data :>> ', data);
      setMealTypes(data);
    });
  }, []);

  // getting the user's reference list of foods
  useEffect(() => {
    apiHandler.get('/foods').then(({ data }) => {
      // console.log('dbFoods - apiRes.data :>> ', data);
      setDbFoods(data);
    });
  }, [foods, addedFoods, isFilterDeactivated]);

  // getting all food categories to allow filtering on it
  useEffect(() => {
    apiHandler.get('/foods/categories').then(({ data }) => {
      console.log('data :>> ', data);
      setCategories(data);
    });
  }, []);

  // providing filters on food categories to ease the search for foods to add to meal
  const handleFilter = (e) => {
    console.log('--- handleFilter');
    // to prevent the post of the whole form prematurely
    e.preventDefault();
    // getting foods matching the chosen category
    apiHandler.get(`/foods/${e.target.id}`).then(({ data }) => {
      console.log('filtered dbFoods ', data);
      setDbFoods(data);
    });
  };

  const handleResetFilter = (e) => {
    console.log('--- handleResetFilter');
    // to prevent the post of the whole form prematurely
    e.preventDefault();
    // forcing the reset of dbFoods
    setIsFilterDeactivated(!isFilterDeactivated);
  };

  // browser only (no touch event support)
  const handleDragStart = (e) => {
    // console.log('--- handleDragStart - e.target :>> ', e.target);
    // console.log('dragStart: dropEffect = ', e.dataTransfer.dropEffect);
    // console.log('dragStart: effectAllowed = ', e.dataTransfer.effectAllowed);

    e.dataTransfer.setData('id', e.target.id);
    e.dataTransfer.effectAllowed = 'copy';
  };

  // browser only (no touch event support)
  const handleDragOver = (e) => {
    // console.log('--- handleDragOver - e.target :>> ', e.target);
    // console.log('dragOver: dropEffect = ', e.dataTransfer.dropEffect);
    // console.log('dragOver: effectAllowed = ', e.dataTransfer.effectAllowed);

    // e.preventDefault();
    if (e.preventDefault) {
      e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'copy';
    return false;
  };

  // browser only (no touch event support)
  const handleDrop = (e) => {
    // console.log('--- handleDrop - e.target :>> ', e.target);
    // reset message for new drop
    setMsg(null);
    e.target.parentElement.classList.toggle('over');
    // console.log('drop: dropEffect = ', e.dataTransfer.dropEffect);
    // console.log('drop: effectAllowed = ', e.dataTransfer.effectAllowed);

    // console.log('foods :>> ', foods);
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    const foodId = e.dataTransfer.getData('id');
    e.dataTransfer.dropEffect = 'copy';
    // console.log('foodId :>> ', foodId);
    // console.log(
    //   'document.getElementById(foodId) :>> ',
    //   document.getElementById(foodId)
    // );
    if (!foods.includes(foodId)) {
      setFoods([...foods, foodId]);
      apiHandler.get(`/foods/food/${foodId}`).then(({ data }) => {
        setAddedFoods([...addedFoods, data]);
      });
    } else {
      setMsg({ type: 'warning', text: 'Cet aliment a d??j?? ??t?? ajout??' });
    }
    return false;
  };

  const handleAddByClick = (e) => {
    // console.log('--- handleAddByClick - e.target :>> ', e.target);
    e.preventDefault();

    // reset message for new add
    setMsg(null);

    const foodId = e.target.id;

    // prevent duplicate add
    if (!foods.includes(foodId)) {
      setFoods([...foods, foodId]);
      apiHandler.get(`/foods/food/${foodId}`).then(({ data }) => {
        setAddedFoods([...addedFoods, data]);
      });
    } else {
      setMsg({ type: 'warning', text: 'Cet aliment a d??j?? ??t?? ajout??' });
    }
    return false;
  };

  const handleDeleteFoodFromMeal = (e) => {
    // console.log('--- handleDeleteFoodFromMeal');
    // prevent action on button to submit the meal form
    e.preventDefault();
    // console.log('parentElement :>> ', e.target.parentElement);
    // console.log('parentElement.id :>> ', e.target.parentElement.id);

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
    // console.log('--- handleSubmit - e.target :>> ', e.target);
    e.preventDefault();

    // set the meal object
    const meal = {
      type: type,
      foods: foods,
      user: currentUser.currentUser._id,
      date: date,
    };
    // console.log('meal :>> ', meal);

    // call the apiHandler to get to the server
    apiHandler
      .post('/meals/meal', meal)
      .then((response) => {
        // console.log('response :>> ', response);
        navigate(`/meals/${mealDate}`);
      })
      .catch((e) => {
        console.error(e);
        setMsg({
          type: 'error',
          text: 'Erreur, veuillez v??rifier le repas et r??essayer.',
        });
      });
  };

  return (
    <form className="meal-form create" onSubmit={handleSubmit}>
      <h2>Cr??ation de repas</h2>

      {msg && (
        <div className={`msg ${msg.type}`}>
          <span>{msg.text}</span>
        </div>
      )}

      <div className="form-content-div">
        <div className="meal-date">
          <label htmlFor="date">Date : </label>
          <span>{mealDateForDisplay}</span>
        </div>
        <div
          className={deviceType === 'mobile' ? 'meal-type mobile' : 'meal-type'}
        >
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
                  <option key={mealType._id} value={mealType._id}>
                    {mealType.name} - {mealType.timeslot}
                  </option>
                );
              })}
          </select>
        </div>

        <div className="dnd-action-div">
          <div className="meal-drag-div">
            <h3>Tous les aliments :</h3>
            <div className="ref-food-filters">
              <div className="filter-intro">
                <span>Afficher : </span>
              </div>
              <ResetCategoryFilter
                label="Tous"
                cssClass="allFoodBtn"
                actionClbk={handleResetFilter}
              />
              {categories &&
                categories.map((category) => {
                  return (
                    <FoodCategoryFilter
                      category={category}
                      cssClass="filterBtn"
                      actionClbk={handleFilter}
                    />
                  );
                })}
            </div>

            <div className="ref-food-list">
              {deviceType === 'mobile'
                ? dbFoods &&
                  dbFoods.map((dbFood) => {
                    return (
                      <div
                        key={dbFood._id}
                        value={dbFood._id}
                        className="draggable-food meal-food mobile"
                        // draggable="true"
                      >
                        <div className="food-info">
                          <div
                            className="catColor"
                            style={{ backgroundColor: dbFood.category?.color }}
                          ></div>
                          <span className="food-name">{dbFood.name}</span>
                        </div>
                        <button
                          id={dbFood._id}
                          className="actionBtn"
                          onClick={handleAddByClick}
                        >
                          Ajouter
                        </button>
                      </div>
                    );
                  })
                : dbFoods &&
                  dbFoods.map((dbFood) => {
                    return (
                      <div
                        key={dbFood._id}
                        id={dbFood._id}
                        value={dbFood._id}
                        className="draggable-food meal-food"
                        draggable="true"
                        onDragStart={handleDragStart}
                      >
                        <div
                          className="catColor"
                          style={{ backgroundColor: dbFood.category?.color }}
                        ></div>
                        <span className="food-name">{dbFood.name}</span>
                      </div>
                    );
                  })}
            </div>
          </div>

          <div className="meal-drop-div">
            <div>
              <label htmlFor="foods">Aliments du repas : </label>
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
                <div key="-1" id="drop-target1">
                  <span>
                    D??poser ici les aliments souhait??s depuis la liste{' '}
                    {deviceType === 'mobile' ? 'ci-dessous' : 'ci-contre'} :
                  </span>
                </div>
                {addedFoods &&
                  addedFoods.map((addedFood) => {
                    return (
                      <div
                        key={`added_${addedFood._id}`}
                        id={`added_${addedFood._id}`}
                        value={addedFood._id}
                        className="added-food meal-food"
                      >
                        <div className="food-info">
                          <div
                            className="catColor"
                            style={{
                              backgroundColor: addedFood.category?.color,
                            }}
                          ></div>
                          <span className="food-name">{addedFood.name}</span>
                        </div>
                        <button
                          className="actionBtn"
                          onClick={handleDeleteFoodFromMeal}
                        >
                          Retirer
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>
            <button className="submit-btn">Ok</button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreateMealForm;
