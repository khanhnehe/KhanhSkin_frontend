import { createSlice } from '@reduxjs/toolkit';
import {
  fetchAllUser, createNewUser, updatedUser, deletedUser, fetchAllBrand, createNewBrand, updatedBrand, deletedBrand,
  fetchAllCategory, createNewCategory, updatedCategory, deletedCategory, fetchAllType, createNewType, updatedType, deletedType,
  fetchAllProduct, createNewProduct, updatedProduct, deletedProduct,
  getFilteredProducts, postFilteredProducts, getProductCategory, getProductTypes, getProductBrands, getInfoForProduct,
  getCartByUser, getPageProduct, getPageOrders, getVoucher, getActiveVouchers, applyToVoucher
} from '../action/adminThunks';

const initialState = {
  admin: null,
  allUser: [],
  allBrand: [],
  allCategory: [],
  allType: [],
  allProduct: [],
  getFilterProducts: [],
  categoryPrdocut: [],
  infoOfProduct: null,
  cartByUser: null,
  allOrder: [],
  activeVoucher: [],
  totalRecord: 0,
  allVoucher: [],
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

    // Xử lý trạng thái cho action getFilteredProducts
    builder
      .addCase(getFilteredProducts.pending, (state) => {
        state.error = null; // Xóa lỗi khi đang lọc sản phẩm
      })
      .addCase(getFilteredProducts.fulfilled, (state, action) => {
        state.getFilterProducts = action.payload; // Lưu sản phẩm được lọc vào state
      })
      .addCase(getFilteredProducts.rejected, (state, action) => {
        state.error = action.payload; // Xử lý lỗi nếu có
      });


    builder
      .addCase(postFilteredProducts.pending, (state) => {
        state.error = null;
      })
      .addCase(postFilteredProducts.fulfilled, (state, action) => {
        state.getFilterProducts = action.payload;
      })
      .addCase(postFilteredProducts.rejected, (state, action) => {
        state.error = action.payload;
      });


    builder
      .addCase(getProductCategory.pending, (state) => {
        state.error = null;
      })
      .addCase(getProductCategory.fulfilled, (state, action) => {
        state.categoryPrdocut = action.payload;
      })
      .addCase(getProductCategory.rejected, (state, action) => {
        state.error = action.payload;
      });

    builder
      .addCase(getProductTypes.pending, (state) => {
        state.error = null;
      })
      .addCase(getProductTypes.fulfilled, (state, action) => {
        state.categoryPrdocut = action.payload;
      })
      .addCase(getProductTypes.rejected, (state, action) => {
        state.error = action.payload;
      });


    builder
      .addCase(getProductBrands.pending, (state) => {
        state.error = null;
      })
      .addCase(getProductBrands.fulfilled, (state, action) => {
        state.categoryPrdocut = action.payload;
      })
      .addCase(getProductBrands.rejected, (state, action) => {
        state.error = action.payload;
      });


    builder
      .addCase(getInfoForProduct.pending, (state) => {
        state.error = null;
      })
      .addCase(getInfoForProduct.fulfilled, (state, action) => {
        state.infoOfProduct = action.payload;
      })
      .addCase(getInfoForProduct.rejected, (state, action) => {
        state.error = action.payload;
      });


    builder
      .addCase(getCartByUser.pending, (state) => {
        state.error = null;
      })
      .addCase(getCartByUser.fulfilled, (state, action) => {
        state.cartByUser = {
          ...state.cartByUser,
          ...action.payload,
        };
      })
      .addCase(getCartByUser.rejected, (state, action) => {
        state.error = action.payload;
      });



    builder
      .addCase(getPageProduct.pending, (state) => {
        state.error = null;
      })
      .addCase(getPageProduct.fulfilled, (state, action) => {
        state.allProduct = action.payload.items;
        state.totalRecord = action.payload.totalRecord;
      })
      .addCase(getPageProduct.rejected, (state, action) => {
        state.error = action.payload;
      });

    //order
    builder
      .addCase(getPageOrders.pending, (state) => {
        state.error = null;
      })
      .addCase(getPageOrders.fulfilled, (state, action) => {
        state.allOrder = action.payload.items;
        state.totalRecord = action.payload.totalRecord;
      })
      .addCase(getPageOrders.rejected, (state, action) => {
        state.error = action.payload;
      });

    //

    builder
      .addCase(getVoucher.pending, (state) => {
        state.error = null;
      })
      .addCase(getVoucher.fulfilled, (state, action) => {
        state.allVoucher = action.payload;
      })
      .addCase(getVoucher.rejected, (state, action) => {
        state.error = action.payload;
      });

      //
      builder
      .addCase(getActiveVouchers.pending, (state) => {
        state.error = null;
      })
      .addCase(getActiveVouchers.fulfilled, (state, action) => {
        state.activeVoucher = action.payload;
      })
      .addCase(getActiveVouchers.rejected, (state, action) => {
        state.error = action.payload;
      });


      builder
  .addCase(applyToVoucher.pending, (state) => {
      state.error = null;
  })
  .addCase(applyToVoucher.fulfilled, (state, action) => {
      state.cartByUser = {
        ...state.cartByUser,
        ...action.payload, // Cập nhật giỏ hàng với giá trị giảm giá mới
      };
  })
  .addCase(applyToVoucher.rejected, (state, action) => {
      state.error = action.payload;
  });



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
