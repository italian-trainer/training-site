import React, { useState } from "react";
import "./CreateQuiz.css";

export default function CreateQuiz() {
    const [quizName, setQuizName] = useState("");
    const [description, setDescription] = useState("");
    const [questions, setQuestions] = useState([{ question: "", options: "", answer: "" }]);
    const [message, setMessage] = useState("");

    //changes in individual questions
    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index][field] = value;
        setQuestions(updatedQuestions);
    };

    //add a new question field
    const addQuestion = () => {
        setQuestions([...questions, { question: "", options: "", answer: "" }]);
    };

    //remove a question field
    const removeQuestion = (index) => {
        const updatedQuestions = [...questions];
        updatedQuestions.splice(index, 1);
        setQuestions(updatedQuestions);
    };

    //form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!quizName.trim() || !description.trim()) {
            setMessage("Error: Quiz name and description cannot be empty.");
            return;
        }

        //validate and format questions
        const formattedQuestions = [];
        for (let i = 0; i < questions.length; i++) {
            const { question, options, answer } = questions[i];

            if (!question.trim() || !options.trim() || !answer.trim()) {
                setMessage('Error: All fields must be filled for question');
                return;
            }

            const optionsArray = options.split(",").map(opt => opt.trim());

            if (!optionsArray.includes(answer.trim())) {
                setMessage('Error: Correct answer must be one of the options for question.');
                return;
            }

            formattedQuestions.push({
                question: question.trim(),
                options: optionsArray,
                answer: answer.trim()
            });
        }

        //get api response
        try {
            const response = await fetch("http://localhost:5005/quiz/add_quiz", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "*/*",
                    "Connection": "keep-alive"
                },
                body: JSON.stringify({ 
                    title: quizName, 
                    description, 
                    questions: formattedQuestions
                })
            });

            const data = await response.json();
            console.log("Response:", response);
            console.log("Data:", data.data);

            if (response.ok) {
                setMessage('Quiz created successfully!');
                setQuizName("");
                setDescription("");
                setQuestions([{ question: "", options: "", answer: "" }]);
            } else {
                setMessage('Error: Unable to create quiz');
            }
        } catch (error) {
            setMessage("Request failed: " + error.message);
        }
    };

    return (
        <div className="create-quiz-container">
            <h2>Create Quiz</h2>
            <form className="create-quiz-form" onSubmit={handleSubmit}>
                
                {/* For the quiz name */}
                <div>
                    <label>Quiz Name:</label>
                    <input 
                        type="text" 
                        placeholder="Enter quiz name" 
                        value={quizName}
                        onChange={(e) => setQuizName(e.target.value)}
                        required 
                    />
                </div>

                {/* for the description */}
                <div>
                    <label>Description:</label>
                    <textarea
                        placeholder="Brief quiz description" 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required 
                    />
                </div>

                {/* select questions */}
                <div className="questions-section">
                    <h3>Questions</h3>
                    {questions.map((q, index) => (
                        <div key={index} className="question-item">
                            <label>Question {index + 1}:</label>
                            <input 
                                type="text" 
                                placeholder="Enter question"
                                value={q.question}
                                onChange={(e) => handleQuestionChange(index, "question", e.target.value)}
                                required
                            />

                            <label>Options (comma-separated):</label>
                            <input 
                                type="text" 
                                placeholder="Enter answer choices"
                                value={q.options}
                                onChange={(e) => handleQuestionChange(index, "options", e.target.value)}
                                required
                            />

                            <label>Correct Answer:</label>
                            <input 
                                type="text" 
                                placeholder="Enter correct answer"
                                value={q.answer}
                                onChange={(e) => handleQuestionChange(index, "answer", e.target.value)}
                                required
                            />

                            {/* remove question button */}
                            {questions.length > 1 && (
                                <button type="button" className="remove-question" onClick={() => removeQuestion(index)}>Remove</button>
                            )}
                        </div>
                    ))}

                    {/* add question button */}
                    <button type="button" className="add-question" onClick={addQuestion}>+ Add Question</button>
                </div>

                <button type="submit">Create Quiz</button>
            </form>
            <p>{message}</p>
        </div>
    );
}