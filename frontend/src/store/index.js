import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';

// Configure the Redux store
const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
  },
  // Add middleware here if needed
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore certain action types that may contain non-serializable data
        ignoredActions: [
          'products/fetchProducts/fulfilled',
          'products/fetchProductById/fulfilled',
          'cart/addToCart/fulfilled',
        ],
      },
    }),
});

export default store; 