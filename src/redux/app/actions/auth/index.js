import { notification } from "antd"
import { requestCompleted, requestFailure, requestStart } from "redux/app"
import axios from "axios"

// Login User
export function LoginUser(data, navigate) {
	return async (dispatch) => {
		dispatch(requestStart())
		try {
			axios
				.post(process.env.REACT_APP_API_BASE_URL + "/user/login", data)
				.then(res => {
					if (res.status === 200) {
						const { data } = res.data
						localStorage.setItem("token", data.token)
						notification["success"]({
							message: "Logged in",
							duration: 2,
						})
						navigate("/")
						dispatch(requestCompleted())
					}
				})
				.catch(error => {
					// notification["error"]({
					// 	message: error.response.data.data,
					// })
					// dispatch(requestCompleted())
					notification["error"]({
						message: "Invalid Credetials",
						duration: 2,
					})
					dispatch(requestCompleted())
				})
		} catch (error) {
			throw error
		}
	}
}

export function RegisterUser(data, navigate) {
	return async (dispatch) => {
		dispatch(requestStart())
		try {
			axios
				.post(process.env.REACT_APP_API_BASE_URL + "/user/registration", data)
				.then(res => {
					if (res) {
						dispatch(requestCompleted())
						navigate("/login")
						notification["success"]({
							message: "Registered successfully",
						})
					}
				})
				.catch(error => {
					// notification["error"]({
					// 	message: error.response.data.data,
					// })
					// dispatch(requestCompleted())
					notification["error"]({
						message: "User already exists with this email",
						duration: 2,
					})
					dispatch(requestCompleted())
				})
		} catch (error) {
			// dispatch(loadUserProfileFailure())
		}
	}
}
