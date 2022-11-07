import { createSlice } from "@reduxjs/toolkit"

export const infoSlice = createSlice({
    name: "information",
    initialState: {
        data: {
            products: [],
            productsMappedById: [],
            brands: [],
            brandsMappedById: [],
            collections: [],
            ending: [],
            all_messages: []
        }
    },
    reducers: {
        setInfo: (state, action) => {
            state.data = action.payload
        }
    }
})

export const { setInfo } = infoSlice.actions

export default infoSlice.reducer