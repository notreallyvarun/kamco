import { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { isTokenExpired } from "@/utils/token";
import useAuthGuard from "@/hooks/useAuthGuard";
import { useRouter } from "next/router";
import Markdown from "react-markdown";
import Toast from "@/components/Toast";

export default function UserProfile() {
  const r_router = useRouter();
  useAuthGuard();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [toast, setToast] = useState(null);
  const chatRef = useRef(null);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const token = localStorage.getItem("access_token");
    if (isTokenExpired(token)) {
      r_router.push("/login");
      showToast("Your session expired. Please log in again.");
      return;
    }

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/chat/userprofile",
        {
          messages: [{ role: "user", content: input }],
          max_tokens: 1000,
          temperature: 0.7,
          top_p: 1.0,
          model: "intern-gpt-4o",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      const response = {
        sender: "assistant",
        text: res.data.reply,
      };

      setMessages((prev) => [...prev, response]);
    } catch (error) {
      console.error("Error from API:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "assistant",
          text: "Something went wrong while contacting the server.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleLogout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        await axios.post("/logout", { token: refreshToken });
      }
    } catch (error) {
      console.error("Error during logout:", error);
      showToast("Server logout failed, but you’ve been logged out.", "error");
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      r_router.push("/login");
      showToast("You have been logged out successfully.");
    }
  }, [r_router]);

  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await sendMessage();
    }
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col h-screen bg-[#1c1c1e] text-white">
      <header className="h-14 bg-[#2c2c2e] p-2 shadow flex items-center justify-center sticky top-0 z-10 border-b border-gray-700">
        <h1 className="text-xl font-semibold select-none">Chat with GPT</h1>
        <button
          onClick={handleLogout}
          className="absolute right-4 py-2 px-3 rounded-3xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition"
        >
          Logout
        </button>
      </header>

      <div
        ref={chatRef}
        className="flex flex-col flex-grow overflow-y-auto px-4 py-3 space-y-3 bg-[#1c1c1e] scrollbar-thin scrollbar-thumb-gray-700"
        style={{ scrollBehavior: "smooth" }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`px-4 py-3 rounded-2xl whitespace-pre-wrap break-words w-fit max-w-[80%] text-sm sm:text-base shadow-sm
              ${msg.sender === "user"
                ? "ml-auto bg-blue-600 text-white rounded-br-none"
                : "mr-auto bg-[#2c2c2e] text-gray-100 rounded-bl-none"
              }`}
          >
            <Markdown>{msg.text}</Markdown>
          </div>
        ))}

        {isTyping && (
          <div className="mr-auto bg-[#2c2c2e] text-white rounded-2xl px-4 py-3 w-fit max-w-[80%] text-sm sm:text-base shadow-md rounded-bl-none">
            <div className="flex gap-1 animate-pulse">
              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
            </div>
          </div>
        )}
      </div>

      <div className="bg-[#2c2c2e] p-4 flex items-end gap-2 border-t border-gray-700 relative z-10">
        <textarea
          rows={1}
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            e.target.style.height = "auto"
            e.target.style.height = `${e.target.scrollHeight}px`
          }}
          onKeyDown={handleKeyDown}
          placeholder="Enter a prompt..."
          className="flex-grow resize-none overflow-hidden  max-h-40 rounded-2xl border border-gray-600 bg-[#1c1c1e] text-white px-4 py-2 text-sm sm:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
        <Button
          onClick={sendMessage}
          className="bg-white hover:bg-gray-400 text-black font-bold rounded-full px-5 py-2 shadow"
        >
          Send
        </Button>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
