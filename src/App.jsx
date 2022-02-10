import { Routes, Route } from 'react-router-dom';

import NavMain from './components/Nav/NavMain';
import Home from './pages/Home';

import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import PrivateRoute from './components/ProtectedRoute/PrivateRoute';

import Foods from './pages/Foods';
import OneFood from './pages/OneFood';
import OneFoodForm from './components/Forms/OneFoodForm';
import EditFoodForm from './components/Forms/EditFoodForm';

import Meals from './pages/Meals';
import CreateMealForm from './components/Forms/CreateMealForm';
import EditMealForm from './components/Forms/EditMealForm';

function App() {
  return (
    <div className="App">
      <NavMain />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        {/* <Route path="/meals/meal/:id" element={<OneMeal />} /> */}
        {/* <Route path="/meals/:date" element={<Meals />} /> */}
        <Route element={<PrivateRoute />}>
          <Route path="/meals" element={<Meals />} />
          <Route path="/meals/:date" element={<Meals />} />
          <Route
            path="/meals/meal/new/:mealDate"
            element={<CreateMealForm />}
          />
          <Route path="/meals/meal/edit/:mealId" element={<EditMealForm />} />
          <Route path="/foods" element={<Foods />} />
          <Route path="/foods/food/view/:id" element={<OneFood />} />
          <Route path="/foods/food/new" element={<OneFoodForm />} />
          <Route path="/foods/food/edit/:id" element={<EditFoodForm />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
