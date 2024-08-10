import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
    name:"theme",
    initialState:{
      theme:"light"
    },
    reducers:{
        toaggleTheme:(state, action)=>{
            state.theme = state.theme === "light" ? "dark" : "light"
        }
    }
})

export const {toaggleTheme} = themeSlice.actions
export default themeSlice;