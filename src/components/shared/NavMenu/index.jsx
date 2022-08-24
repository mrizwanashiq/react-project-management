import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Menu } from "antd"
import { useDispatch } from "react-redux"
import Projects from "assets/icons/Projects"
import { ButtonWrapper, MenuWrapper } from "./styles"
import { CreateProject } from "redux/app/actions/projects"
import CustomButton from "components/shared/CustomButton/CustomButton"
import PlusIcon from "assets/icons/PlusIcon.png"
import Active from "assets/icons/Active"
import Archive from "assets/icons/Archive"

const NavMenu = ({ collapsed }) => {
	const navigate = useNavigate()
	const location = useLocation()
	const { pathname } = location
	const dispatch = useDispatch()
	const [currentActive, setCurrentActive] = useState(pathname)

	useEffect(() => {
		setCurrentActive(pathname)
	}, [pathname, currentActive])

	const handleClick = (e) => {
		setCurrentActive(e.key)
	}

	return (
		<MenuWrapper>
			<Menu mode="inline" theme="light" onClick={handleClick} selectedKeys={[currentActive]}>
					<Menu.Item
							icon={<Projects width={20} />}
							onClick={() => navigate("/")}
							key="/"
						>
							All Projects
						</Menu.Item>

						<Menu.Item
							icon={<Active width={20} />}
							onClick={() => navigate("/active")}
							key="/active"
						>
							Active
						</Menu.Item>

						<Menu.Item
							icon={<Archive width={20} />}
							onClick={() => navigate("/archived")}
							key="/archived"
						>
							Archived
						</Menu.Item>

						<ButtonWrapper>
							<CustomButton
								onClick={() => dispatch(CreateProject(navigate))}
								image={PlusIcon}
								title={!collapsed ? "New Project" : ""}
								collapsed={collapsed}
								className={"add-btn"}
								style={
									!collapsed
										? { padding: "15px 25px", marginLeft: "8%" }
										: { padding: "20px 10px 20px 20px" }
								}
								type="submit"
							/>
				</ButtonWrapper>
				
			</Menu>
		</MenuWrapper>
	)
}

export default NavMenu
