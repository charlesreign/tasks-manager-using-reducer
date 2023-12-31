import {useState, useRef, useEffect, useReducer} from 'react'
import useLocalStorage from "use-local-storage";
import Task from './Task';
import './TaskManager.css'
import Alert from '../Alert/Alert';
import Confirm from '../Confirm/Confirm';
import { taskReducer } from './taskReducer'


const TaskManagerReducer = () => {
    const nameInputRef = useRef(null)
    const [name, setName] = useState("")
    const [date, setDate] = useState("")
    const [description, setDescription] = useState("")
    const [tasks, setTasks] = useLocalStorage("tasks", [])

    const initialState = {
        tasks: tasks,
        taskID: null,
        isEditing: false,
        isAlertOpen: false,
        alertContent: "This is an alert",
        alertClass: "danger",
        isEditModalOpen: false,
        isDeleteModalOpen: false,
        modalTitle: "Delete Task",
        modalMsg: "You are about to delete this task",
        modalActionText: "Ok",
    }

    const [state, dispatch] = useReducer(taskReducer, initialState)

    useEffect(() => {
        nameInputRef.current.focus()
    },[])

    const closeAlert = () => {
        dispatch({
            type: "CLOSE_ALERT"
        })
    }

    const closeModal = () => {
        dispatch({
            type: "CLOSE_MODAL"
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !date || !description) {
            dispatch({
                type: "EMPTY_FIELD"
            })
        }

        if (name && date && description && state.isEditing) {
            const updatedTask = {
                id: state.taskID,
                name: name,
                date: date,
                description: description,
                complete: false
            }
            dispatch({
                type: "UPDATE_TASK",
                payload: updatedTask
            })
            setName("")
            setDate("")
            setDescription("")
            setTasks(
                tasks.map((task) => {
                    if (task.id ===updatedTask.id) {
                        return {
                            ...task,
                            name: name,
                            date: date,
                            description: description,
                            complete: false
                        }
                    }
                    return task
                })
            )
            return
        }

        if (name && date && description) {
            const newTask = {
                id: Date.now(),
                name: name,
                date: date,
                description: description,
                complete: false
            }
            dispatch({
                type: "ADD_TASK",
                payload: newTask
            })
            setName("")
            setDate("")
            setDescription("")
            setTasks([...tasks, newTask])
        }
        
    }

    const openEditModal = (id) => {
        dispatch({
            type: "OPEN_EDIT_MODAL",
            payload: id
        })
    }

    const editTask = () => {
        const id = state.taskID
        dispatch({
            type: "EDIT_TASK",
            payload: id
        })
        const thisTask = state.tasks.find((task) => task.id === id)
        setName(thisTask.name)
        setDate(thisTask.date)
        setDescription(thisTask.description)
        closeModal()
    }

    const openDeleteModal = (id) => {
        dispatch({
            type: "OPEN_DELETE_MODAL",
            payload: id
        })
    }

    const deleteTask = () => {
        const id = state.taskID
        dispatch({
            type: "DELETE_TASK",
            payload: id
        })
        const newTask = tasks.filter((task) => task.id !== id)
        setTasks(newTask)
    }

    const completeTask = (id) => {
        dispatch({
            type: "COMPLETE_TASK",
            payload: id
        })
        setTasks(
            tasks.map((task) => {
                if (task.id === id) {
                    return {...task, complete: true}
                }
                return task
            })
        )
    }

return (
<div className="--bg-primary">
    
    {state.isAlertOpen && 
    (<Alert 
    alertContent={state.alertContent} 
    alertClass={state.alertClass} 
    onCloseAlert={closeAlert}/>
    )}

    {state.isEditModalOpen && 
    (<Confirm 
    modalTitle={state.modalTitle} 
    modalMsg={state.modalMsg} 
    modalActionText={state.modalActionText} 
    modalAction={editTask} 
    onCloseModal={closeModal}/>)}

    {state.isDeleteModalOpen &&
    (<Confirm 
        modalTitle={state.modalTitle} 
        modalMsg={state.modalMsg} 
        modalActionText={state.modalActionText} 
        modalAction={deleteTask} 
        onCloseModal={closeModal}/>)
    }

    <h1 className="--text-center --text-light">Task Manager using Reducer</h1>
    <div className="--flex-center --p">
        <div className="--card --bg-light --width-500px --p --flex-center">
        <form onSubmit={handleSubmit} className="form --form-control">
            <div>
            {/* <label htmlFor="name">Task:</label> */}
            <input
                ref={nameInputRef}
                type="text"
                placeholder="Task title"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            </div>

            <div>
            {/* <label htmlFor="date">Date:</label> */}
            <input
                type="date"
                placeholder="Task date"
                name="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />
            </div>
            <div>
            {/* <label htmlFor="description">Description:</label> */}
            <textarea
                name='description' 
                placeholder='Task description' 
                rows={8}
                cols={35}
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
            >
            </textarea>
            </div>
            <button className="--btn --btn-success --btn-block">
            {state.isEditing ? "Edit Task" : "Save Task"}
            </button>
        </form>
        </div>
    </div>
      {/* Display Task */}

    <article className="--flex-center --my2">
        <div className="--width-500px --p">
        <h2 className="--text-light">Task List</h2>
        <hr style={{ background: "#fff" }} />
        {state.tasks.length === 0 ? (
            <p className="--text-light">No task added...</p>
        ) : (
            <div>
            {state.tasks.map((task) => {
                return (
                <Task
                    {...task}
                    editTask={openEditModal}
                    deleteTask={openDeleteModal}
                    completeTask={completeTask}
                />
                );
            })}
            </div>
        )}
        </div>
    </article>
</div>
)
}

export default TaskManagerReducer
