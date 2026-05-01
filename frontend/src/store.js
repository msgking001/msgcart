import { combineReducers, configureStore } from "@reduxjs/toolkit";
import productsReducer from "./slices/productsSlice";

const reducer = combineReducers({
  productsState: productsReducer,
  // other reducers here
});

const store = configureStore({
  reducer,
  
});

export default store;