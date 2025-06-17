import { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import useAuthGuard from "@/hooks/useAuthGuard";
import { isTokenExpired } from "@/utils/token";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Send, Upload } from "lucide-react";
import Markdown from "react-markdown";
import Toast from "@/components/Toast";
import { CHAT_API_BASE_URL, AUTH_API_BASE_URL } from "@/config";

export default function ChatWithFileUpload() {
  const router = useRouter();
  useAuthGuard();
  const chatRef = useRef(null);
  const fileInputRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [promptInput, setPromptInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [toast, setToast] = useState(null);
  const [pendingImage, setPendingImage] = useState(null);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const checkTokenAndRedirect = () => {
    const token = localStorage.getItem("access_token");
    if (!token || isTokenExpired(token)) {
      localStorage.clear();
      showToast("Session expired. Please log in.");
      router.push("/login");
      return null;
    }
    return token;
  };

const sendMessage = async (finalPrompt, silent = false) => {
  const token = checkTokenAndRedirect();
  if (!token || !finalPrompt.trim()) return;
  
  // Debug logging
  console.log("Sending message to backend:");
  console.log("URL:", `${CHAT_API_BASE_URL}/userprofile`);
  console.log("Prompt:", finalPrompt);
  console.log("Token present:", !!token);
  let isSilent = silent
  if(!isSilent){
    setMessages((prev) => [...prev, { sender: "user", type: "text", text: finalPrompt }]);
    setIsTyping(true);
  }

  try {
    const requestBody = {
      messages: [{ role: "user", content: finalPrompt }],
      max_tokens: 1000,
      temperature: 0.7,
      top_p: 1.0,
      model: "intern-gpt-4o",
    };
    
    console.log("Request body:", JSON.stringify(requestBody, null, 2));
    
    const res = await axios.post(
      `${CHAT_API_BASE_URL}/userprofile`,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Backend response:", res.data);
    setMessages((prev) => [...prev, { sender: "assistant", type: "text", text: res.data.reply }]);
  } catch (error) {
    console.error("LLM API error:", error);
    console.error("Error details:", error.response?.data);
    showToast("Server error from assistant", "error");
  } finally {
    setIsTyping(false);
  }
};

  const handleImageInput = async (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target.result;
      setPendingImage({ file, src: imageUrl, name: file.name });
    };
    reader.readAsDataURL(file);
  };

  const handleSend = async () => {
    try {
      const token = checkTokenAndRedirect();
      if (!token) return;

      const prompt = promptInput.trim();

      if (!prompt && !pendingImage) {
        showToast("Please enter a message or upload an image.", "info");
        return;
      }

      if (pendingImage && !prompt) {
        showToast("Please enter a prompt to go with the image.", "info");
        return;
      }

      if (!pendingImage) {
        await sendMessage(prompt);
        setPromptInput("");
        return;
      }

      // Image + prompt logic
      const formData = new FormData();
      formData.append("image", pendingImage.file);
      formData.append("prompt", prompt);

      setIsTyping(true);

      const res = await axios.post(`${CHAT_API_BASE_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const extractedText = res.data.reply?.trim() || "";
      const combinedPrompt = extractedText
        ? `${prompt}. (Extracted text from image: ${extractedText})`
        : prompt;

      setMessages((prev) => [
        ...prev,
        {
          sender: "user",
          type: "image",
          src: pendingImage.src,
          name: pendingImage.name,
        },
        { sender: "user", type: "text", text: prompt },
      ]);

      await sendMessage(combinedPrompt, true);
    } catch (err) {
      console.error("Error in handleSend:", err);
      showToast("Something went wrong while sending", "error");
    } finally {
      setPromptInput("");
      setPendingImage(null);
      setIsTyping(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) handleImageInput(file);
    e.target.value = "";
  };

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    for (let item of items) {
      if (item.type.includes("image")) {
        const file = item.getAsFile();
        if (file) handleImageInput(file);
        break;
      }
    }
  };

  const handleLogout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        await axios.post(`${AUTH_API_BASE_URL}/logout`, { token: refreshToken });
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.clear();
      showToast("Logged out.");
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col h-screen bg-[#1c1c1e] text-white">
      {/* Header */}
      <header className="h-14 bg-[#2c2c2e] p-2 flex items-center justify-center sticky top-0 border-b border-gray-700 z-10">
        <h1 className="text-xl font-semibold">Chat with GPT</h1>
        <button
          onClick={handleLogout}
          className="absolute right-4 bg-red-600 text-white px-4 py-1 rounded-full text-sm hover:bg-red-700"
        >
          Logout
        </button>
      </header>

      {/* Messages */}
      <div
        ref={chatRef}
        className="flex-grow overflow-y-auto px-4 py-3 space-y-3 bg-[#1c1c1e] scrollbar-thin scrollbar-thumb-gray-700"
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-3 rounded-2xl text-sm max-w-[80%] break-words shadow-sm ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-[#2c2c2e] text-gray-100 rounded-bl-none"
              }`}
            >
              {msg.type === "text" && <Markdown>{msg.text}</Markdown>}
              {msg.type === "image" && (
                <div className="flex flex-col items-center">
                  <img
                    src={msg.src}
                    alt={msg.name}
                    className="max-w-xs max-h-60 rounded-md border border-gray-500"
                  />
                  <p className="text-xs mt-1 text-gray-300">{msg.name}</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="mr-auto bg-[#2c2c2e] rounded-2xl px-4 py-3 w-fit max-w-[80%] text-sm shadow-md rounded-bl-none">
            <div className="flex gap-1 animate-pulse">
              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
            </div>
          </div>
        )}
      </div>

      {/* Input & Preview */}
      <div className="bg-[#2c2c2e] p-4 flex flex-col gap-2 border-t items-center border-gray-700">
        <div className="flex flex-col w-[70%] sm:flex-row items-end gap-2">
          <textarea
            rows={1}
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            onPaste={handlePaste}
            placeholder="Type your prompt here..."
            className="flex-grow resize-none overflow-hidden rounded-2xl border border-gray-600 bg-[#1c1c1e] text-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <Button
            onClick={handleSend}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center p-0 shadow">
            <Send size={20} />
          </Button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileUpload}
          />
          <label className="cursor-pointer">
            <Button
              asChild
              className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center p-0 shadow"
            >
              <Upload className="p-2" onClick={() => fileInputRef.current?.click()} />
            </Button>
          </label>
        </div>

        {pendingImage && (
          <div className="mt-2 flex items-center gap-3">
            <img
              src={pendingImage.src}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-lg border border-gray-500"
            />
            <p className="text-xs text-gray-300">{pendingImage.name}</p>
          </div>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
