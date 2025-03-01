// components/TranscriptDisplay.js
import React from 'react';

const TranscriptDisplay = ({ title, transcript, language, isLoading, children }) => {
  return (
    <div className="transcript-box">
      <h3>{title}</h3>
      <div className="transcript-content">
        {transcript ? (
          <p lang={language}>{transcript}</p>
        ) : (
          <p className="placeholder">
            {isLoading ? 'Processing...' : 'No transcript yet'}
          </p>
        )}
      </div>
      {children}
    </div>
  );
};

export default TranscriptDisplay;