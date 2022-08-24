import { createSlice } from "@reduxjs/toolkit"

const initialState = {
	isAuthorized: false,
	loading: false,
	hasErrors: false,
	data: [],
	searchQuery: "",
}

const appReducer = createSlice({
	name: "app",
	initialState,
	reducers: {
		requestStart: (state) => {
			state.loading = true
		},
		requestCompleted: (state) => {
			state.loading = false
		},

		requestSuccess(state, { payload }) {
			state.data = payload
			state.loading = false
			state.hasErrors = false
		},

		requestFailure(state) {
			state.loading = false
			state.hasErrors = true
		},

		setSearchQuery(state, { payload }) {
			state.searchQuery = payload
		},
		resetData(state) {
			state.data = []
		},
	},
})

export const data = (state) => state.app.data
export const loading = (state) => state.app.loading
export const searchQuery = (state) => state.app.searchQuery

export const {
	requestStart,
	requestSuccess,
	requestFailure,
	requestCompleted,
	setSearchQuery,
	resetData,
} = appReducer.actions

export default appReducer.reducer
