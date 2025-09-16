import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

export const TimeGreeting = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const hour = currentTime.getHours();
    
    if (hour >= 5 && hour < 12) {
      setGreeting("Good morning");
    } else if (hour >= 12 && hour < 17) {
      setGreeting("Good afternoon");
    } else if (hour >= 17 && hour < 22) {
      setGreeting("Good evening");
    } else {
      setGreeting("Good night");
    }
  }, [currentTime]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed top-6 right-6 text-right z-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-white/90"
      >
        <div 
          className="mb-1"
          style={{ 
            fontFamily: "var(--font-heading)",
            fontSize: "1.25rem",
            fontWeight: "500"
          }}
        >
          {greeting}
        </div>
        <div 
          className="text-6xl mb-2"
          style={{ 
            fontFamily: "var(--font-heading)",
            fontWeight: "600"
          }}
        >
          {formatTime(currentTime)}
        </div>
        <div 
          className="text-white/70"
          style={{ fontSize: "var(--text-md)" }}
        >
          {formatDate(currentTime)}
        </div>
      </motion.div>
    </div>
  );
};