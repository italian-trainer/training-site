import React, { useState, useEffect } from "react";

export default function TrainingViewer({ trainingName, startPage = 0 }) {
    const [page, setPage] = useState(startPage);
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
                    "Authorization": "Bearer " + localStorage.getItem("token"),
                },
                body: JSON.stringify({ trainingName, startPage })
            });

            const data = await response.json();
            if (response.ok) {
                setContent(data.body || "No content available.");
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
            <h2>{trainingName} - Page {page + 1}</h2>

            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
                <p className="page-content">{content}</p>
            )}

            <div className="navigation-buttons">
                <button onClick={handlePrev} disabled={page === 0}>Back</button>
                <button onClick={handleNext}>Next</button>
            </div>
        </div>
    );
}