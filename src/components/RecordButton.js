// components/RecordButton.js
import React from 'react';

const RecordButton = ({ isRecording, onClick }) => {
  return (
    <button 
      className={`record-button ${isRecording ? 'recording' : ''}`} 
      onClick={onClick}
      aria-label={isRecording ? 'Stop recording' : 'Start recording'}
    >
      {isRecording ? 'Stop' : 'Start'} Recording
    </button>
  );
};

export default RecordButton;