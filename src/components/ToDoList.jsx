import { useState, useEffect } from "react";
import "../styles/ToDoList.css"
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";


const ToDoList = ({ todoList, setTodoList, saveList, removeList, courseList }) => {
    let tasks = todoList.lessons || []

    const [time, setTime] = useState(0)
    const [timeMode, setTimeMode] = useState("simple")
    const [course, setCourse] = useState(courseList[0]);
    const [changeName, setChangeName] = useState(false);

    let totalTime = 0

    function changeTime(tasks, course, totalTime) {
        tasks.forEach((task) => {
            if (task.course === course && !task.done) {
                totalTime += task.duration;
            }
        });
        return totalTime;
    }

    useEffect(() => {
        totalTime = 0;

        totalTime = changeTime(tasks, course, totalTime);

        console.log("Total time: " + totalTime + " mins");

        setTime(totalTime);
    }, [course, todoList])
    
    console.log("Time: " + time);

    const formatMinutesToHours = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours} h ${remainingMinutes}`;
    };

    const changeCurrentTaskStatus = (status, idx) => {
        setTodoList(state => {
            let newState = {...state}
            newState.lessons[idx].done = status
            totalTime = status ? time - newState.lessons[idx].duration : time + newState.lessons[idx].duration;
            setTime(totalTime);
            return newState
        })

        saveList()
    }

    const changeCourseName = (e, idx) => {
        e.preventDefault()
        console.log(e.target.courseName.value);
        

        // saveList()
    }

    useEffect(() => {
        let intervalID = setInterval(() => {
            if(time < totalTime){
                setTime(time => time + 1)
            }else if (time > totalTime){
                // setTime((time) => time - 1);

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
                            {time ? time : 0} mins
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
                                {time ? formatMinutesToHours(time) : 0} mins
                            </span>
                        )
                    )}
                </h4>
                <button
                    className="btn btn-danger"
                    onClick={() => removeList(course)}
                >
                    {" "}
                    Clear List{" "}
                </button>
            </div>

            <Tabs
                id="controlled-tab-example"
                activeKey={course}
                onSelect={(k) => setCourse(k)}
                onKeyDown={(e) => {
                    if(e.key = "F2"){
                        setChangeName(currentState => !currentState)
                    }else if(e.key = "Enter"){
                        setChangeName(false)
                    }
                }}
                className="mb-3"
            >
                {courseList.map((course, idx) => {
                    return (
                        <Tab eventKey={course} title={course} key={idx}>
                            <form onSubmit={(e)=>changeCourseName(e, idx)} className="mb-4" style={{height: changeName ? "inherit" : 0, overflow: "hidden"}}>
                                <label
                                    htmlFor="courseName"
                                    className="form-label"
                                >
                                    New Course Name:{" "}
                                </label>
                                <input
                                    type="text"
                                    name="courseName"
                                    id="courseName"
                                    className="form-control"
                                />
                            </form>

                            {tasks.length ? (
                                tasks.map((task, idx) => {
                                    return (
                                        task.course == course && (
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
                                                    htmlFor={
                                                        "lessonCheck" + idx
                                                    }
                                                >
                                                    {task.title}
                                                </label>
                                                <span
                                                    className={
                                                        !task.done
                                                            ? "badge bg-dark"
                                                            : "badge bg-success"
                                                    }
                                                >
                                                    {task.duration} mins
                                                </span>
                                            </div>
                                        )
                                    );
                                })
                            ) : (
                                <div className="alert alert-info" role="alert">
                                    No lessons added yet
                                </div>
                            )}
                        </Tab>
                    );
                })}
            </Tabs>
        </div>
    );
};

export default ToDoList;


