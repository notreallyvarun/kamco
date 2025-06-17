// components/ChatInput.jsx

import { useState } from "react";
import axios from "axios";
import { CHAT_API_BASE_URL } from "@/config";
import { checkTokenAndRedirect } from "@/utils/token";
import { showToast } from "@/components/ui/toast";

export default function ChatInput({ setMessages, sendMessage, setIsTyping }) {
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [prompt, setPrompt] = useState("");

  const handleImageSelect = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target.result;
      setImagePreviewUrl(imageUrl);
      setSelectedImageFile(file);
      setMessages((prev) => [
        ...prev,
        { sender: "user", type: "image", src: imageUrl, name: file.name },
      ]);
    };
    reader.onerror = () => {
      showToast("Failed to read image file", "error");
    };
    reader.readAsDataURL(file);
  };

  const handleSend = async () => {
    const token = checkTokenAndRedirect();
    if (!token) return;

    if (!prompt.trim() && !selectedImageFile) {
      showToast("Please enter a prompt or upload an image.");
      return;
    }

    const formData = new FormData();
    if (selectedImageFile) formData.append("image", selectedImageFile);
    if (prompt.trim()) {
      formData.append("prompt", prompt.trim());
      setMessages((prev) => [
        ...prev,
        { sender: "user", type: "text", text: prompt.trim() },
      ]);
    }

    setIsTyping(true);
    try {
      const res = await axios.post(`${CHAT_API_BASE_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const extractedText = res.data.text?.trim();
      let finalPrompt = "";
      if (extractedText && prompt.trim()) {
        finalPrompt = `${prompt.trim()} Based on the image: ${extractedText}`;
      } else if (extractedText) {
        finalPrompt = `Analyze this image: ${extractedText}`;
      } else if (prompt.trim()) {
        finalPrompt = prompt.trim();
      } else {
        showToast("No text found in image or prompt.");
        return;
      }

      await sendMessage(finalPrompt, true);
      setPrompt("");
      setSelectedImageFile(null);
      setImagePreviewUrl(null);
    } catch (err) {
      console.error("OCR/upload error:", err);
      showToast("Failed to process image.", "error");
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="p-4 flex flex-col gap-2">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleImageSelect(e.target.files[0])}
        className="file-input"
      />
      <textarea
        placeholder="Type your prompt here..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="textarea resize-none"
      />
      <button onClick={handleSend} className="btn btn-primary">
        Send
      </button>
    </div>
  );
}
