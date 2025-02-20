import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import productReducer from './slices/productSlice';
import orderReducer from './slices/orderSlice';

export const rootReducer = combineReducers({
  users: userReducer,
  products: productReducer,
  orders: orderReducer
});