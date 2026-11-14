import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles, Check, AlertCircle, Globe } from 'lucide-react';
import { ReportCategory } from '../../types/report';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  onInferredCategory?: (category: ReportCategory) => void;
  className?: string;
  fieldLabel?: string;
}

// Extend window for webkitSpeechRecognition
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onTranscript,
  onInferredCategory,
  className = '',
  fieldLabel = 'description'
}) => {
  const [isListening, setIsListening] = useState(false);
  const [lang, setLang] = useState<'en-IN' | 'te-IN'>('en-IN');
  const [interimText, setInterimText] = useState('');
  const [supported, setSupported] = useState(true);
  const [showHelper, setShowHelper] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
    }
  }, []);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // Simulate voice input for testing/demo in environments without Web Speech API
      simulateVoiceDemo();
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = lang;

      recognition.onstart = () => {
        setIsListening(true);
        setInterimText('Listening... Speak now about the civic hazard');
      };

      recognition.onresult = (event: any) => {
        let finalTrans = '';
        let interimTrans = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTrans += event.results[i][0].transcript;
          } else {
            interimTrans += event.results[i][0].transcript;
          }
        }

        const currentText = finalTrans || interimTrans;
        setInterimText(currentText);

        if (finalTrans) {
          handleFinalSpeech(finalTrans);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setInterimText('Microphone access blocked. Please enable mic permissions or try sample speech.');
        } else {
          setInterimText('Voice input stopped. Click to try again.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Speech recognition start failed, using fallback:', err);
      simulateVoiceDemo();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleFinalSpeech = (text: string) => {
    onTranscript(text.trim());
    detectCategoryKeywords(text);
    setTimeout(() => {
      setInterimText('');
    }, 3000);
  };

  const detectCategoryKeywords = (text: string) => {
    if (!onInferredCategory) return;
    const lower = text.toLowerCase();
    if (lower.includes('pothole') || lower.includes('crater') || lower.includes('guntalu') || lower.includes('road broken')) {
      onInferredCategory('Pothole');
    } else if (lower.includes('light') || lower.includes('dark') || lower.includes('lamp') || lower.includes('deepam')) {
      onInferredCategory('Broken Streetlight');
    } else if (lower.includes('drain') || lower.includes('manhole') || lower.includes('gutter') || lower.includes('drainage')) {
      onInferredCategory('Open Drain');
    } else if (lower.includes('water') || lower.includes('flood') || lower.includes('logging') || lower.includes('neeru')) {
      onInferredCategory('Waterlogging');
    } else if (lower.includes('footpath') || lower.includes('pavement') || lower.includes('sidewalk') || lower.includes('walkway')) {
      onInferredCategory('Damaged Footpath');
    } else if (lower.includes('cross') || lower.includes('zebra') || lower.includes('signal') || lower.includes('pedestrian')) {
      onInferredCategory('Unsafe Crossing');
    } else if (lower.includes('garbage') || lower.includes('waste') || lower.includes('dump') || lower.includes('chetha')) {
      onInferredCategory('Garbage Dumping');
    }
  };

  // Demo fallback for presentation or unsupported browsers
  const simulateVoiceDemo = () => {
    setIsListening(true);
    setInterimText('Listening... (Demo Simulation Mode)');
    
    const sampleText = lang === 'te-IN'
      ? 'బాచుపల్లి ప్రధాన రహదారిలో పెద్ద గుంత ఉంది, ద్విచక్ర వాహనాలు జారిపడుతున్నాయి.'
      : 'Large crater pothole near Silver Oaks School crossing. Water pooling and causing two-wheelers to skid.';

    let current = '';
    const words = sampleText.split(' ');
    let idx = 0;

    const interval = setInterval(() => {
      if (idx < words.length) {
        current += (idx > 0 ? ' ' : '') + words[idx];
        setInterimText(current);
        idx++;
      } else {
        clearInterval(interval);
        setIsListening(false);
        handleFinalSpeech(sampleText);
      }
    }, 280);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-2">
        {/* Language selector toggle */}
        <div className="inline-flex items-center rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-[11px]">
          <button
            type="button"
            onClick={() => setLang('en-IN')}
            className={`px-2 py-0.5 rounded-md font-medium transition ${
              lang === 'en-IN' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="English Speech"
          >
            🇬🇧 EN
          </button>
          <button
            type="button"
            onClick={() => setLang('te-IN')}
            className={`px-2 py-0.5 rounded-md font-medium transition ${
              lang === 'te-IN' ? 'bg-white text-teal-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Telugu Speech (తెలుగు)"
          >
            తెలుగు TE
          </button>
        </div>

        {/* Mic Activation Button */}
        <button
          type="button"
          onClick={toggleListening}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition shadow-xs ${
            isListening
              ? 'bg-red-600 text-white animate-pulse shadow-red-500/30'
              : 'bg-gradient-to-r from-blue-50 to-teal-50 border border-teal-200 text-teal-800 hover:border-teal-400 hover:bg-teal-100/70'
          }`}
          title={isListening ? 'Click to stop listening' : 'Speak to report in English or Telugu'}
        >
          {isListening ? (
            <>
              <span className="w-2 h-2 rounded-full bg-white animate-ping mr-0.5" />
              <MicOff className="w-3.5 h-3.5" />
              <span>Listening...</span>
            </>
          ) : (
            <>
              <Mic className="w-3.5 h-3.5 text-teal-600" />
              <span>Voice-to-Text</span>
              <Sparkles className="w-3 h-3 text-amber-500" />
            </>
          )}
        </button>

        {/* Demo prompt shortcut */}
        <button
          type="button"
          onClick={simulateVoiceDemo}
          className="text-[11px] text-slate-400 hover:text-teal-700 underline underline-offset-2 transition"
          title="Try a simulated voice sample"
        >
          Sample Voice
        </button>
      </div>

      {/* Live speech feedback pill */}
      {interimText && (
        <div className="mt-2 p-2.5 rounded-xl bg-teal-50/90 border border-teal-200 text-teal-900 text-xs flex items-start gap-2 shadow-sm animate-fadeIn">
          <Volume2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5 animate-pulse" />
          <div className="flex-1">
            <div className="font-semibold text-[11px] text-teal-700 uppercase tracking-wide">
              {isListening ? 'Live Voice Input (Speak clearly)' : 'Transcribed Voice Text'}
            </div>
            <div className="italic text-slate-800 mt-0.5">{interimText}</div>
          </div>
        </div>
      )}
    </div>
  );
};
