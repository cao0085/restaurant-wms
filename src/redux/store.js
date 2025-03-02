// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./authSlice"
import materialReducer from "./materialSlice"


// 建立一個 Redux Store 而且會把 reducer 合併
// firebaseReducer method 給 firebase 儲存



const store = configureStore({
    reducer: {
        auth: authReducer,
        material: materialReducer,
    },
    devTools: true,
});



export default store;

