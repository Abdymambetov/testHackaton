import { configureStore } from '@reduxjs/toolkit'
import EditdataUser from './reducers/EditDataUsers'


export const store = configureStore({
	reducer: {
		auth: EditdataUser
	},
})
