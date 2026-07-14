import { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { getPageSpeechAudio } from "../api";

// Keep generated audio for the current browser session. Replaying the same
// page instruction is immediate and does not make another TTS request.
const audioCache = new Map();

function browserFallback(text, lang, onFinish) {
  if (!window.speechSynthesis) {
    onFinish();
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === "hi" ? "hi-IN" : lang === "gu" ? "gu-IN" : "en-IN";
  utterance.onend = utterance.onerror = onFinish;
  window._currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

export default function SpeechButton({ text, lang = "en" }) {
  const [speaking, setSpeaking] = useState(false);
  const requestVersion = useRef(0);
  const audioRef = useRef(null);

  const stopPlayback = () => {
    // Invalidates an in-flight request too, so late audio can never start.
    requestVersion.current += 1;
    window.speechSynthesis?.cancel();
    audioRef.current?.pause();
    audioRef.current = null;
    window._currentPageAudio?.pause();
    window._currentPageAudio = null;
    window._currentUtterance = null;
    setSpeaking(false);
  };

  const handleSpeak = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (speaking) {
      stopPlayback();
      return;
    }
    if (!text?.trim()) return;

    stopPlayback();
    const version = requestVersion.current;
    const cacheKey = `${lang}:${text}`;
    setSpeaking(true);

    try {
      let url = audioCache.get(cacheKey);
      if (!url) {
        url = await getPageSpeechAudio(text, lang);
        audioCache.set(cacheKey, url);
      }
      if (version !== requestVersion.current) return;

      const audio = new Audio(url);
      audioRef.current = audio;
      window._currentPageAudio = audio;
      const finish = () => {
        if (version !== requestVersion.current) return;
        audioRef.current = null;
        window._currentPageAudio = null;
        setSpeaking(false);
      };
      audio.onended = finish;
      audio.onerror = () => {
        if (version === requestVersion.current) browserFallback(text, lang, finish);
      };
      await audio.play();
    } catch {
      if (version === requestVersion.current) browserFallback(text, lang, () => {
        if (version === requestVersion.current) setSpeaking(false);
      });
    }
  };

  const label = speaking ? (lang === "hi" ? "रोकें" : lang === "gu" ? "બંધ કરો" : "Stop") : (lang === "hi" ? "सुनें" : lang === "gu" ? "સાંભળો" : "Listen");
  return <button className={`speech-btn ${speaking ? "speaking" : ""}`} onClick={handleSpeak} title={label} aria-label={label} type="button">
    {speaking ? <VolumeX size={14} /> : <Volume2 size={14} />}<span>{label}</span>
  </button>;
}
