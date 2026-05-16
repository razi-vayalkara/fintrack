import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import lockerReducer from "./lockerSlice";
import transactionReducer from "./transactionSlice";
import suggestionReducer from "./suggestionSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    lockers: lockerReducer,
    transactions: transactionReducer,
    suggestions: suggestionReducer
  }
});
