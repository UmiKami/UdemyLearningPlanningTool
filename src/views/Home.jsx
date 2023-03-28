import { useEffect, useState } from "react";
import RawTextBox from "../components/RawTextBox";
import ToDoList from "../components/ToDoList";

function App() {
    const [todoList, setTodoList] = useState(localStorage.getItem("todoList") ? JSON.parse(localStorage.getItem("todoList")) : []);

    const saveList = () => {
        localStorage.setItem("todoList", JSON.stringify(todoList));
    }

    const removeList = () => {
        localStorage.removeItem("todoList");
        localStorage.removeItem("rawText");
        setTodoList([]);
    }

    useEffect(() => {
        saveList();
    }, [todoList])

    return (
        <div className="App container" style={{ height: "100vh" }}>
            <h1 className="py-5 text-center" style={{ color: "#5624d0" }}>
                Udemy Lessons Planning
            </h1>
            <RawTextBox setTodoList={setTodoList} />
            <hr />
            <ToDoList
                todoList={todoList}
                setTodoList={setTodoList}
                saveList={saveList}
                removeList={removeList}
            />
        </div>
    );
}

export default App;
