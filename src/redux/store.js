import { configureStore } from '@reduxjs/toolkit';  // npm install @reduxjs/toolkit
import countReducer from './reducers/count';

const store = configureStore({
  reducer: {
    count: countReducer
  }
});

export default store;
