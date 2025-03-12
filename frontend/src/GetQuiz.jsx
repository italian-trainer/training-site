import React, { useState, useEffect } from "react";

export default function QuizViewer({ quizName, trainingName }) {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");

  // get quiz data 
  const fetchQuiz = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5005/quiz/get_quiz", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ quiz: quizName }),
      });

      const data = await response.json();
      console.log("Fetched Quiz:", data.data);
      if (response.ok) {
        setQuiz(data.data[0] || {});
      } else {
        setError(data.message || "Error fetching quiz.");
      }
    } catch (err) {
      setError("Failed to fetch quiz.");
    }

    setLoading(false);
  };

  //answer selection
  const handleAnswerSelect = (questionIndex, option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: option,
    }));
  };

  //send answers to api
  const handleSubmit = async () => {
    setSubmitted(true);

    const formattedAnswers = Object.keys(selectedAnswers).map((index) => (
    selectedAnswers[index]
    ));
    try {
      console.log(JSON.stringify({
        training: trainingName,
        quiz: quizName,
        filled_form: formattedAnswers,
      }));

      const response = await fetch("http://localhost:5005/trainings/submit_quiz", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          training: trainingName,
          quiz: quizName,
          filled_form: formattedAnswers,
        }),
      });

      const data = await response.json();
      console.log("Submission Response:", data);

      if (response.ok) {
        alert("Quiz submitted successfully!");
        setMessage(data.message);
      } else {
        alert('Error: Unable to submit quiz');
      }
    } catch (error) {
      alert("Request failed: " + error.message);
    }
  };

  //get the quiz from component
  useEffect(() => {
    if (quizName) fetchQuiz();
  }, [quizName]);

  return (
    <div className="quiz-viewer">

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : quiz ? (
        <div className="quiz-content">
          <h3>{quiz.title}</h3>
          <p>
            <strong>Description:</strong>{" "}
            {quiz.description || "No description provided."}
          </p>

          <div className="questions-list">
            {quiz.questions && quiz.questions.length > 0 ? (
              quiz.questions.map((question, index) => (
                <div key={index} className="question-card">
                  <p>
                    <strong>
                      Q{index + 1}: {question.question}
                    </strong>
                  </p>
                  <ul>
                    {question.options.map((option, idx) => (
                      <li key={idx}>
                        <label>
                          <input
                            type="radio"
                            name={`question-${index}`}
                            value={option}
                            checked={selectedAnswers[index] === option}
                            onChange={() => handleAnswerSelect(index, option)}
                            disabled={submitted}
                          />
                          {option}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p>No questions available.</p>
            )}
          </div>

          {/* submit */}
          {!submitted ? (
            <button onClick={handleSubmit} className="submit-quiz-btn">
              Submit Quiz
            </button>
          ) : (
            <>
            <p className="submitted-message">Quiz Submitted!</p>
            {message && <p className="quiz-message">{message}</p>}
            </>
          )}
        </div>
      ) : (
        <p>No quiz data available.</p>
      )}
    </div>
  );
}