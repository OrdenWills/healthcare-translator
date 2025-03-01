// components/SpeakButton.js
import React from 'react';

const SpeakButton = ({ text, language, disabled }) => {
  const speakText = () => {
    if (!text || disabled) return;
    
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = language;
    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    window.speechSynthesis.speak(speech);
  };
  
  return (
    <button 
      className="speak-button" 
      onClick={speakText}
      disabled={disabled}
      aria-label="Speak translated text"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
      </svg>
      Speak
    </button>
  );
};

export default SpeakButton;