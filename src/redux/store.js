import { configureStore } from "@reduxjs/toolkit"
import infoRedcuer from "./data"

export default configureStore({
    reducer: {
        information: infoRedcuer
    }
})