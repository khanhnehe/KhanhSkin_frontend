import { createSlice } from '@reduxjs/toolkit';
import { fetchAllUser, createNewUser, updatedUser, deletedUser, fetchAllBrand, createNewBrand, updatedBrand, deletedBrand ,
        fetchAllCategory, createNewCategory,  updatedCategory,  deletedCategory, fetchAllType, createNewType, updatedType, deletedType,
        fetchAllProduct, createNewProduct, updatedProduct, deletedProduct
} from '../action/adminThunks';

const initialState = {
  admin: null,
  allUser: [],
  allBrand: [],
  allCategory: [],
  allType: [],
  error: null,
  allProduct: []

};

const createGenericCases = (builder, thunk, stateProp) => {
  builder
    .addCase(thunk.pending, (state) => {
      state.error = null;
    })
    .addCase(thunk.fulfilled, (state, action) => {
      state[stateProp] = action.payload;
    })
    .addCase(thunk.rejected, (state, action) => {
      state.error = action.payload;
    });
};

const createEntityCases = (builder, thunks, stateProp) => {
  const [fetchAll, create, update, remove] = thunks;

  createGenericCases(builder, fetchAll, stateProp);

  builder
    .addCase(create.fulfilled, (state, action) => {
      state[stateProp].push(action.payload);
    })
    .addCase(update.fulfilled, (state, action) => {
      const index = state[stateProp].findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state[stateProp][index] = action.payload;
      }
    })
    .addCase(remove.fulfilled, (state, action) => {
      state[stateProp] = state[stateProp].filter(item => item.id !== action.payload.id);
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

    
  },
});

export const { setAdmin } = adminSlice.actions;
export default adminSlice.reducer;