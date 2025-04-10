import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Async thunks for API calls
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      if (!auth.token) {
        // If not authenticated, get cart from localStorage
        const localCart = JSON.parse(localStorage.getItem('cart')) || { items: [] };
        return localCart;
      }

      // Otherwise, get cart from API
      const response = await axios.get(`${API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch cart'
      );
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity = 1 }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      if (!auth.token) {
        // If not authenticated, handle cart locally
        const { products } = getState().products;
        const product = products.find(p => p.id === productId);
        
        if (!product) {
          throw new Error('Product not found');
        }
        
        // Get current cart from localStorage
        const localCart = JSON.parse(localStorage.getItem('cart')) || { items: [] };
        
        // Check if product is already in cart
        const existingItem = localCart.items.find(item => item.product.id === productId);
        
        if (existingItem) {
          // Update quantity if product already exists
          existingItem.quantity += quantity;
        } else {
          // Add new item to cart
          localCart.items.push({
            product,
            quantity,
          });
        }
        
        // Save updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(localCart));
        
        return localCart;
      }

      // Otherwise, add to cart via API
      const response = await axios.post(
        `${API_URL}/cart/items`,
        { productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add item to cart'
      );
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ productId, quantity }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      if (!auth.token) {
        // If not authenticated, handle cart locally
        // Get current cart from localStorage
        const localCart = JSON.parse(localStorage.getItem('cart')) || { items: [] };
        
        // Find and update item
        const existingItem = localCart.items.find(item => item.product.id === productId);
        
        if (existingItem) {
          existingItem.quantity = quantity;
        }
        
        // Save updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(localCart));
        
        return localCart;
      }

      // Otherwise, update cart via API
      const response = await axios.put(
        `${API_URL}/cart/items/${productId}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update cart item'
      );
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      if (!auth.token) {
        // If not authenticated, handle cart locally
        // Get current cart from localStorage
        const localCart = JSON.parse(localStorage.getItem('cart')) || { items: [] };
        
        // Remove item from cart
        localCart.items = localCart.items.filter(item => item.product.id !== productId);
        
        // Save updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(localCart));
        
        return localCart;
      }

      // Otherwise, remove from cart via API
      const response = await axios.delete(
        `${API_URL}/cart/items/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to remove item from cart'
      );
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      if (!auth.token) {
        // If not authenticated, handle cart locally
        // Clear cart in localStorage
        localStorage.setItem('cart', JSON.stringify({ items: [] }));
        
        return { items: [] };
      }

      // Otherwise, clear cart via API
      const response = await axios.delete(
        `${API_URL}/cart`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to clear cart'
      );
    }
  }
);

// Initial state
const initialState = {
  items: [],
  loading: false,
  error: null,
};

// Create slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Simple actions for direct state manipulation
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.product.id === productId);
      if (item) {
        item.quantity = quantity;
      }
    },
    removeItem: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.product.id !== productId);
    },
    clearItems: (state) => {
      state.items = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchCart reducers
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    
    // addToCart reducers
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    
    // updateCartItem reducers
    builder
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    
    // removeFromCart reducers
    builder
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    
    // clearCart reducers
    builder
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  updateQuantity,
  removeItem,
  clearItems,
  clearError,
} = cartSlice.actions;

export default cartSlice.reducer; 