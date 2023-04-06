import { useEffect, useState } from "react";
import RawTextBox from "../components/RawTextBox";
import ToDoList from "../components/ToDoList";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function App() {
    const [todoList, setTodoList] = useState(
        localStorage.getItem("todoList")
            ? JSON.parse(localStorage.getItem("todoList"))
            : []
    );
    const [requestCourses, setRequestCourses] = useState(false);
    const [courseName, setCourseName] = useState("");
    const [courseList, setCourseList] = useState(
        localStorage.getItem("courseList")
            ? JSON.parse(localStorage.getItem("courseList"))
            : []
    );

    const saveList = () => {
        localStorage.setItem("todoList", JSON.stringify(todoList));
    };

    const removeList = (courseName) => {
        console.log(todoList);
        console.log("course list to delete: ", courseName);
        let newList = todoList.lessons.filter((item) => item.course !== courseName);

        localStorage.removeItem("rawText");

        setTodoList({ lessons: newList });
    };

    useEffect(() => {
        saveList();
    }, [todoList]);

    useEffect(() => {
        if (!localStorage.getItem("courseList")) {
            setRequestCourses(true);
        }
    }, []);

    const saveCourses = (courseName, operation) => {
        if (courseName && operation === "new") {
            let formattedCourseName = courseName.replace(
                /^(?=\n)$|^\s*|\s*$|\n\n+/gm,
                ""
            );

            const courseList = formattedCourseName.split("\n");

            if (courseList[0] === "") {
                courseList.shift();
            }

            localStorage.setItem("courseList", JSON.stringify(courseList));
            setRequestCourses(false);
            setCourseList(courseList);
        }else if(operation == "add"){
            let formattedCourseName = courseName.replace(
                /^(?=\n)$|^\s*|\s*$|\n\n+/gm,
                ""
            );

            const currentCourseList = formattedCourseName.split("\n");

            if (courseList[0] === "") {
                courseList.shift();
            }

            let newList = [...courseList, ...currentCourseList];
            localStorage.setItem("courseList", JSON.stringify(newList));
            setCourseList(newList);

            return true
        }
    };

    return (
        <div className="App container" style={{ height: "100vh" }}>
            <h1 className="py-5 text-center" style={{ color: "#5624d0" }}>
                Udemy Lessons Planning
            </h1>
            <RawTextBox
                setTodoList={setTodoList}
                courseList={courseList}
                saveCourses={saveCourses}
            />
            <hr />
            <Modal
                show={requestCourses}
                onHide={() => setRequestCourses(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Add courses</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Note: Separate the name of the courses by lines</p>
                    <textarea
                        required
                        className="form-control"
                        id="exampleFormControlTextarea1"
                        rows="6"
                        value={courseName}
                        onChange={(e) => {
                            setCourseName(e.target.value);
                        }}
                        style={{ resize: "none" }}
                    ></textarea>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setRequestCourses(false)}
                    >
                        Close
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => saveCourses(courseName,  "new")}
                    >
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
            <ToDoList
                todoList={todoList}
                setTodoList={setTodoList}
                saveList={saveList}
                removeList={removeList}
                courseList={courseList}
            />
        </div>
    );
}

export default App;
