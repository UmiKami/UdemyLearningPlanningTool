import { useState, useEffect } from "react";
import "../styles/ToDoList.css"

const ToDoList = ({ todoList, setTodoList, saveList, removeList }) => {
    let tasks = todoList.lessons || []

    const [time, setTime] = useState(0)
    const [timeMode, setTimeMode] = useState("simple")

    const formatMinutesToHours = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours} h ${remainingMinutes}`;
    };

    const changeCurrentTaskStatus = (status, idx) => {
        setTodoList(state => {
            let newState = {...state}
            newState.lessons[idx].done = status
            newState.totalTime = status ? newState.totalTime - newState.lessons[idx].duration : newState.totalTime + newState.lessons[idx].duration;
            setTime(newState.totalTime);
            return newState
        })

        saveList()
    }

    useEffect(() => {
        let intervalID = setInterval(() => {
            if(time < todoList.totalTime){
                setTime(time => time + 1)
            }else if (time > todoList.totalTime){
                setTime((time) => time - 1);

            }else{
                return;
            }
        }, 10)

        console.log(time);

        return () => clearInterval(intervalID)
    }, [todoList, time])

    return (
        <div className="py-3">
            <div className="mb-4 d-flex justify-content-between align-items-center">
                <h4>
                    Total Time:{" "}
                    {timeMode == "simple" ? (
                        <span
                            role="button"
                            className={
                                time <= 0
                                    ? "text-danger"
                                    : "text-success number-change text-decoration-underline"
                            }
                            onClick={() => setTimeMode("complex")}
                        >
                            {todoList.totalTime ? time : 0} mins
                        </span>
                    ) : (
                        timeMode == "complex" && (
                            <span
                                role="button"
                                className={
                                    time <= 0
                                        ? "text-danger"
                                        : "text-success number-change text-decoration-underline"
                                }
                                onClick={() => setTimeMode("simple")}
                            >
                                {todoList.totalTime
                                    ? formatMinutesToHours(time)
                                    : 0}{" "}
                                mins
                            </span>
                        )
                    )}
                </h4>
                <button className="btn btn-danger" onClick={removeList}>
                    {" "}
                    Clear List{" "}
                </button>
            </div>

            {tasks.length ? (
                tasks.map((task, idx) => {
                    return (
                        <div
                            className={
                                task.done
                                    ? "alert alert-success d-flex align-items-center gap-3"
                                    : "alert alert-dark d-flex align-items-center gap-3"
                            }
                            role="alert"
                            key={idx}
                        >
                            <input
                                className="form-check-input"
                                type="checkbox"
                                value={task.title}
                                id={"lessonCheck" + idx}
                                onChange={(e) => {
                                    changeCurrentTaskStatus(
                                        e.target.checked,
                                        idx
                                    );
                                }}
                                checked={task.done}
                            />
                            <label
                                className="form-check-label"
                                for={"lessonCheck" + idx}
                            >
                                {task.title} | {task.duration} mins
                            </label>
                        </div>
                    );
                })
            ) : (
                <div className="alert alert-danger" role="alert">
                    No tasks to show
                </div>
            )}
        </div>
    );
};

export default ToDoList;
