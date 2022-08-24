import React from "react"
import { Form, Input, Button, Space, Spin } from "antd"
import { Card, Wrapper, Heading, FormWrapper, FlexCenter, ForgotPassword, ActionLinks } from "./styles"
import { useNavigate, Link } from "react-router-dom"
import LogoPrimary from "assets/logos/LogoPrimary"
import { notification } from "antd"
import { generateId } from "services/CommonMethods"

const Register = () => {
	const navigate = useNavigate()
	const [dataLoading, setLoading] = React.useState(false)
	const [form] = Form.useForm()

	const onFinish = (values) => {
		setLoading(true)
		const users = JSON.parse(localStorage.getItem('users'));
		const user = users.find(i => i.email === values.email);
		if (!user) {
			values.id = generateId(users);
			users.push(values);
			localStorage.setItem('users', JSON.stringify(users))
			notification["success"]({
				message: "Registered Successfully",
				duration: 2,
			})
			setLoading(false)
			navigate("/login")
		} else {
			notification["error"]({
				message: "User already exists with this email",
				duration: 2,
			})
			setLoading(false)
		}
	}
	React.useEffect(() => {
		form.setFieldsValue({
			first_name: "",
			last_name: "",
			email: "",
			password: "",
		})
	}, [form])

	return (
		<Wrapper>
			<Card>
				<Heading>
					<LogoPrimary width={400} />
				</Heading>
				<FormWrapper>
					<Form form={form} layout="vertical" className="FormWrapper" onFinish={onFinish}>
						<Form.Item
							label="First Name"
							name="first_name"
							rules={[{ required: true, message: "Please input your First Name!" }]}
						>
							<Input />
						</Form.Item>

						<Form.Item
							label="Last Name"
							name="last_name"
							rules={[{ required: true, message: "Please input your Last Name!" }]}
						>
							<Input />
						</Form.Item>

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
								<Link to="/login">Already have an account.</Link>
							</ForgotPassword>
							{/* <ForgotPassword>Forgot Password</ForgotPassword> */}
						</ActionLinks>

						<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
							<Button type="primary" htmlType="submit">
								Register
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
			</Card>
		</Wrapper>
	)
}

export default Register
