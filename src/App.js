import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import LanguageSelector from './components/LanguageSelector';
import TranscriptDisplay from './components/TranscriptDisplay';
import RecordButton from './components/RecordButton';
import SpeakButton from './components/SpeakButton';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState('en-US');
  const [targetLanguage, setTargetLanguage] = useState('es-ES');
  const [originalTranscript, setOriginalTranscript] = useState('');
  const [translatedTranscript, setTranslatedTranscript] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState(null);
  const targetLanguageRef = useRef(targetLanguage);
  const recognitionRef = useRef(null);
  
  // Keep the ref updated
  useEffect(() => {
    targetLanguageRef.current = targetLanguage;
  }, [targetLanguage]);
  
  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = sourceLanguage;
      
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        
        setOriginalTranscript(transcript);
        
        // Only call translation API when we have a final result to reduce API calls
        if (event.results[event.results.length - 1].isFinal) {
          translateText(transcript,targetLanguageRef.current);
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setError(`Speech recognition error: ${event.error}`);
        setIsRecording(false);
      };
    } else {
      setError('Speech recognition is not supported in your browser');
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [sourceLanguage]);
  
  // Toggle recording state
  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setError(null);
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };
  
  // Call backend API for translation
  const translateText = async (text, targetLang = targetLanguage) => {
    if (!text.trim()) return;
    
    setIsTranslating(true);
    try {
      const response = await fetch('http://192.168.0.102:5000/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          sourceLanguage,
        targetLanguage: targetLang // use passed parameter
        }),
      });
      
      if (!response.ok) {
        throw new Error('Translation failed');
      }
      
      const data = await response.json();
      setTranslatedTranscript(data.translatedText);
    } catch (err) {
      console.error('Translation error:', err);
      setError(`Translation error: ${err.message}`);
    } finally {
      setIsTranslating(false);
    }
  };
  
  // Handle language changes
  const handleSourceLanguageChange = (language) => {
    setSourceLanguage(language);
    if (recognitionRef.current) {
      recognitionRef.current.lang = language;
    }
  };
  
  const handleTargetLanguageChange = (language) => {
    setTargetLanguage(language);
    // Retranslate existing transcript if we have one
    if (originalTranscript) {
      translateText(originalTranscript,language);
    }
  };
  
  // Clear transcripts
  const handleClear = () => {
    setOriginalTranscript('');
    setTranslatedTranscript('');
    setError(null);
  };

  return (
    <div className="app-container">
      <header>
        <h1>Healthcare Translation App</h1>
      </header>
      
      <div className="language-selectors">
        <LanguageSelector 
          label="Speak in" 
          value={sourceLanguage} 
          onChange={handleSourceLanguageChange} 
        />
        <LanguageSelector 
          label="Translate to" 
          value={targetLanguage} 
          onChange={handleTargetLanguageChange} 
        />
      </div>
      
      <div className="transcript-container">
        <TranscriptDisplay 
          title="Original"
          transcript={originalTranscript} 
          language={sourceLanguage}
          isLoading={isRecording}
        />
        
        <TranscriptDisplay 
          title="Translation"
          transcript={translatedTranscript} 
          language={targetLanguage}
          isLoading={isTranslating}
        >
          <SpeakButton 
            text={translatedTranscript} 
            language={targetLanguage}
            disabled={!translatedTranscript}
          />
        </TranscriptDisplay>
      </div>
      
      <div className="controls">
        <RecordButton 
          isRecording={isRecording} 
          onClick={toggleRecording} 
        />
        <button 
          className="clear-button" 
          onClick={handleClear}
          disabled={!originalTranscript && !translatedTranscript}
        >
          Clear
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <footer>
        <p>For demonstration purposes only. Not for actual medical use.</p>
      </footer>
    </div>
  );
}

export default App;