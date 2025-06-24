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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Detect mobile menu state by checking for mobile menu backdrop
  useEffect(() => {
    const checkMobileMenu = () => {
      // Look for the mobile menu backdrop in the Header component
      const mobileMenuBackdrop = document.querySelector('.md\\:hidden.fixed.inset-0.bg-black\\/60');
      setIsMobileMenuOpen(!!mobileMenuBackdrop);
    };

    // Create observer to watch for mobile menu changes
    const observer = new MutationObserver(checkMobileMenu);
    
    // Watch for changes in the body
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });

    // Initial check
    checkMobileMenu();

    return () => {
      observer.disconnect();
    };
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

  // Calculate z-index based on mobile menu state
  const getZIndex = () => {
    if (isMobileMenuOpen) {
      return 'z-30'; // Behind mobile menu (which is z-50)
    }
    return 'z-50'; // Normal z-index
  };

  return (
    <>
      {/* Perfect Circle Mobile-Responsive Toggle Button with Smart Positioning */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed transition-all duration-500 ${getZIndex()} ${
          isMobileMenuOpen ? 'opacity-50' : 'opacity-100'
        } ${
          // Smart positioning: when open on mobile, move to top-right of screen
          isOpen && isMobile 
            ? 'top-safe-4 right-safe-4' 
            : isMobile 
              ? 'bottom-safe-4 right-safe-4' 
              : 'bottom-6 right-6'
        }`}
        style={isMobile ? {
          ...(isOpen ? {
            top: 'calc(1rem + env(safe-area-inset-top))',
            right: 'calc(1rem + env(safe-area-inset-right))'
          } : {
            bottom: 'calc(1rem + env(safe-area-inset-bottom))',
            right: 'calc(1rem + env(safe-area-inset-right))'
          })
        } : {}}
        aria-label="Concierge Diamant Rouge"
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ 
            rotate: isOpen ? 180 : 0,
            scale: isOpen && isMobile ? 0.9 : 1 // Slightly smaller when open on mobile
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className={`relative bg-white rounded-full shadow-luxury border-2 border-brandGold hover:bg-brandGold/5 transition-all duration-300 overflow-hidden flex items-center justify-center ${
            isMobile ? 'w-12 h-12' : 'w-14 h-14'
          } ${isOpen && isMobile ? 'shadow-2xl border-burgundy' : ''}`}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ scale: 0, opacity: 0, rotate: -90 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0, opacity: 0, rotate: 90 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute inset-0 bg-burgundy flex items-center justify-center rounded-full"
              >
                <X size={isMobile ? 22 : 24} className="text-brandIvory font-bold" strokeWidth={3} />
              </motion.div>
            ) : (
              <motion.div
                key="diamond"
                initial={{ scale: 0, opacity: 0, rotate: -90 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0, opacity: 0, rotate: 90 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-center rounded-full overflow-hidden"
              >
                <Image 
                  src="/images/icons/Diamond-spark-rotation-HD-BLACK-new-1.gif" 
                  alt="Diamant Rouge Concierge" 
                  width={isMobile ? 48 : 56} 
                  height={isMobile ? 48 : 56} 
                  className="object-cover rounded-full"
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%'
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`fixed overflow-hidden shadow-luxury flex flex-col ${getZIndex()} ${
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
                  className={`text-brandIvory/80 hover:text-brandIvory transition-all duration-300 rounded-full hover:bg-brandIvory/10 ${
                    isMobile ? 'p-2' : 'p-1'
                  }`}
                  aria-label="Close Chat"
                >
                  <X size={isMobile ? 18 : 18} strokeWidth={2} className="font-medium" />
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
              <div className={isMobile ? 'space-y-3' : 'space-y-4'}>
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
                          className="object-cover rounded-full"
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%'
                          }}
                        />
                      </div>
                    )}
                    <div 
                      className={`max-w-[80%] rounded-lg ${
                        isMobile ? 'p-3' : 'p-4'
                      } ${
                        msg.sender === "user" 
                          ? "bg-brandGold/10 text-richEbony border border-brandGold/30" 
                          : "bg-white text-richEbony border border-brandGold/10 shadow-sm"
                      }`}
                    >
                      <p className={isMobile ? 'text-xs leading-relaxed' : 'text-sm'}>{msg.text}</p>
                    </div>
                    {msg.sender === "user" && (
                      <div className={`rounded-full bg-burgundy/10 flex items-center justify-center flex-shrink-0 ${
                        isMobile ? 'w-6 h-6 ml-2' : 'w-8 h-8 ml-3'
                      }`}>
                        <div className={`rounded-full bg-burgundy/30 ${
                          isMobile ? 'w-2.5 h-2.5' : 'w-4 h-4'
                        }`}></div>
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Enhanced Typing indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className={`rounded-full overflow-hidden flex-shrink-0 border border-brandGold/20 ${
                      isMobile ? 'w-6 h-6 mr-2' : 'w-8 h-8 mr-3'
                    }`}>
                      <Image 
                        src="/images/icons/Diamond-spark-rotation-HD-BLACK-new-1.gif" 
                        alt="Diamant Rouge Concierge" 
                        width={isMobile ? 24 : 32} 
                        height={isMobile ? 24 : 32}
                        className="object-cover rounded-full"
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%'
                        }}
                      />
                    </div>
                    <div className={`bg-white rounded-lg border border-brandGold/10 shadow-sm ${
                      isMobile ? 'p-3' : 'p-4'
                    }`}>
                      <div className="flex space-x-1">
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                          className={`bg-brandGold rounded-full ${isMobile ? 'w-1.5 h-1.5' : 'w-2 h-2'}`}
                        />
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                          className={`bg-brandGold rounded-full ${isMobile ? 'w-1.5 h-1.5' : 'w-2 h-2'}`}
                        />
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                          className={`bg-brandGold rounded-full ${isMobile ? 'w-1.5 h-1.5' : 'w-2 h-2'}`}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>
              
              {/* Enhanced Mobile-Optimized Suggested topics */}
              {showTopics && messages.length === 1 && (
                <div className={isMobile ? 'mt-3' : 'mt-4'}>
                  <p className={`text-platinumGray font-medium flex items-center ${
                    isMobile ? 'text-xs mb-2' : 'text-sm mb-2'
                  }`}>
                    <Diamond size={isMobile ? 10 : 12} className="text-brandGold mr-2" />
                    Explorer nos services:
                  </p>
                  <div className={`grid grid-cols-1 overflow-y-auto pr-1 ${
                    isMobile ? 'gap-1.5 max-h-[40vh]' : 'gap-2 max-h-[30vh]'
                  }`}>
                    {suggestedTopics.map((topic) => (
                      <motion.div
                        key={topic.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border border-brandGold/20 rounded-md overflow-hidden"
                      >
                        <div className={`bg-brandGold/5 ${isMobile ? 'p-2' : 'p-2.5'}`}>
                          <h4 className={`font-medium text-richEbony flex items-center ${
                            isMobile ? 'text-xs' : 'text-sm'
                          }`}>
                            <Diamond size={isMobile ? 10 : 12} className="text-brandGold mr-1.5" />
                            {topic.title}
                          </h4>
                        </div>
                        <div className={isMobile ? 'p-0.5' : 'p-1'}>
                          {topic.questions.map((question, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSuggestedQuestion(question)}
                              className={`w-full text-left text-platinumGray hover:bg-brandGold/5 transition-colors rounded flex items-center justify-between ${
                                isMobile ? 'p-1.5 text-[10px] min-h-[36px]' : 'p-2 text-xs'
                              }`}
                              disabled={processingQuestion}
                            >
                              <span className="line-clamp-1 flex-1">{question}</span>
                              <ChevronRight size={isMobile ? 10 : 12} className="text-brandGold/60 flex-shrink-0 ml-1" />
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Mobile-Optimized Input Area */}
            <div className={`bg-white border-t border-brandGold/10 ${isMobile ? 'p-3' : 'p-4'}`}>
              <div className={`flex items-center bg-brandIvory/50 rounded-lg border border-brandGold/20 focus-within:border-brandGold/50 transition-all ${
                isMobile ? 'px-2 py-2' : 'px-3 py-2'
              }`}>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={handleInputFocus}
                  placeholder="Posez votre question..."
                  className={`flex-1 bg-transparent border-none outline-none placeholder-platinumGray/70 text-richEbony ${
                    isMobile ? 'text-sm py-1' : 'text-sm'
                  }`}
                  style={isMobile ? { minHeight: '36px' } : {}}
                />
                <button 
                  onClick={handleSend} 
                  disabled={!input.trim() || processingQuestion}
                  className={`rounded-full transition-all ${
                    isMobile ? 'ml-1 p-1.5' : 'ml-2 p-2'
                  } ${
                    input.trim() && !processingQuestion
                      ? 'bg-brandGold text-white hover:bg-brandGold/90' 
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <Send size={isMobile ? 14 : 16} className="transform -rotate-45" />
                </button>
              </div>
              <p className={`text-platinumGray/70 text-center flex items-center justify-center ${
                isMobile ? 'mt-1.5 text-[10px]' : 'mt-2 text-xs'
              }`}>
                <Clock size={isMobile ? 10 : 12} className="inline mr-1" />
                Réponses inspirées par notre expertise depuis 1987
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}