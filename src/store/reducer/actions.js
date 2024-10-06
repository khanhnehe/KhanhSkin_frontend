// actions.js
export const persistStoreUpdate = (updatedState) => {
    return {
      type: 'PERSIST_STORE_UPDATE',
      payload: updatedState
    };
  };
  