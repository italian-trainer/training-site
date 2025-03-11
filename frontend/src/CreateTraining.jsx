import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./CreateTraining.css";

export default function CreateTraining() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [pages, setPages] = useState("");
    const [quiz, setQuiz] = useState("");
    const [message, setMessage] = useState(""); 

    const handleSubmit = async (e) => {
        e.preventDefault();

        //make sure inputs are not empty
        if (!title.trim() || !description.trim()) {
            setMessage("Error: Title and description cannot be empty.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5005/trainings/create_training", {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
                "Accept": "*/*",
                "Connection": "keep-alive"
              },
              body: JSON.stringify({ 
                title, 
                description, 
                pages: pages.split("\n").map(page => page.trim()).filter(page => page), // Convert text input to array
                quiz
              })
            });

            console.log(localStorage.getItem("token"));
            const data = await response.json();
            console.log("Response:", response);
            console.log("Data:", data.data);
            console.log(response.message);
            console.log(JSON.stringify({ 
                title, 
                description, 
                pages: pages.split("\n").map(page => page.trim()).filter(page => page), //text to array
                quiz
              }))

            if (response.ok) {
                setMessage('Training created successfully!');
                setTitle("");
                setDescription("");
                setPages("");
                setQuiz("");
            } else {
                setMessage('Error: Unable to create training');
            }
        } catch (error) {
            setMessage("Request failed: " + error.message);
        }
    };

    return (
        <div className="create-training-container">
            <h2>Create Training</h2>
            <form className="create-training-form" onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input 
                        type="text" 
                        placeholder="Training Title" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required 
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        placeholder="Brief training description" 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required 
                    />
                </div>
                <div>
                    <label>Training Pages (one per line):</label>
                    <textarea
                        placeholder="Enter each page content on a new line"
                        value={pages}
                        onChange={(e) => setPages(e.target.value)}
                    />
                </div>
                <div>
                    <label>Quiz:</label>
                    <input 
                        type="text" 
                        placeholder="Quiz content"
                        value={quiz}
                        onChange={(e) => setQuiz(e.target.value)}
                    />
                </div>

                <button type="submit">Create Training</button>
            </form>
            <p>{message}</p>
        </div>
    );
}