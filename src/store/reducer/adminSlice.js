import { createSlice } from '@reduxjs/toolkit';
import {
  fetchAllUser, createNewUser, updatedUser, deletedUser, fetchAllBrand, createNewBrand, updatedBrand, deletedBrand,
  fetchAllCategory, createNewCategory, updatedCategory, deletedCategory, fetchAllType, createNewType, updatedType, deletedType,
  fetchAllProduct, createNewProduct, updatedProduct, deletedProduct
} from '../action/adminThunks';

const initialState = {
  admin: null,
  allUser: [],
  allBrand: [],
  allCategory: [],
  allType: [],
  allProduct: [],
  error: null,
};

// Hàm tạo case xử lý cho các thunks
const createEntityCases = (builder, thunks, stateProp) => {
  const [fetchAll, create, update, remove] = thunks;

  builder
    .addCase(fetchAll.pending, (state) => {
      state.error = null;
    })
    .addCase(fetchAll.fulfilled, (state, action) => {
      state[stateProp] = action.payload;
    })
    .addCase(fetchAll.rejected, (state, action) => {
      state.error = action.payload;
    })
    .addCase(create.fulfilled, (state, action) => {
      state[stateProp] = [...state[stateProp], action.payload];
    })
    .addCase(update.fulfilled, (state, action) => {
      const index = state[stateProp].findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state[stateProp] = [
          ...state[stateProp].slice(0, index),
          action.payload,
          ...state[stateProp].slice(index + 1),
        ];
      }
    })
    .addCase(remove.fulfilled, (state, action) => {
      state[stateProp] = state[stateProp].filter(item => item.id !== action.payload);
    });

  [create, update, remove].forEach(thunk => {
    builder
      .addCase(thunk.pending, (state) => {
        state.error = null;
      })
      .addCase(thunk.rejected, (state, action) => {
        state.error = action.payload;
      });
  });
};

// Khởi tạo slice
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdmin(state, action) {
      state.admin = action.payload;
    },
  },
  extraReducers: (builder) => {
    createEntityCases(builder, [fetchAllUser, createNewUser, updatedUser, deletedUser], 'allUser');
    createEntityCases(builder, [fetchAllBrand, createNewBrand, updatedBrand, deletedBrand], 'allBrand');
    createEntityCases(builder, [fetchAllCategory, createNewCategory, updatedCategory, deletedCategory], 'allCategory');
    createEntityCases(builder, [fetchAllType, createNewType, updatedType, deletedType], 'allType');
    createEntityCases(builder, [fetchAllProduct, createNewProduct, updatedProduct, deletedProduct], 'allProduct');

    // Lắng nghe action `PERSIST_STORE_UPDATE` để merge state từ localStorage
    builder.addCase('PERSIST_STORE_UPDATE', (state, action) => {
      const updatedState = action.payload;
      if (updatedState?.admin) {
        state.allCategory = updatedState.admin.allCategory || state.allCategory;
        state.allBrand = updatedState.admin.allBrand || state.allBrand;
        state.allUser = updatedState.admin.allUser || state.allUser;
        state.allType = updatedState.admin.allType || state.allType;
        state.allProduct = updatedState.admin.allProduct || state.allProduct;
      }
    });
  },
});

export const { setAdmin } = adminSlice.actions;
export default adminSlice.reducer;
