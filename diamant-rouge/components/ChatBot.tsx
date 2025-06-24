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
  const inputRef = useRef<HTMLInputElement>(null);
  const [processingQuestion, setProcessingQuestion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

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

  // Enhanced body scroll lock for mobile
  useEffect(() => {
    if (isOpen) {
      // Prevent scrolling on body when chat is open
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
      
      // Prevent iOS bounce scroll
      if (typeof window !== 'undefined' && window.navigator?.userAgent?.match(/iPhone|iPad|iPod/)) {
        document.documentElement.style.overflow = 'hidden';
      }
    } else {
      // Re-enable scrolling when chat is closed
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      
      if (typeof window !== 'undefined' && window.navigator?.userAgent?.match(/iPhone|iPad|iPod/)) {
        document.documentElement.style.overflow = '';
      }
      
      // Restore scroll position
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
      }
    }
    
    return () => {
      // Cleanup function to ensure body scrolling is restored
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      if (typeof window !== 'undefined' && window.navigator?.userAgent?.match(/iPhone|iPad|iPod/)) {
        document.documentElement.style.overflow = '';
      }
    };
  }, [isOpen]);

  // Handle input focus on mobile
  const handleInputFocus = () => {
    if (isMobile && inputRef.current) {
      // Slight delay to ensure virtual keyboard is shown
      setTimeout(() => {
        inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  // Same handleSend function as before
  async function handleSend() {
    if (!input.trim() || processingQuestion) return;
    
    const userMessage: Message = { sender: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setShowTopics(false);
    setIsTyping(true);
    setProcessingQuestion(true);

    // Blur input on mobile to hide keyboard
    if (isMobile && inputRef.current) {
      inputRef.current.blur();
    }

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
        setProcessingQuestion(false);
      }, 300);
      
    } catch (error) {
      console.error("Chatbot error:", error);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Je vous prie de m'excuser pour ce contretemps. Pourriez-vous reformuler votre demande? Ou peut-être préféreriez-vous être contacté(e) directement par l'un de nos conseillers?" },
      ]);
      setProcessingQuestion(false);
    }
  }

  function handleSuggestedQuestion(question: string) {
    if (processingQuestion) return;
    setInput(question);
    // Add a slight delay to allow reading the question before sending
    setTimeout(() => {
      handleSend();
    }, 100);
  }

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Enhanced Mobile-Responsive Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed z-50 bg-white rounded-full shadow-luxury border-2 border-brandGold hover:bg-brandGold/5 transition-all duration-300 ${
          isMobile 
            ? 'bottom-4 right-4 p-1 safe-area-inset-bottom' 
            : 'bottom-6 right-6 p-0.5'
        }`}
        style={isMobile ? { 
          paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' 
        } : {}}
        aria-label="Concierge Diamant Rouge"
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.3 }}
          className={`relative rounded-full overflow-hidden flex items-center justify-center ${
            isMobile ? 'w-12 h-12' : 'w-14 h-14'
          }`}
        >
          {isOpen ? (
            <div className="absolute inset-0 bg-burgundy/80 flex items-center justify-center">
              <X size={isMobile ? 18 : 22} className="text-brandIvory" />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Image 
                src="/images/icons/Diamond-spark-rotation-HD-BLACK-new-1.gif" 
                alt="Diamant Rouge Concierge" 
                width={isMobile ? 48 : 56} 
                height={isMobile ? 48 : 56} 
                className="object-cover w-full h-full"
              />
            </div>
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
            className={`fixed z-50 overflow-hidden shadow-luxury flex flex-col ${
              isMobile 
                ? 'inset-4 rounded-2xl safe-area-inset'
                : 'bottom-24 right-6 w-96 max-h-[80vh] rounded-lg'
            }`}
            style={isMobile ? {
              top: 'calc(1rem + env(safe-area-inset-top))',
              bottom: 'calc(1rem + env(safe-area-inset-bottom))',
              left: 'calc(1rem + env(safe-area-inset-left))',
              right: 'calc(1rem + env(safe-area-inset-right))'
            } : {}}
          >
            {/* Enhanced Luxury Header */}
            <div className={`bg-gradient-to-r from-burgundy to-burgundy/90 text-brandIvory ${
              isMobile ? 'p-4' : 'p-5'
            }`}>
              <div className={`flex justify-between items-center ${isMobile ? 'mb-2' : 'mb-3'}`}>
                <div className="flex items-center">
                  <Diamond size={isMobile ? 16 : 18} className="text-brandGold mr-2" />
                  <h3 className={`font-serif ${isMobile ? 'text-lg' : 'text-xl'}`}>Diamant Rouge</h3>
                </div>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="text-brandIvory/80 hover:text-brandIvory transition-colors p-1 rounded-full hover:bg-brandIvory/10"
                  aria-label="Close Chat"
                >
                  <X size={isMobile ? 16 : 18} />
                </button>
              </div>
              <p className={`text-brandIvory/80 font-light ${isMobile ? 'text-xs' : 'text-sm'}`}>
                Votre conseillère personnelle en joaillerie d'exception
              </p>
            </div>

            {/* Enhanced Messages Container */}
            <div 
              className={`flex-1 bg-white bg-opacity-95 backdrop-blur-sm overflow-y-auto ${
                isMobile ? 'p-3' : 'p-5'
              }`}
              style={isMobile ? {} : { maxHeight: "50vh" }}
              onClick={() => {
                if (isMobile && inputRef.current) {
                  inputRef.current.blur();
                }
              }}
            >
              <div className={`space-y-${isMobile ? '3' : '4'}`}>
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.sender === "ai" && (
                      <div className={`rounded-full overflow-hidden flex-shrink-0 border border-brandGold/20 ${
                        isMobile ? 'w-6 h-6 mr-2' : 'w-8 h-8 mr-3'
                      }`}>
                        <Image 
                          src="/images/icons/Diamond-spark-rotation-HD-BLACK-new-1.gif" 
                          alt="Diamant Rouge Concierge" 
                          width={isMobile ? 24 : 32} 
                          height={isMobile ? 24 : 32} 
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                    <div 
                      className={`max-w-[80%] rounded-lg ${
                        isMobile ? 'p-3' : 'p-4'
                      } ${
                        msg.sender === "user" 
                          ? "bg-brandGold/10 text-richEbony border border-brandGold/30" 
                  