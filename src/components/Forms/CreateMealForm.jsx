import React, { useState, useEffect } from 'react';
import apiHandler from '../../api/apiHandler';

const CreateMealForm = ({ mealDate }) => {
  console.log('--- CreateMealForm - mealDate :>> ', mealDate);
  // reference list of meal types
  const [mealTypes, setMealTypes] = useState([]);
  // reference food list for the drag part
  const [dbFoods, setDbFoods] = useState([]);
  // states for the drop part, aka, the meal
  const [type, setType] = useState('');
  const [foods, setFoods] = useState([]);
  const [date, setDate] = useState('');
  const [user, setUser] = useState('');
  // state for the added foo after drop
  const [addedFoods, setAddedFoods] = useState([]);

  useEffect(() => {
    apiHandler.get('/meals/mealtypes').then(({ data }) => {
      console.log('mealtypes - apiRes.data :>> ', data);
      setMealTypes(data);
    });
  }, []);

  useEffect(() => {
    apiHandler.get('/foods').then(({ data }) => {
      console.log('dbFoods - apiRes.data :>> ', data);
      setDbFoods(data);
    });
  }, [addedFoods]);

  const handleDragStart = (e) => {
    // e.preventDefault();
    console.log('--- handleDragStart - e.target :>> ', e.target);
    console.log('dragOver: dropEffect = ', e.dataTransfer.dropEffect);
    console.log('dragOver: effectAllowed = ', e.dataTransfer.effectAllowed);

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
    e.target.parentElement.classList.toggle('over');
    console.log('dragOver: dropEffect = ', e.dataTransfer.dropEffect);
    console.log('dragOver: effectAllowed = ', e.dataTransfer.effectAllowed);

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
    // e.target.appendChild(document.getElementById(foodId));
    const cloneText = document.getElementById(foodId).innerHTML;
    const clone = document.getElementById(foodId).cloneNode();
    clone.innerHTML = cloneText;
    console.log('clone :>> ', clone);
    e.target.appendChild(clone);
    setFoods([...foods, foodId]);
    setAddedFoods([...addedFoods, { _id: foodId, name: cloneText }]);
    return false;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('--- handleSubmit - e.target :>> ', e.target);
    setDate(mealDate);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Création de repas</h2>

      <div className="form-content-div">
        <div>
          <label htmlFor="type">Type de repas :</label>
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
          <div className="drop-div">
            <div>
              <label htmlFor="foods">Aliments :</label>
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
                <div key="-1">Déposer ici les aliments souhaités</div>
                {/* {addedFoods &&
                  addedFoods.map((addedFood) => {
                    return (
                      <div key={`added_${addedFood._id}`} value={addedFood._id}>
                        {addedFood.name} - mapped after addedFoods
                      </div>
                    );
                  })} */}
              </div>
            </div>
          </div>

          <div className="drag-div">
            <h2>Aliments :</h2>
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
        </div>
      </div>
    </form>
  );
};

export default CreateMealForm;
