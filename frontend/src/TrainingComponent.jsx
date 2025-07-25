import React, { useRef, useState, useEffect } from "react";
import QuizViewer from "./GetQuiz";

export default function TrainingViewer({
  trainingName,
  startPage,
  maxPages,
  quiz,
}) {
  const [page, setPage] = useState(startPage);
  const [type, setType] = useState("html");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch training page from API
  const fetchPage = async (pageNumber) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5005/trainings/get_page", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ training: trainingName, page }),
      });

      const data = await response.json();
      setType(data.data.type);
      if (response.ok) {
        setContent(data.data.body || "No content available.");
      } else {
        setError(data.message || "Error fetching training page.");
      }
    } catch (err) {
      setError("Failed to fetch training page.");
    }

    setLoading(false);
  };

  //call function
  useEffect(() => {
    fetchPage(page);
  }, [page, trainingName]);


  //navigation
  const handleNext = () => setPage((prev) => prev + 1);
  const handlePrev = () => setPage((prev) => (prev > 0 ? prev - 1 : 0));

  return (
    <div className="training-viewer">
      <h2>
        {trainingName} - Page {page + 1}
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : type == "html" ? (
        <div dangerouslySetInnerHTML={{__html:content}} />
      ) : (
        <QuizViewer quizName={quiz} trainingName={trainingName} />
      )}

      <div className="navigation-buttons">
        <button onClick={handlePrev} disabled={page === 0}>
          Back
        </button>
        <button onClick={handleNext} disabled={page === maxPages}>
          Next
        </button>
      </div>
    </div>
  );
}
