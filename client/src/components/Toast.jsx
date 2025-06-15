import { useEffect, useState } from "react";

export default function Toast({ message, type = "info", duration = 3000 }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md shadow-lg text-sm font-medium z-50
      ${type === "error" ? "bg-red-600 text-white" : "bg-gray-800 text-white"}`}>
      {message}
    </div>
  );
}
