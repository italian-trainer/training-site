import React, { useState, useEffect } from "react";

export default function QuizViewer({ quizName }) {
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Fetch quiz data from API
    const fetchQuiz = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch("http://localhost:5005/quiz/get_quiz", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token"),
                },
                body: JSON.stringify({ quiz:quizName })
            });

            const data = await response.json();
            if (response.ok) {
                setQuiz(data.data || {});
            } else {
                setError(data.message || "Error fetching quiz.");
            }
        } catch (err) {
            setError("Failed to fetch quiz.");
        }

        setLoading(false);
    };

    //get the quiz 
    useEffect(() => {
        if (quizName) fetchQuiz();
    }, [quizName]);

    return (
        <div className="quiz-viewer">
            <h2>Quiz: {quizName}</h2>

            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : quiz ? (
                <div className="quiz-content">
                    <h3>{quiz.title}</h3>
                    <p><strong>Description:</strong> {quiz.description || "No description provided."}</p>

                    <div className="questions-list">
                        {quiz.questions && quiz.questions.length > 0 ? (
                            quiz.questions.map((question, index) => (
                                <div key={index} className="question-card">
                                    <p><strong>Q{index + 1}: {question.question}</strong></p>
                                    <ul>
                                        {question.options.map((option, idx) => (
                                            <li key={idx}>{option}</li>
                                        ))}
                                    </ul>
                                    <p><strong>Answer:</strong> {question.answer}</p>
                                </div>
                            ))
                        ) : (
                            <p>No questions available.</p>
                        )}
                    </div>
                </div>
            ) : (
                <p>No quiz data available.</p>
            )}
        </div>
    );
}