import React, { useState, useEffect, useRef } from "react"
import { Table, Popconfirm, Form, Typography, Tooltip, Row, Col, Input } from "antd"
import EditableCell from "components/utility/EditableCell"
import {
	GetAllProjects,
	EditAProject,
	DeleteAProject,
	SearchProject,
	CopyProject,
} from "redux/app/actions/projects"
import { useSelector, useDispatch } from "react-redux"
import Pencil from "assets/icons/Pencil"
import { HomeWrapper, ActionButtonWrapper, SearchInput, ProjectStatus } from "./styles"
import { data, loading, searchQuery, setSearchQuery } from "redux/app"
import { Link, useLocation } from "react-router-dom"
import Trash from "assets/icons/Trash"
import Archive from "assets/icons/Archive"
import moment from "moment"
import Logout from "components/shared/Logout"
import { TopHeaderLeftSide } from "pages/AddProject/styles"
import Duplicate from "assets/icons/Duplicate"

const EditableTable = () => {
	const dispatch = useDispatch()
	const tableData = useSelector(data)
	const dataLoading = useSelector(loading)
	const [search, setSearch] = useState("")
	const searchString = useSelector(searchQuery)
	const [form] = Form.useForm()
	const [editingKey, setEditingKey] = useState("")
	const [filteredProjects, setFilteredProjects] = useState([])
	const isEditing = (record) => record.id === editingKey
	const [isCopiedSuccess, setIsCopiedSuccess] = useState(false)
	const [pagination, setPagination] = useState({
		current: 1,
	})

	const { pathname } = useLocation()

	useEffect(() => {
		dispatch(GetAllProjects())
	}, [dispatch])

	useEffect(() => {
		if (searchString === "") dispatch(GetAllProjects())
	}, [dispatch, searchString])

	useEffect(() => {
		if (tableData?.length > 0) {
			if (searchString) {
				let result = tableData?.filter(
					(project) =>
						project?.name?.toUpperCase().includes(searchString.toUpperCase()) ||
						project?.description?.toUpperCase().includes(searchString.toUpperCase())
				)
				setFilteredProjects(result)
			}
		}
	}, [searchString, tableData])

	useEffect(() => {
		if (tableData.length > 0 && isCopiedSuccess) {
			const latestProject = tableData.at(-1)
			edit(latestProject)
		}
	}, [tableData])

	const edit = (record) => {
		form.setFieldsValue({
			name: "",
			description: "",
			...record,
		})
		setEditingKey(record.id)
	}

	const cancel = () => {
		setEditingKey("")
		setIsCopiedSuccess(false)
	}

	const deleteProject = (id) => {
		dispatch(DeleteAProject(id))
	}

	const save = async (id) => {
		setIsCopiedSuccess(false)
		try {
			const data = await form.validateFields()
			// console.log(data)
			dispatch(EditAProject(data, id, "Home"))
			setEditingKey("")
		} catch (errInfo) {
			console.log("Validate Failed:", errInfo)
		}
	}

	// Show full text in tooltip
	const handleShowFullText = (text) => {
		if (text?.length > 70) {
			return (
				<Tooltip placement="topLeft" title={text}>
					{text}
				</Tooltip>
			)
		} else {
			return text
		}
	}

	const handlePagination = (page) => {
		setPagination({
			current: page,
		})
	}

	const handleCopyProject = (projectID) => {
		setIsCopiedSuccess(false)
		dispatch(CopyProject(projectID, setPagination, setIsCopiedSuccess))
	}

	const columns = [
		{
			title: "Project",
			dataIndex: "name",
			width: "20%",
			editable: true,
			sorter: (a, b) => a.name?.localeCompare(b.name),
			ellipsis: {
				showTitle: false,
			},
			render: (_, project) => (
				<Link to={`/project/${project?.id}`} className="project-name">
					{handleShowFullText(project?.name)}
				</Link>
			),
		},
		{
			title: "Description",
			dataIndex: "description",
			width: "40%",
			editable: true,
			sorter: (a, b) => a.description?.localeCompare(b.description),
			ellipsis: {
				showTitle: false,
			},
			render: (description) => handleShowFullText(description),
		},
		{
			title: "Status",
			dataIndex: "status",
			width: "10%",
			editable: false,
			sorter: (a, b) => a.status?.localeCompare(b.status),
			render: (status) => <ProjectStatus>{status}</ProjectStatus>,
		},
		{
			title: "Last modified",
			dataIndex: "last_modified_date",
			width: "15%",
			editable: false,
			sorter: (a, b) => a.last_modified_date?.localeCompare(b.last_modified_date),
			defaultSortOrder: "descend",
			render: (_, project) => (
				<span>{moment(project?.last_modified_date).format("MM/DD/YYYY HH:mm")}</span>
			),
		},
		{
			title: "",
			width: "15%",
			dataIndex: "operation",
			render: (_, project) => {
				const editable = isEditing(project)
				return editable ? (
					<span>
						<Typography.Link onClick={() => save(project.id)}>Save</Typography.Link>
						<span className="edit-cancel-btn" onClick={cancel}>
							Cancel
						</span>
					</span>
				) : (
					<ActionButtonWrapper>
						<Typography.Link disabled={editingKey !== ""} onClick={() => edit(project)}>
							<Tooltip placement="bottom" title="Edit">
								<Pencil width={20} />
							</Tooltip>
						</Typography.Link>

						<Popconfirm
							title="Permanently delete this project?"
							okText="Delete"
							onConfirm={() => deleteProject(project.id)}
						>
							<Typography.Link disabled={editingKey !== ""}>
								<Tooltip placement="bottom" title="Delete">
									<Trash width={20} />
								</Tooltip>
							</Typography.Link>
						</Popconfirm>

						<Typography.Link
							onClick={() =>
								dispatch(
									EditAProject(
										{
											name: project.name,
											status:
												project?.status?.toLowerCase() === "active"
													? "Archived"
													: "Active",
										},
										project.id
									)
								)
							}
						>
							<Tooltip
								placement="bottom"
								title={
									project?.status?.toLowerCase() === "active"
										? "Archive"
										: "Activate"
								}
							>
								<Archive width={20} />
							</Tooltip>
						</Typography.Link>

						<Typography.Link onClick={() => handleCopyProject(project?.id)}>
							<Tooltip placement="bottom" title="Copy">
								<Duplicate width={20} />
							</Tooltip>
						</Typography.Link>
					</ActionButtonWrapper>
				)
			},
		},
	]

	const mergedColumns = columns.map((col) => {
		if (!col.editable) {
			return col
		}

		return {
			...col,
			onCell: (record) => ({
				record,
				inputType: col.dataIndex === "description" ? "textarea" : "text",
				dataIndex: col.dataIndex,
				title: col.title,
				editing: isEditing(record),
			}),
		}
	})

	const handleKeyPress = (event) => {
		if (event.key === "Enter") {
			dispatch(SearchProject(search))
		}
	}

	return (
		<HomeWrapper>
			<Row justify="end">
				<Col style={{ marginRight: 30 }}>
					<TopHeaderLeftSide>
						<SearchInput>
							<Input
								onChange={(e) => {
									console.log(e.target.value)
									dispatch(setSearchQuery(e.target.value))
									setSearch(e.target.value)
								}}
								onKeyPress={handleKeyPress}
								type="text"
								placeholder="Search projects"
								id="header-search"
							/>
						</SearchInput>
						<div>
							<Logout />
						</div>
					</TopHeaderLeftSide>
				</Col>
			</Row>
			<Form form={form} component={false}>
				<Table
					rowKey={"id"}
					loading={dataLoading}
					components={{
						body: {
							cell: EditableCell,
						},
					}}
					dataSource={
						filteredProjects?.length > 0 && searchString !== ""
							? filteredProjects
							: pathname.slice(1) === "active"
							? tableData.filter(
									(project) => project?.status?.toLowerCase() === "active"
							  )
							: pathname.slice(1) === "archived"
							? tableData.filter(
									(project) => project?.status?.toLowerCase() === "archived"
							  )
							: tableData
					}
					columns={mergedColumns}
					pagination={{
						onChange: () => {
							cancel()
							handlePagination()
						},
						defaultPageSize: 15,
						current: pagination.current,
					}}
				/>
			</Form>
		</HomeWrapper>
	)
}
export default EditableTable
