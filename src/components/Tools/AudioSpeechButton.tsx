import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Square } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdviceResult } from '../../types/advisor';

interface AudioSpeechButtonProps {
  advice: AdviceResult;
}

export const AudioSpeechButton: React.FC<AudioSpeechButtonProps> = ({ advice }) => {
  const { language } = useApp();
  const isHi = language === 'hi';
  const [isPlaying, setIsPlaying] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSupported(false);
    }
  }, []);

  useEffect(() => {
    // Stop speech when component unmounts or language changes
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [language]);

  if (!supported) return null;

  const handleToggleSpeech = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();

    // Prepare speech text
    const textToSpeak = isHi
      ? `धान सलाहकार निर्देश। इस सप्ताह की मुख्य प्राथमिकता: ${advice.top_priority}। ` +
        `लागू किए जाने वाले कदम: ` +
        advice.steps.map((s, i) => `कदम ${i + 1}: ${s.action}। ${s.why}`).join(' ') +
        `। कृपया किसी भी बदलाव से पूर्व स्थानीय कृषि अधिकारी से पुष्टि करें।`
      : `Rice Advisor Guidance. Top Priority this week: ${advice.top_priority}. ` +
        `Key action steps: ` +
        advice.steps.map((s, i) => `Step ${i + 1}: ${s.action}. ${s.why}`).join(' ') +
        ` Please confirm with your local agronomist before acting.`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = isHi ? 'hi-IN' : 'en-US';
    utterance.rate = 0.95; // Slightly slower, crisp cadence for farmers

    // Select suitable voice if available
    const voices = window.speechSynthesis.getVoices();
    const voiceMatch = voices.find((v) =>
      isHi ? v.lang.startsWith('hi') : v.lang.startsWith('en')
    );
    if (voiceMatch) {
      utterance.voice = voiceMatch;
    }

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  return (
    <button
      onClick={handleToggleSpeech}
      type="button"
      className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer shadow-xs ${
        isPlaying
          ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200 animate-pulse'
          : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300'
      }`}
    >
      {isPlaying ? (
        <>
          <Square className="w-3.5 h-3.5 fill-current" />
          <span>{isHi ? 'रोकें (Stop Audio)' : 'Stop Audio'}</span>
          <span className="flex space-x-0.5 items-end h-3 ml-1">
            <span className="w-0.5 h-2 bg-amber-600 animate-bounce"></span>
            <span className="w-0.5 h-3 bg-amber-600 animate-bounce delay-100"></span>
            <span className="w-0.5 h-1.5 bg-amber-600 animate-bounce delay-200"></span>
          </span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
          <span>{isHi ? '🔊 बोलकर सुनाएं (Voice)' : '🔊 Audio Readout'}</span>
        </>
      )}
    </button>
  );
};
