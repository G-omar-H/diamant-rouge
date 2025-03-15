"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Diamond, Send, Clock, ChevronRight } from "lucide-react";
import Image from "next/image";

type Message = {
  sender: "user" | "ai";
  text: string;
};

type SuggestionTopic = {
  id: string;
  title: string;
  questions: string[];
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showTopics, setShowTopics] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Same suggested topics as before
  const suggestedTopics: SuggestionTopic[] = [
    {
      id: "collections",
      title: "Nos Collections",
      questions: [
        "Quelles sont vos dernières collections?",
        "Avez-vous des pièces avec des saphirs?",
        "Je recherche une bague de fiançailles unique"
      ]
    },
    {
      id: "appointments",
      title: "Rendez-vous Privé",
      questions: [
        "Comment réserver un rendez-vous?",
        "Quels services proposez-vous lors d'une consultation?",
        "Peut-on créer une pièce sur-mesure?"
      ]
    },
    {
      id: "care",
      title: "Entretien & Garantie",
      questions: [
        "Comment entretenir mes bijoux?",
        "Quelle est votre politique de garantie?",
        "Proposez-vous des services de restauration?"
      ]
    }
  ];

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        { 
          sender: "ai", 
          text: "Bienvenue chez Diamant Rouge. Je suis Sarah, votre conseillère personnelle en joaillerie d'exception. Comment puis-je vous accompagner dans votre découverte de nos créations?"
        }
      ]);
    }
  }, [messages.length]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Same handleSend function as before
  async function handleSend() {
    if (!input.trim()) return;
    
    const userMessage: Message = { sender: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setShowTopics(false);
    setIsTyping(true);

    // Call the chatbot API
    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: `You are Sarah, a highly knowledgeable luxury jewelry concierge for Diamant Rouge, an exclusive high-end jewelry brand. 
          Respond to the following customer query in French, with expertise, sophistication and warmth.
          Be concise (keep responses under 120 words), elegant, and knowledgeable about fine jewelry.
          Query: ${userMessage.text}`
        }),
      });
      
      const data = await res.json();
      setIsTyping(false);
      
      // Add a slight delay to simulate a more natural conversation
      setTimeout(() => {
        const aiMessage: Message = { sender: "ai", text: data.reply };
        setMessages((prev) => [...prev, aiMessage]);
      }, 300);
      
    } catch (error) {
      console.error("Chatbot error:", error);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Je vous prie de m'excuser pour ce contretemps. Pourriez-vous reformuler votre demande? Ou peut-être préféreriez-vous être contacté(e) directement par l'un de nos conseillers?" },
      ]);
    }
  }

  function handleSuggestedQuestion(question: string) {
    setInput(question);
    handleSend();
  }

  return (
    <>
      {/* Personalized Luxury Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-white p-0.5 rounded-full shadow-luxury border-2 border-brandGold hover:bg-brandGold/5 transition-all duration-300"
        aria-label="Concierge Diamant Rouge"
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.3 }}
          className="relative w-14 h-14 rounded-full overflow-hidden flex items-center justify-center"
        >
          {isOpen ? (
            <div className="absolute inset-0 bg-burgundy/80 flex items-center justify-center">
              <X size={22} className="text-brandIvory" />
            </div>
          ) : (
            <>
              {/* Custom diamond concierge icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Image 
                  src="public/images/icons/Diamond-spark-rotation-HD-BLACK-new-1.gif" 
                  alt="Diamant Rouge Concierge" 
                  width={56} 
                  height={56} 
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-brandGold rounded-full flex items-center justify-center border border-white">
                <Diamond size={10} className="text-burgundy" />
              </div>
            </>
          )}
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-24 right-6 z-50 w-96 max-h-[80vh] rounded-lg overflow-hidden shadow-luxury flex flex-col"
          >
            {/* Luxury Header */}
            <div className="bg-gradient-to-r from-burgundy to-burgundy/90 text-brandIvory p-5">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <Diamond size={18} className="text-brandGold mr-2" />
                  <h3 className="font-serif text-xl">Diamant Rouge</h3>
                </div>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="text-brandIvory/80 hover:text-brandIvory transition-colors"
                  aria-label="Close Chat"
                >
                  <X size={18} />
                </button>
              </div>
              <p className="text-sm text-brandIvory/80 font-light">
                Votre conseillère personnelle en joaillerie d'exception
              </p>
            </div>

            {/* Messages Container - Fixed height */}
            <div className="flex-1 bg-white bg-opacity-95 backdrop-blur-sm overflow-y-auto p-5" style={{ maxHeight: "50vh" }}>
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.sender === "ai" && (
                      <div className="w-8 h-8 rounded-full overflow-hidden mr-3 flex-shrink-0 border border-brandGold/20">
                        <Image 
                          src="public/images/icons/Diamond-spark-rotation-HD-BLACK-new-1.gif" 
                          alt="Diamant Rouge Concierge" 
                          width={32} 
                          height={32} 
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                    <div 
                      className={`max-w-[80%] p-4 rounded-lg ${
                        msg.sender === "user" 
                          ? "bg-brandGold/10 text-richEbony border border-brandGold/30" 
                          : "bg-white text-richEbony border border-brandGold/10 shadow-sm"
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                    </div>
                    {msg.sender === "user" && (
                      <div className="w-8 h-8 rounded-full bg-burgundy/10 ml-3 flex items-center justify-center flex-shrink-0">
                        <div className="w-4 h-4 rounded-full bg-burgundy/30"></div>
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-3 flex-shrink-0 border border-brandGold/20">
                      <Image 
                        src="public/images/icons/Diamond-spark-rotation-HD-BLACK-new-1.gif" 
                        alt="Diamant Rouge Concierge" 
                        width={32} 
                        height={32}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-brandGold/10 shadow-sm">
                      <div className="flex space-x-1">
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                          className="w-2 h-2 bg-brandGold rounded-full"
                        />
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                          className="w-2 h-2 bg-brandGold rounded-full"
                        />
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                          className="w-2 h-2 bg-brandGold rounded-full"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>
              
              {/* Compact Suggested topics section */}
              {showTopics && messages.length === 1 && (
                <div className="mt-4">
                  <p className="text-sm text-platinumGray mb-2 font-medium flex items-center">
                    <Diamond size={12} className="text-brandGold mr-2" />
                    Explorer nos services:
                  </p>
                  <div className="grid grid-cols-1 gap-2 max-h-[30vh] overflow-y-auto pr-1">
                    {suggestedTopics.map((topic) => (
                      <motion.div
                        key={topic.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border border-brandGold/20 rounded-md overflow-hidden"
                      >
                        <div className="bg-brandGold/5 p-2.5">
                          <h4 className="text-sm font-medium text-richEbony flex items-center">
                            <Diamond size={12} className="text-brandGold mr-1.5" />
                            {topic.title}
                          </h4>
                        </div>
                        <div className="p-1">
                          {topic.questions.map((question, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSuggestedQuestion(question)}
                              className="w-full text-left p-2 text-xs text-platinumGray hover:bg-brandGold/5 transition-colors rounded flex items-center justify-between"
                            >
                              <span className="line-clamp-1">{question}</span>
                              <ChevronRight size={12} className="text-brandGold/60 flex-shrink-0 ml-1" />
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Elegant Input Area */}
            <div className="bg-white border-t border-brandGold/10 p-4">
              <div className="flex items-center bg-brandIvory/50 rounded-lg border border-brandGold/20 focus-within:border-brandGold/50 px-3 py-2 transition-all">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Posez votre question..."
                  className="flex-1 bg-transparent border-none outline-none text-sm placeholder-platinumGray/70 text-richEbony"
                />
                <button 
                  onClick={handleSend} 
                  disabled={!input.trim()}
                  className={`ml-2 p-2 rounded-full transition-all ${
                    input.trim() 
                      ? 'bg-brandGold text-white hover:bg-brandGold/90' 
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <Send size={16} className="transform -rotate-45" />
                </button>
              </div>
              <p className="mt-2 text-xs text-platinumGray/70 text-center">
                <Clock size={12} className="inline mr-1" />
                Réponses inspirées par notre expertise depuis 1987
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}