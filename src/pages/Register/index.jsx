import { useEffect } from "react"
import { Form, Input, Button, Space, Spin } from "antd"
import { Card, Wrapper, Heading, FormWrapper, FlexCenter } from "./styles"
import { RegisterUser } from "redux/app/actions/auth"
import { useSelector, useDispatch } from "react-redux"
import { loading } from "redux/app"
import { useNavigate } from "react-router-dom"
import LogoPrimary from "assets/logos/LogoPrimary"

const Register = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const dataLoading = useSelector(loading)
	const [form] = Form.useForm()

	const onFinish = (values) => {
		console.log("Success:", values)
		dispatch(RegisterUser(values, navigate))
	}
	useEffect(() => {
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
