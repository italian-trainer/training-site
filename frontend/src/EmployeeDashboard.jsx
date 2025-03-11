import React, { useEffect, useState } from "react";
import TrainingViewer from "./TrainingComponent";

const EmployeeDashboard = () => {
  const [trainings, setTrainings] = useState([]);
  const [loadedTraining, runTraining] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const response = await fetch(
          "http://localhost:5005/trainings/get_trainings",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch trainings");

        const data = await response.json();
        console.log("Data:", data.data);

        setTrainings(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching trainings:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchTrainings();
  }, []);
  return (
    <>
      <h1>Employee Dashboard</h1>
      {(!loadedTraining && (
        <section className="assigned-trainings">
          <h3>Assigned Trainings</h3>
          {loading ? (
            <p>Loading trainings...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : trainings.length > 0 ? (
            <div className="training-list">
              {trainings.map((training) => (
                <div key={training.id} className="training-card">
                  <h4 className="training-title">{training.training}</h4>
                  <p className="training-description"></p>
                  <p className="training-description">
                    {(training.complete && "Complete") || (
                      <>
                        {Math.floor(
                          (training.current_page / training.total_pages) * 100
                        ) + "% done"}
                        <br></br>
                        <button
                          onClick={() => {
                            runTraining(training);
                          }}
                        >
                          Run Training
                        </button>
                      </>
                    )}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>No trainings match your search.</p>
          )}
        </section>
      )) || (
        <>
          <TrainingViewer
            trainingName={loadedTraining.training}
            startPage={loadedTraining.current_page}
            maxPages={loadedTraining.total_pages}
          />
          <button
            onClick={() => {
              runTraining(null);
            }}
          >
            Go Back
          </button>
        </>
      )}
    </>
  );
};

export default EmployeeDashboard;
