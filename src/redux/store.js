import { configureStore } from '@reduxjs/toolkit';  // npm install @reduxjs/toolkit
import countReducer from './reducers/count';

import personReducer from './reducers/person';


const store = configureStore({
  reducer: {
    count: countReducer,
    addP:personReducer
  }
});

export default store;
