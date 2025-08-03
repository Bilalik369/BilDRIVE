import {createSlice , createAsyncThunk} from "@reduxjs/toolkit"


export const  loginUser = createAsyncThunk("auth/login" , async({email , password} ,{rejectWithValue} )=>{
    try {
        const response =  await
    } catch (error) {
        
    }

}) 