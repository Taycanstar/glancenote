import Layout from "@/src/components/Layout";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { FiCompass } from "react-icons/fi";
import { useSelector } from "react-redux";

type Props = {};

type Message = {
  text: string;
  sender: "user" | "ai";
};

const Chat: React.FC = (props: Props) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };
  const userEmail = localStorage.getItem("userEmail");

  console.log(userEmail, "e");

  const handleSendMessage = async () => {
    if (message.trim()) {
      // Add the user's message to the chat
      setMessages((messages) => [
        ...messages,
        { text: message, sender: "user" },
      ]);

      try {
        // Send the message to the Django backend
        const response = await fetch("http://127.0.0.1:8000/api/openai-chat/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: message, email: userEmail }),
        });

        const data = await response.json();

        // Add the AI's response to the chat
        if (data && data.response) {
          setMessages((messages) => [
            ...messages,
            { text: data.response, sender: "ai" },
          ]);

          console.log("Received response:", data);
        } else {
          setMessages((messages) => [
            ...messages,
            { text: "No response from AI.", sender: "ai" },
          ]);
        }
      } catch (error) {
        console.error("Error:", error);
        console.error("Error:", error);
        setMessages((messages) => [
          ...messages,
          { text: "Error connecting to the server.", sender: "ai" },
        ]);
      }

      // Clear the input field
      setMessage("");
    }
  };

  return (
    <Layout>
      <div
        className="chat-screen"
        style={{
          position: "relative",
          height: "100vh",
          padding: "20px",

          paddingTop: "5rem",
        }}
      >
        {/* Chat messages area */}
        <div
          style={{
            overflowY: "auto",
            height: "calc(100% - 80px)", // Adjusted for header and input area
            padding: "10px",
            paddingLeft: "10px",
            paddingRight: "10px",
            borderRadius: "15px",
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center", // Ensure vertical alignment of items in flex container
                padding: "5px",
                userSelect: "text",
              }}
            >
              {msg.sender === "ai" && (
                <FiCompass size={24} style={{ marginRight: "10px" }} /> // Increased size and added margin
              )}
              {msg.sender === "user" && (
                <div
                  style={{ width: "30px", height: "30px", marginRight: "10px" }}
                />
              )}{" "}
              {/* Placeholder for alignment */}
              <span
                style={{
                  color: "black",
                  padding: "10px 15px",
                  maxWidth: "70%",
                  wordBreak: "break-word",
                  fontSize: "1.2rem",
                }}
              >
                {msg.text}
              </span>
            </div>
          ))}
        </div>

        {/* Chat input area */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "80%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px",
            backgroundColor: "#fff",
            borderRadius: "15px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <input
            type="text"
            value={message}
            onChange={handleTextChange}
            placeholder="Type a message..."
            style={{
              flexGrow: 1,
              marginRight: "10px",
              padding: "10px 20px",
              border: "none",
              borderRadius: "24px",
              outline: "none",
              fontSize: "1.2rem",
            }}
          />
          <button
            onClick={handleSendMessage}
            style={{
              padding: "10px 10px",
              border: "none",
              borderRadius: "12px",
              backgroundColor: "black",
              //   backgroundColor: "#007bff",
              color: "white",
              cursor: "pointer",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75"
              />
            </svg>
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
