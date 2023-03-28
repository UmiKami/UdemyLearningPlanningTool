import axios from "axios";
import { useState } from "react";


const RawTextBox = ({ setTodoList }) => {
    const [rawText, setRawText] = useState(localStorage.getItem("rawText") || "");

    let prompt = `Create a JSON object which contains the following keys:

lessons, totalTime

lessons is an array of objects. Each object inside the array contains a title (with its original numbering), a duration in minutes, and a done key with a value of false.

totalTime, is the sum of the durations of all the given lessons.


Use this text to create the JSON object based on the previous specifications:\n`;

    const handlePromptSubmit = (e) => {
        e.preventDefault()

        axios
            .post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: "gpt-3.5-turbo",
                    messages: [{role: 'user', content: prompt + rawText}],
                    max_tokens: 300,
                    temperature: 0,
                    top_p: 1,
                    n: 1,
                    stream: false,
                },
                {
                    headers: {
                        Authorization: `Bearer ${
                            import.meta.env.VITE_OPENAI_API_KEY
                        }`,
                    },
                }
            )
            .then((res) => {
                
                let lessonList = JSON.parse(res.data.choices[0].message.content)
                
                console.log(lessonList);

                setTodoList(lessonList);
                localStorage.setItem("rawText", rawText);
            })
            .catch((err) => {
                console.log(err);
            });

    }


    return (
        <div className="mb-5">
    
            <form className="mb-3" onSubmit={handlePromptSubmit}>
                <label for="exampleFormControlTextarea1" className="form-label">
                    Copy and paste the information about of the lessons you want to
                do here:
                </label>
                <textarea
                    className="form-control"
                    id="exampleFormControlTextarea1"
                    rows="6"
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    style={{resize: "none"}}
                ></textarea>
                <button type="submit" className="btn btn-success mt-3">Create List</button>
            </form>
        </div>
    );
};

export default RawTextBox;
