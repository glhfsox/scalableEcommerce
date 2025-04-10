import { AuthState } from '../types';
import { ProductState } from '../types';
import { CartState } from '../types';

export interface RootState {
  auth: AuthState;
  products: ProductState;
  cart: CartState;
} 