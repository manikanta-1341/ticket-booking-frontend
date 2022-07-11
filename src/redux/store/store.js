import { configureStore} from '@reduxjs/toolkit'
import Reducer from '../reducer/reducer'

const store = configureStore({
    reducer : Reducer
})

export default store