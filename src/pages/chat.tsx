import React, {
  useState,
  useEffect,
  ChangeEvent,
  useRef,
  KeyboardEvent,
} from "react";
import { FiArrowDown, FiCompass } from "react-icons/fi";
import Layout from "@/src/components/Layout";
import { useSelector, useDispatch } from "react-redux";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

type Props = {};

type Message = {
  text: string;
  sender: "user" | "ai";
};

const Chat: React.FC<Props> = () => {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const loggedIn = useSelector((state: any) => state.user.isLoggedIn);

  console.log(loggedIn, "ssss");

  const userEmail =
    typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const isAtBottom =
        messagesContainerRef.current.scrollHeight -
          messagesContainerRef.current.scrollTop <=
        messagesContainerRef.current.clientHeight + 50; // Adjust the threshold as needed
      setShowScrollToBottom(!isAtBottom);
    }
  };

  const scrollToBottom = () => {
    messagesContainerRef.current?.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      setIsLoading(true);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, sender: "user" },
      ]);
      setMessage("");

      try {
        const response = await fetch("http://127.0.0.1:8000/api/openai-chat/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: message, email: userEmail }),
        });

        const data = await response.json();

        setIsLoading(false);
        if (data && data.response) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: data.response, sender: "ai" },
          ]);
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: "No response from AI.", sender: "ai" },
          ]);
        }
      } catch (error) {
        console.error("Error:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Error connecting to the server.", sender: "ai" },
        ]);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    // Scroll logic
    const messagesContainer = messagesContainerRef.current;
    if (messagesContainer) {
      messagesContainer.addEventListener("scroll", handleScroll);
      return () =>
        messagesContainer.removeEventListener("scroll", handleScroll);
    }
  }, []);

  useEffect(() => {
    scrollToBottom(); // Scroll to bottom when new messages are added
  }, [messages]);

  useEffect(() => {
    // Check if token exists
    if (!loggedIn) {
      // If token doesn't exist, redirect to login
      router.push("/auth/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn]);

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
        <div
          ref={messagesContainerRef}
          style={{
            overflowY: "auto",
            height: "calc(100% - 80px)",
            padding: "10px",
            borderRadius: "15px",
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "flex-start",
                padding: "5px",
                userSelect: "text",
              }}
            >
              {msg.sender === "ai" && (
                <FiCompass
                  size={24}
                  style={{ marginRight: "10px", marginTop: "15px" }}
                />
              )}
              {msg.sender === "user" && (
                <div
                  style={{ width: "30px", height: "30px", marginRight: "10px" }}
                />
              )}
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

          {showScrollToBottom && (
            <button
              onClick={scrollToBottom}
              style={{
                position: "absolute",
                right: "50%",
                bottom: "125px",
                transform: "translateX(50%)",
                backgroundColor: "white",
                border: "0.5px solid lightgray",
                borderRadius: "50%",
                cursor: "pointer",
                padding: "3px",
              }}
            >
              <FiArrowDown color="black" size={25} />
            </button>
          )}

          {isLoading && (
            <div
              style={{
                padding: "10px",
                paddingLeft: "55px",
                paddingBottom: "20px",
              }}
            >
              <span
                style={{
                  color: "black",
                  fontWeight: "600",
                  fontSize: "1.2rem",
                }}
              >
                Glancenote is thinking...
              </span>
            </div>
          )}
        </div>

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
            onKeyDown={handleKeyPress}
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
