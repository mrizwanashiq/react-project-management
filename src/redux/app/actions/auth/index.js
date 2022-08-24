import { notification } from "antd"
import { requestCompleted, requestFailure, requestStart } from "redux/app"

// Login User
export function LoginUser(payload, navigate) {
	return async (dispatch) => {
		dispatch(requestStart())
		let users = localStorage.getItem('users');
		if (users) {
			users = JSON.parse(users);
			const user = users.find(i => i.email === payload.email && i.password === payload.password);

			if (user) {
				localStorage.setItem("token", user.id)
				notification["success"]({
					message: "Logged in",
					duration: 2,
				})
				navigate("/")
				dispatch(requestCompleted())
			} else {
				notification["error"]({
					message: "Invalid Credetials",
					duration: 2,
				})
				dispatch(requestCompleted())
			}

		} else {
			notification["error"]({
				message: "No User found, register yourself",
				duration: 2,
			})
			dispatch(requestFailure())
		}
	}
}

export function RegisterUser(payload, navigate) {
	return async (dispatch) => {
		dispatch(requestStart())
		let users = localStorage.getItem('users');
		if (users) {
			users = JSON.parse(users);
		} else {
			localStorage.setItem('users', JSON.stringify([]))
			users = [];
		}
		const user = users.find(i => i.email === payload.email);

		if (!user) {
			payload.id = users.length + 1;
			users.push(payload);
			localStorage.setItem('users', JSON.stringify(users))
			notification["success"]({
				message: "Registered Successfully",
				duration: 2,
			})
			navigate("/")
			dispatch(requestCompleted())
		} else {
			notification["error"]({
				message: "User already exists with this email",
				duration: 2,
			})
			dispatch(requestCompleted())
		}

	}
}
