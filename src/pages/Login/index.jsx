import React from "react"
import { Form, Input, Button, Space, Spin } from "antd"
import { LoginCard, LoginWrapper, LoginHeading, FormWrapper, FlexCenter } from "./styles"
import { ForgotPassword, ActionLinks } from "pages/Register/styles"
import { useNavigate, Link } from "react-router-dom"
import LogoPrimary from "assets/logos/LogoPrimary"
import { notification } from "antd"

const Login = () => {
	const navigate = useNavigate()
	const [dataLoading, setLoading] = React.useState(false)
	const [form] = Form.useForm()

	const onFinish = (values) => {
		setLoading(true);
		const users = JSON.parse(localStorage.getItem('users'));
		const user = users.find(i => i.email === values.email && i.password === values.password);

		if (user) {
			localStorage.setItem("token", user.id)
			notification["success"]({
				message: "Logged in",
				duration: 2,
			})
			setLoading(false)
			navigate("/")
		} else {
			notification["error"]({
				message: "Invalid Credetials",
				duration: 2,
			})
			setLoading(false)
		}
	}
	React.useEffect(() => {
		form.setFieldsValue({
			email: "",
			password: "",
		})
	}, [form])

	return (
		<LoginWrapper>
			<LoginCard>
				<LoginHeading>
					<LogoPrimary width={400} />
				</LoginHeading>
				<FormWrapper>
					<Form form={form} layout="vertical" className="FormWrapper" onFinish={onFinish}>
						<Form.Item
							label="Name / Email ID"
							name="email"
							rules={[{ required: true, message: "Please input your Email!" }]}
						>
							<Input />
						</Form.Item>

						<Form.Item
							label="Password"
							name="password"
							rules={[{ required: true, message: "Please input your password!" }]}
						>
							<Input.Password />
						</Form.Item>

						<ActionLinks>
							<ForgotPassword>
								<Link to="/register">Create a new account</Link>
							</ForgotPassword>
						</ActionLinks>

						<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
							<Button type="primary" htmlType="submit">
								Login
							</Button>
						</Form.Item>
					</Form>
				</FormWrapper>
				{dataLoading && (
					<FlexCenter>
						<Space size="medium">
							<Spin size="medium" />
						</Space>
					</FlexCenter>
				)}
			</LoginCard>
		</LoginWrapper>
	)
}

export default Login
