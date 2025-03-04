// components/ChatBot.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";

type Message = {
  sender: "user" | "ai";
  text: string;
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send user message to API and update messages
  async function handleSend() {
    if (!input.trim()) return;
    const userMessage: Message = { sender: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Call your API route for the chatbot
    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage.text }),
      });
      const data = await res.json();
      const aiMessage: Message = { sender: "ai", text: data.reply };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Désolé, une erreur s'est produite. Veuillez réessayer." },
      ]);
    }
  }

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-brandGold p-4 rounded-full shadow-luxury hover:bg-burgundy transition"
        aria-label="Toggle Chatbot"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-20 right-6 z-50 w-80 bg-brandIvory rounded-xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Chat Header */}
            <div className="bg-burgundy text-brandIvory p-4 flex justify-between items-center">
              <h3 className="font-serif text-xl">Assistance Diamant Rouge</h3>
              <button onClick={() => setIsOpen(false)} aria-label="Close Chat">
                <X size={20} />
              </button>
            </div>
            {/* Chat Messages */}
            <div className="p-4 h-64 overflow-y-auto bg-brandIvory">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 p-2 rounded-md ${
                    msg.sender === "user"
                      ? "bg-brandGold text-richEbony self-end"
                      : "bg-burgundy text-brandIvory self-start"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            {/* Chat Input */}
            <div className="p-4 bg-brandIvory border-t border-platinumGray">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Posez votre question..."
                className="w-full p-2 border border-brandGold rounded focus:outline-none focus:ring-2 focus:ring-brandGold"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
