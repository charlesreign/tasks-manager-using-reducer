export const taskReducer = (state,action) => {
    switch (action.type) {
        case "EMPTY_FIELD":
            return{
                ...state, 
                isAlertOpen: true,
                alertContent: "Either fields cannot be empty",
                alertClass: "danger"
            }
        case "CLOSE_ALERT":
            return {
                ...state,
                isAlertOpen: false
            }
        case "ADD_TASK":
            const allTask = [...state.tasks, action.payload]
            return {
                ...state, 
                tasks: allTask,
                isAlertOpen: true,
                alertContent: "Task added successfully",
                alertClass: "success"
            }
        case "OPEN_EDIT_MODAL":
            return {
                ...state,
                taskID: action.payload,
                isEditModalOpen: true,
                modalTitle: "Edit Task",
                modalMsg: "You are about to edit this task",
                modalActionText: "Edit"
            }
        case "EDIT_TASK":
            return{
                ...state,
                isEditing: true
            }
        case "CLOSE_MODAL":
            return {
                ...state,
                isEditModalOpen: false,
                isDeleteModalOpen: false
            }
        case "UPDATE_TASK":
            const updatedTask = action.payload
            const id = action.payload.id

            //FIND THE TASK INDEX
            const taskIndex = state.tasks.findIndex((task) => {
                return task.id === id
            })
            //REPLACE TASK BY IT'S INDEX
            if (taskIndex !== -1) {
                state.tasks[taskIndex] = updatedTask
            }
            return {
                ...state,
                isEditing: false,
                isAlertOpen: true,
                alertContent: "Task edited successfully",
                alertClass: "success"
            }
        case "OPEN_DELETE_MODAL":
            return {
                ...state,
                taskID: action.payload,
                isDeleteModalOpen: true,
                modalTitle: "Delete Task",
                modalMsg: "You are about to delete this task",
                modalActionText: "Delete"
            }
        case "DELETE_TASK":
            const task_id = action.payload
            const newTask = state.tasks.filter((task) => task.id !== task_id)
            return {
                ...state,
                tasks: newTask,
                isAlertOpen: true,
                alertContent: "Task deleted successfully",
                alertClass: "success",
                isDeleteModalOpen: false
            }
        case "COMPLETE_TASK":
            const complete_task_id = action.payload
            //FIND THE TASK INDEX
            const complete_task_index = state.tasks.findIndex((task) => {
                return task.id === complete_task_id
            })
            let completeUpdatedTask = {
                id:complete_task_id,
                name: state.tasks[complete_task_index].name,
                date: state.tasks[complete_task_index].date,
                description: state.tasks[complete_task_index].description,
                complete: true
            }
            if (complete_task_index !== -1) {
                state.tasks[complete_task_index] = completeUpdatedTask
            }
            return {
                ...state,
                isAlertOpen: true,
                alertContent: "Task completed",
                alertClass: "success"
            }
        default:
            throw new Error("An error has occured");
        }
}