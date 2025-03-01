// components/LanguageSelector.js
import React from 'react';

const LanguageSelector = ({ label, value, onChange }) => {
  const languages = [
    { code: 'en-US', name: 'English' },
    { code: 'es-ES', name: 'Spanish' },
    { code: 'fr-FR', name: 'French' },
    { code: 'de-DE', name: 'German' },
    { code: 'zh-CN', name: 'Chinese (Simplified)' },
    { code: 'ar-SA', name: 'Arabic' },
    { code: 'hi-IN', name: 'Hindi' },
    { code: 'ru-RU', name: 'Russian' },
    { code: 'pt-BR', name: 'Portuguese' },
    { code: 'ja-JP', name: 'Japanese' }
  ];
  
  return (
    <div className="language-selector">
      <label htmlFor={`language-${label}`}>{label}:</label>
      <select 
        id={`language-${label}`}
        value={value} 
        onChange={(e) => onChange(e.target.value)}
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;