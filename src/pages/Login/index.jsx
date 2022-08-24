import { useEffect } from "react"
import { Form, Input, Button, Space, Spin } from "antd"
import { LoginCard, LoginWrapper, LoginHeading, FormWrapper, FlexCenter } from "./styles"
import { LoginUser } from "redux/app/actions/auth"
import { useSelector, useDispatch } from "react-redux"
import { loading } from "redux/app"
import { useNavigate } from "react-router-dom"
import LogoPrimary from "assets/logos/LogoPrimary"

const Login = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const dataLoading = useSelector(loading)
	const [form] = Form.useForm()

	const onFinish = (values) => {
		console.log("Success:", values)
		dispatch(LoginUser(values, navigate))
	}
	useEffect(() => {
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
