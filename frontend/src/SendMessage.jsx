import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./SendMessage.css";

function UserDropdown({ setReceiver }) {
  const [employees, setEmployees] = useState([]); //employees
  const [loading, setLoading] = useState(true);

  //Employee Roster
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(
          "http://localhost:5005/roster/get_all_users",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch employee data");

        const data = await response.json();
        console.log(data);

        //filter out users where user_id === email
        const filteredEmployees = data.data.filter(
          (employee) => employee.user_id !== employee.email
        );

        setEmployees(filteredEmployees);
        console.log(filteredEmployees);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);
  console.log(employees[0]);
  return (
    !loading && (
      <select name="receiver" onChange={(e) => setReceiver(e.target.value)}>
        {employees.map((entry) => (
          <option key={entry._id} value={entry._id}>
            {entry.first_name + " " + entry.last_name}
          </option>
        ))}
      </select>
    )
  );
}

export default function SendMessage() {
  const [message, setMessage] = useState("");
  const [receiver, setReceiver] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    //make sure inputs are not empty
    if (!subject.trim() || !content.trim()) {
      setMessage("Error: Subject and content cannot be empty.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5005/messages/send_message",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            Connection: "keep-alive",
          },
          body: JSON.stringify({
            receiver,
            subject,
            content,
          }),
        }
      );

      console.log(localStorage.getItem("token"));
      const data = await response.json();
      console.log("Response:", response);
      console.log("Data:", data.data);
      console.log(response.message);

      if (response.ok) {
        setMessage("Message sent successfully!");
        setReceiver("");
        setSubject("");
        setContent("");
      } else {
        setMessage("Error: Unable to send message");
      }
    } catch (error) {
      setMessage("Request failed: " + error.message);
    }
  };

  return (
    <div className="send-message-container">
      <div className="actions">
        <Link to="/messages">
          <button className="back">Go Back to Messages</button>
        </Link>
      </div>
      <h2>Send Message</h2>
      <form className="send-message-form" onSubmit={handleSubmit}>
        <div>
          <label>Receiver:</label>
          <UserDropdown setReceiver={setReceiver} />
        </div>
        <div>
          <label>Subject:</label>
          <textarea
            placeholder="Message subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Content:</label>
          <textarea
            placeholder="Enter message content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <button type="submit">Send Message</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
