import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { backend_url } from "./config";
import "./Messages.css";
import { decode } from "html-entities";

function LoadMessage({ openMessage }) {
  const [message, setMessage] = useState(null);
  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch(backend_url + "/messages/" + openMessage, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });

        if (!response.ok) throw new Error("Failed to fetch message");
        console.log(response);
        const data = await response.json();
        console.log(data);
        console.log("message loaded:");
        console.log(data.data);
        setMessage(data.data);
      } catch (error) {
        console.error("Error fetching message:", error);
      }
    };

    fetchMessage();
  }, []);
  return (
    message && (
      <div>
        <div class="message-header">
          From: {message.sender.first_name + " " + message.sender.last_name}
          Subject: {message.subject}
          Type: {message.type}
        </div>
        <div class="message-contents">{message.contents}</div>
      </div>
    )
  );
}

export default function Messages() {
  // State for toggling the account dropdown
  const [showDropdown, setShowDropdown] = useState(false);
  const [openMessage, setOpenMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Toggle the dropdown menu
  const handleAccountClick = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(backend_url + "/messages/get_messages", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });

        if (!response.ok) throw new Error("Failed to fetch messages");
        const data = await response.json();
        setMessages(data.data);
        console.log(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);
  return (
    <div className="messages-container">
      {/* HEADER */}
      <header className="dashboard-header">
        <div className="brand">
          <h1>Maria's Italian</h1>
        </div>
        <div className="account-section">
          <button className="account-button" onClick={handleAccountClick}>
            Account
          </button>
          {showDropdown && (
            <div className="account-dropdown">
              <ul>
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
                <li>
                  <Link to="/messages">Messages</Link>
                </li>
                <li>
                  <Link to="/login">Log Out</Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="messages-main">
        <h2>Messages</h2>

        {/* SEARCH BAR */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search messages..."
            aria-label="Search Messages"
          />
        </div>

        {/* ASSIGNED TRAININGS SECTION */}
        <section className="messages">
          {loading ? (
            <div>Loading...</div>
          ) : openMessage == "" ? (
            <>
              {messages.length > 0 && (
                <table border={1}>
                  <tr>
                    <th>Sender</th>
                    <th>Subject</th>
                    <th>Type</th>
                  </tr>
                  {messages.map((message) => (
                    <tr
                      onClick={() => setOpenMessage(message._id)}
                      key={message._id}
                    >
                      <td>
                        {decode(message.sender.first_name) +
                          " " +
                          decode(message.sender.last_name)}
                      </td>
                      <td>{decode(message.subject)}</td>
                      <td>{decode(message.type)}</td>
                    </tr>
                  ))}
                </table>
              )}
            </>
          ) : (
            <LoadMessage openMessage={openMessage} />
          )}
        </section>

        {/* ACTION BUTTONS */}
        <div className="actions">
          <Link to="/addEmployee">
            <button className="addEmployee">+ Add Employee</button>
          </Link>
          <button className="create-training-btn">+ Create Training</button>
        </div>
      </main>
    </div>
  );
}
