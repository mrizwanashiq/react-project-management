import { notification } from "antd"
import { generateId } from "services/CommonMethods"
import { requestStart, requestSuccess, requestFailure, requestCompleted } from "../../"

const token = localStorage.getItem("token")

export function GetProjectMeta(id) {
	return (dispatch) => {
		dispatch(requestStart())
		let projects = localStorage.getItem("projects")
		if (projects) {
			projects = JSON.parse(projects)
		} else {
			localStorage.setItem("users", JSON.stringify([]))
			projects = []
		}
		const project = projects.find((i) => i.id === id)

		if (!project) {
			dispatch(requestFailure())
		} else {
			dispatch(requestSuccess(project))
			dispatch(requestCompleted())
		}
	}
}

//Get all projects
export function GetAllProjects() {
	return (dispatch) => {
		dispatch(requestStart())
		let projects = localStorage.getItem("projects")
		if (projects) {
			projects = JSON.parse(projects)
			dispatch(requestSuccess(projects))
		} else {
			localStorage.setItem("projects", JSON.stringify([]))
			dispatch(requestSuccess([]))
		}
	}
}

//Edit a project
export function EditAProject(data, id, screen) {
	return (dispatch, state) => {
		dispatch(requestStart())
		let projects = localStorage.getItem("projects")
		if (projects) {
			projects = JSON.parse(projects)
		} else {
			localStorage.setItem("users", JSON.stringify([]))
			projects = []
		}
		const project = projects.find((i) => i.id === id)

		if (!project) {
			notification["error"]({
				message: "Project Not Found",
				duration: 2,
			})
			dispatch(requestFailure())
		} else {
			const index = projects.findIndex((i) => i.id === id)
			projects[index] = { ...project, ...data }
			localStorage.setItem("projects", JSON.stringify(projects))

			const { app } = state()
			const projectName = app?.data[0]?.project?.name

			if (projectName !== data?.name) {
				notification["success"]({
					message: "Project edited successfully",
					duration: 2,
				})
			}
			dispatch(requestCompleted())
			if (screen === "Edit") {
				dispatch(GetProjectMeta(id, "projectDetails"))
			} else {
				dispatch(GetAllProjects())
			}
		}
	}
}

//Search projects
export function SearchProject(searchQuery) {
	return (dispatch) => {
		dispatch(requestStart())
		let projects = localStorage.getItem("projects")
		if (projects) {
			projects = JSON.parse(projects)
		} else {
			localStorage.setItem("users", JSON.stringify([]))
			projects = []
		}
		const filteredProject = projects.filter(
			(i) =>
				i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				i.description.toLowerCase().includes(searchQuery.toLowerCase())
		)
		dispatch(requestSuccess(filteredProject))
	}
}

// Delete a project
export function DeleteAProject(id) {
	return (dispatch) => {
		dispatch(requestStart())
		let projects = localStorage.getItem("projects")
		if (projects) {
			projects = JSON.parse(projects)
		} else {
			localStorage.setItem("users", JSON.stringify([]))
			projects = []
		}
		const filteredProject = projects.filter((i) => i.id === id)
		localStorage.setItem("projects", JSON.stringify(filteredProject))
		dispatch(requestCompleted())
		dispatch(GetAllProjects())
		notification["success"]({
			message: "Project deleted successfully",
			duration: 2,
		})
	}
}

// Create Project
export function CreateProject(navigate) {
	return (dispatch) => {
		dispatch(requestStart())
		let projects = localStorage.getItem("projects")
		if (projects) {
			projects = JSON.parse(projects)
		} else {
			projects = []
			localStorage.setItem("projects", JSON.stringify([]))
		}
		const project = {
			id: generateId(projects),
			name: `Untitled Project ${generateId(projects)}`,
			description: "",
			user_id: token,
			last_modified_by: token,
			status: "active",
		}
		projects.push(project)
		localStorage.setItem("projects", JSON.stringify(projects))
		notification["success"]({
			message: "Project created successfully",
			duration: 2,
		})
		navigate(`/project/${project.id}`, { state: { isNewProject: true } })
	}
}

// Copy a project
export function CopyProject(projectID, setPagination, setIsCopiedSuccess) {
	return (dispatch) => {
		dispatch(requestStart())
		let projects = localStorage.getItem("projects")
		if (projects) {
			projects = JSON.parse(projects)
		} else {
			localStorage.setItem("users", JSON.stringify([]))
			projects = []
		}
		const project = projects.find((i) => i.id === projectID)
		projects.push({ ...project, id: generateId(projects), name: `${project.name} Copy` })
		localStorage.setItem("projects", JSON.stringify(projects))
		dispatch(requestCompleted())
		dispatch(GetAllProjects())
		setPagination({ current: 1 })
		setIsCopiedSuccess(true)
		notification["success"]({
			message: "Project copied successfully",
			duration: 2,
		})
	}
}
