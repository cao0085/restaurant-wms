

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchMaterialsData } from '../hooks/FetchFirebaseData'



export const fetchMaterials = createAsyncThunk(
    'material/fetchMaterials',
    async (firebaseApp, { rejectWithValue }) => {
        try {
            const data = await fetchMaterialsData({ firestore: firebaseApp });
            console.log("Redux Materials update ",data)
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


const materialSlice = createSlice({
    name:"material",
    initialState: {
        materials: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMaterials.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMaterials.fulfilled, (state, action) => {
                state.loading = false;
                state.materials = action.payload;
            })
            .addCase(fetchMaterials.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }

})




export default materialSlice.reducer