import { configureStore } from '@reduxjs/toolkit';  // npm install @reduxjs/toolkit
import countReducer from './count_reducer';

const store = configureStore({
  reducer: {
    count: countReducer
  }
});

export default store;
