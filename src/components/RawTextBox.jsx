import axios from "axios";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "../styles/RawTextBox.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import tutorial from "../assets/tutorial.mp4";

const RawTextBox = ({ setTodoList, courseList, saveCourses }) => {
    const [rawText, setRawText] = useState(
        localStorage.getItem("rawText") || ""
    );

    const [displayHelp, setDisplayHelp] = useState(false);

    const [selectedCourse, setSelectedCourse] = useState(courseList[0]);
    const [courseName, setCourseName] = useState("");
    const [requestCourses, setRequestCourses] = useState(false);
    const [openVideo, setOpenVideo] = useState(false);


    console.log(selectedCourse);
    
    const handlePromptSubmit = (e) => {
        e.preventDefault();
        
        let rawTextWithRemovedEmptyLines = rawText.replace(
            /^(?=\n)$|^\s*|\s*$|\n\n+/gm,
            ""
        );

        const lessons = [];

        let totalTime = 0;

        const lines = rawTextWithRemovedEmptyLines.split("\n");
        for (let i = 0; i < lines.length; i++) {
            const titleLine = lines[i];
            const titleRegex = /^\d{1,3}\..+/;

            if (titleRegex.test(titleLine)) {
                const durationLine = lines[++i];
                const durationRegex = /^\d{1,3}min$/;

                if (durationRegex.test(durationLine)) {
                    const duration = parseInt(durationLine);
                    lessons.push({ title: titleLine, duration, done: false, course: selectedCourse });
                    totalTime += duration;
                } else {
                    throw new Error(
                        `Invalid duration format at line ${
                            i + 1
                        }: ${durationLine}`
                    );
                }
            } else if (titleLine.trim().toLowerCase() !== "play") {
                throw new Error(
                    `Invalid title format at line ${i + 1}: ${titleLine}`
                );
            }
        }

        let newList = JSON.parse(localStorage.getItem("todoList")).lessons || [];
        newList = newList.filter((item) => item.course !== selectedCourse);
        newList = [...newList, ...lessons];

        

        setTodoList({
            lessons: newList
        });
        localStorage.setItem("rawText", rawTextWithRemovedEmptyLines);
    };

    return (
        <div className="mb-5">
            <form className="mb-3" onSubmit={handlePromptSubmit}>
                <label for="exampleFormControlTextarea1" className="form-label">
                    Copy and paste the information about of the lessons you want
                    to do here:
                </label>
                <div
                    className="text-area-container"
                    onMouseOver={() => setDisplayHelp(true)}
                    onMouseLeave={() => setDisplayHelp(false)}
                >
                    <textarea
                        required
                        className="form-control"
                        id="exampleFormControlTextarea1"
                        rows="6"
                        value={rawText}
                        onChange={(e) => {
                            setRawText(e.target.value);
                        }}
                        style={{ resize: "none" }}
                    ></textarea>
                    <span
                        className="tutorial-prompt d-flex align-items-center gap-1"
                        style={{ opacity: displayHelp ? 1 : 0 }}
                        onClick={() => setOpenVideo(true)}
                    >
                        <FontAwesomeIcon icon={faCircleInfo} /> Watch Tutorial
                    </span>
                </div>
                <select
                    className="form-select mt-4"
                    aria-label="Default select example"
                    required
                    onChange={(e) => setSelectedCourse(e.target.value)}
                >
                    {courseList.map((course, index) => {
                        return <option value={course}>{course}</option>;
                    })}
                </select>
                <button type="submit" className="btn btn-success mt-3 me-2">
                    Create List
                </button>
                <button
                    type="submit"
                    className="btn btn-primary mt-3"
                    onClick={() => setRequestCourses(true)}
                >
                    Add Course
                </button>
                <Modal
                    show={openVideo}
                    onHide={() => setOpenVideo(false)}
                    size="xl"
                >
                    <Modal.Header closeButton>
                        <Modal.Title style={{textTransform: "capitalize"}}>How to use this page</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <video src={tutorial} className="col-12" controls></video>
                    </Modal.Body>
                </Modal>

                <Modal
                    show={requestCourses}
                    onHide={() => setRequestCourses(false)}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Add additinal courses</Modal.Title>
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
                            onClick={() => {
                                let hasUpdatedResources = saveCourses(
                                    courseName,
                                    "add"
                                );
                                if (hasUpdatedResources)
                                    setRequestCourses(false);
                            }}
                        >
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </form>
        </div>
    );
};

export default RawTextBox;
