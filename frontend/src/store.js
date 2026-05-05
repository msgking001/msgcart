import { combineReducers, configureStore } from "@reduxjs/toolkit";
import productsReducer from "./slices/productsSlice";
import productReducer  from "./slices/productSlice";
const reducer = combineReducers({
  productsState: productsReducer,
  productState:productReducer
  // other reducers here
});

const store = configureStore({
  reducer,
  
});

export default store;