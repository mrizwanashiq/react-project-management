import React, { useEffect, useState, useRef } from "react"
import { Input, Row, Spin, Space, notification } from "antd"
import {
	AddProjectIcon,
	AddProjectWrapper,
	InputWrapper,
	TopHeaderWrapper,
	TopHeaderLeftSide,
	BodyWrapper
} from "./styles"
import TextArea from "antd/lib/input/TextArea"
import { useSelector, useDispatch } from "react-redux"
import { CreateProject, EditAProject, GetProjectMeta } from "redux/app/actions/projects"
import NewProject from "assets/icons/NewProject"
import { data, loading } from "redux/app"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import ArrowLeft from "assets/icons/ArrowLeft"
import Logout from "components/shared/Logout"
import Column from "antd/lib/table/Column"

const AddProject = (props) => {
	const dispatch = useDispatch()
	const projectDetails = useSelector(data)
	const dataLoading = useSelector(loading)
	const [values, setValues] = useState({
		name: "",
		description: "",
	})

	const { id } = useParams()

	const location = useLocation()
	const navigate = useNavigate()
	const headingRef = useRef()

	useEffect(() => {
		if (id && !projectDetails[projectDetails.length -1]?.screen) {
			dispatch(
				GetProjectMeta(
					id,
					// selectProjectHeading
				)
			)

			// setTimeout(() => {
			// 	selectProjectHeading()
			// 	navigate(`/project/${id}`, { state: {} })
			// }, 1500)
		}
	}, [dispatch, id])

	// const selectProjectHeading = () => {
	// 	if (location?.state?.isNewProject) headingRef.current.select()
	// }

	const onFinish = () => {
		if (!values.name) {
			notification["error"]({
				message: "Name is required...!",
				duration: 2,
			})
			return
		}
		id ? dispatch(EditAProject(values, id, "Edit")) : dispatch(CreateProject(values, setValues))
	}

	useEffect(() => {
		if (projectDetails) {
			setValues(projectDetails)
		}
	}, [projectDetails])

	return (
		<>
			<AddProjectWrapper>
				<Row align="center" className="top-row">
					<TopHeaderWrapper>
						<TopHeaderLeftSide>
							<span className="back-arrow" onClick={() => navigate("/")}>
								<ArrowLeft width={60} />
							</span>

							<AddProjectIcon>
								<NewProject width={35} />
							</AddProjectIcon>
							
						</TopHeaderLeftSide>
						<div>
							<Logout />
						</div>
					</TopHeaderWrapper>
				</Row>

				<BodyWrapper>
				<InputWrapper>
								<Input
									autoFocus={location.state?.isNewProject ? true : false}
									placeholder="Project name"
									className="project-heading"
									ref={headingRef}
									maxLength={128}
									value={values.name}
									showCount={false}
									onChange={(e) => {
										setValues({ ...values, name: e.target.value })
									}}
									onBlur={onFinish}
								/>

								<TextArea
									cols={30}
									value={values.description}
									rows={2}
									className="project-description"
									placeholder="Project description"
									maxLength={1024}
									showCount={false}
									onBlur={onFinish}
									onChange={(e) => {
										setValues({ ...values, description: e.target.value })
									}}
								/>
							</InputWrapper>

							{dataLoading && (
								<Space size="medium">
									<Spin size="medium" />
								</Space>
					)}
					</BodyWrapper>
				{/* </Column> */}
			</AddProjectWrapper>
		</>
	)
}

export default AddProject
