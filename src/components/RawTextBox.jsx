import axios from "axios";
import { useState } from "react";

const RawTextBox = ({ setTodoList }) => {
    const [rawText, setRawText] = useState(
        localStorage.getItem("rawText") || ""
    );

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
                    lessons.push({ title: titleLine, duration, done: false });
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

        setTodoList({
            lessons,
            totalTime,
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
                <textarea
                    className="form-control"
                    id="exampleFormControlTextarea1"
                    rows="6"
                    value={rawText}
                    onChange={(e) =>{
                        
                        setRawText(e.target.value)
                    }}
                    style={{ resize: "none" }}
                ></textarea>
                <button type="submit" className="btn btn-success mt-3">
                    Create List
                </button>
            </form>
        </div>
    );
};

export default RawTextBox;
