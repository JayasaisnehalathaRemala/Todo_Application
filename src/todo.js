import { useReducer, useState, useEffect } from "react";
import "./todo.css";

function ReducerFunction(state, action) {
  switch (action.type) {
    case "SET_TODOS":
      return {
        todo: action.payload,
      };
    case "ADD_VALUE":
      return {
        todo: [
          ...state.todo,
          {
            id: state.todo.length + 1,
            title: action.payload,
            completed: false,
          },
        ],
      };
    case "EDIT_VALUE":
      const { task, editValue } = action.payload;
      const updatedone = state.todo.map((tasks) => {
        if (tasks === task) {
          return { ...tasks, title: editValue };
        }
        return tasks;
      });
      return { todo: updatedone };
    case "ALL_COMPLETE":
      const allCompleted = state.todo.map((task) => ({
        ...task,
        completed: !state.todo.every((t) => t.completed),
      }));
      return { todo: allCompleted };
    case "DELETE_ALL":
      return { ...state, todo: [] };
    case "MARK_COMPLETE":
      const updatedmark = state.todo.map((task) =>
        task.id === action.payload.id
          ? {
              ...task,
              completed: !task.completed,
            }
          : task
      );
      return { todo: updatedmark };
    case "DELETE_VALUE":
      return { todo: action.payload };
    default:
      return state;
  }
}

const UseReducerState = () => {
  const [inputValue, setInputValue] = useState("");
  const initialValue = {
    todo: [],
  };
  const [currentValue, dispatch] = useReducer(ReducerFunction, initialValue);

  useEffect(() => {

    fetch("https://jsonplaceholder.typicode.com/users/1/todos")
      .then((response) => response.json())
      .then((todos) => {
        dispatch({ type: "SET_TODOS", payload: todos });
      })
      .catch((error) => console.error("Error fetching todos:", error));
  }, []); 

  const handleAdd = () => {
    if (inputValue.trim() !== "") {
      dispatch({
        type: "ADD_VALUE",
        payload: inputValue,
      });
      setInputValue("");
    } else {
      alert("Empty values cannot be added");
    }
  };

  const handleall = () => {
    dispatch({
      type: "ALL_COMPLETE",
    });
  };

  const handledelete = (event) => {
    const updated = currentValue.todo.filter((val) => {
      return val !== event;
    });
    dispatch({
      type: "DELETE_VALUE",
      payload: updated,
    });
  };

  const handleEditt = (task) => {
    const editValue = prompt("Enter the new value", task.title);
    if (editValue !== null && editValue.trim() !== "") {
      dispatch({
        type: "EDIT_VALUE",
        payload: { editValue, task },
      });
    } else {
      alert("Empty value cannot be added");
    }
  };

  const handlecomplete = (task) => {
    dispatch({
      type: "MARK_COMPLETE",
      payload: task,
    });
  };

  return (
    <>
      <h1>Todo list</h1>
      <input
        type="text"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value || "")}
      />
      <button onClick={handleAdd}>Add</button>
      <button onClick={handleall}>All Complete</button>
      <h2>tasks:</h2>
      <div>
        {currentValue.todo.map((task) => (
          <p key={task.id}>
            <span
              style={{
                textDecoration: task.completed ? "line-through" : "none",
              }}
            >
              {task.title}
            </span>{" "}
            <button onClick={() => handleEditt(task)}>Edit</button>
            <button onClick={() => handledelete(task)}>Delete</button>
            <button onClick={() => handlecomplete(task)}>
              {task.completed ? "Completed" : "Incomplete"}
            </button>
          </p>
        ))}
      </div>
    </>
  );
};

export default UseReducerState;
