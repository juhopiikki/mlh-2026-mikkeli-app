/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
  Zap,
  Play,
  RotateCcw,
  Check,
  Copy,
  Sliders,
  Award,
  Layers,
  Cpu,
  Radio,
  ExternalLink,
  Tag,
  AlertCircle,
  HelpCircle,
  Key,
  Flame,
  CheckCircle2,
  FileText,
  Languages,
  Mic,
  Settings,
  ChevronDown,
  RefreshCw
} from 'lucide-react';

interface Character {
  id: string;
  name: string;
  nameFi: string;
  title: string;
  titleFi: string;
  avatarEmoji: string;
  tagline: string;
  taglineFi: string;
  defaultVoiceId: string;
  defaultPitch: number;
  defaultRate: number;
  colorTheme: {
    badge: string;
    border: string;
    glow: string;
    accent: string;
  };
}

interface VoiceOption {
  id: string;
  name: string;
  gender: 'male' | 'female';
  tone: string;
  recommendedFor: string;
}

const VOICE_OPTIONS: VoiceOption[] = [
  { id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold (Deep Grumpy / Matti)', gender: 'male', tone: 'Deep, rugged baritone', recommendedFor: 'Matti the Maker' },
  { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George (Raspy / Finnish Craftsman)', gender: 'male', tone: 'Raspy, authentic older maker', recommendedFor: 'Matti / Jari' },
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel (Clear Tech / Dr. Gemma)', gender: 'female', tone: 'Analytical, calm, articulate', recommendedFor: 'Dr. Gemma' },
  { id: 'XB0fDUnXU5powFXDhCwa', name: 'Charlotte (Nordic Expressive / Aino)', gender: 'female', tone: 'Soft Scandinavian warmth', recommendedFor: 'Aino / Nordic Guide' },
  { id: 'IKne3meq5aSn9XLyUdCD', name: 'Charlie (Natural Friendly / Norppa)', gender: 'male', tone: 'Casual, friendly, youthful', recommendedFor: 'Norppa the Seal' },
  { id: 'jsCqWAovK2LkecY7zXl4', name: 'Freya (Energetic / Mimmi)', gender: 'female', tone: 'Expressive and playful', recommendedFor: 'Playful Nature' },
  { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam (Sarcastic Narrator / RoastBot)', gender: 'male', tone: 'Crisp, dramatic comedic delivery', recommendedFor: 'RoastBot 9000' },
  { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel (Deep Sage / Ukko)', gender: 'male', tone: 'Epic, authoritative resonance', recommendedFor: 'Väinämöinen / Ukko' },
  { id: 'D38z5RcWu1voky8WS1ja', name: 'Fin (Punchy Android / Kone)', gender: 'male', tone: 'Upbeat and sharp', recommendedFor: 'Cyberpunk Drone' }
];

const CHARACTERS: Character[] = [
  {
    id: 'matti',
    name: 'Matti the Maker',
    nameFi: 'Matti Nikkari',
    title: 'Veteran Finnish Hacklab Craftsman',
    titleFi: 'Hacklab Mikkelin verstasveteraani',
    avatarEmoji: '🧔‍♂️',
    tagline: 'Dry Finnish humor, sighs (*huoh*), loves black kahvi, and knows every soldering flaw.',
    taglineFi: 'Kuiva savolainen huumori, huokailua (*huoh*), mustaa Juhla Mokkaa ja armoton tinakritiikki.',
    defaultVoiceId: 'VR6AewLTigWG4xSOukaG',
    defaultPitch: 0.85,
    defaultRate: 0.95,
    colorTheme: {
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      border: 'border-amber-500/40',
      glow: 'shadow-amber-950/40',
      accent: 'text-amber-400'
    }
  },
  {
    id: 'dr_gemma',
    name: 'Dr. Gemma',
    nameFi: 'Dr. Gemma',
    title: 'Cyberpunk Hardware Diagnostician',
    titleFi: 'Kyberpunk-laitteistodiagnostikko',
    avatarEmoji: '🔬',
    tagline: 'High-tech forensic analysis, micro-defect scanning, and enthusiastic futuristic engineering.',
    taglineFi: 'Huipputekninen mikroskooppianalyysi, lämpökuvaus ja tulevaisuuden komponenttietsintä.',
    defaultVoiceId: '21m00Tcm4TlvDq8ikWAM',
    defaultPitch: 1.1,
    defaultRate: 1.05,
    colorTheme: {
      badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      border: 'border-cyan-500/40',
      glow: 'shadow-cyan-950/40',
      accent: 'text-cyan-400'
    }
  },
  {
    id: 'norppa',
    name: 'Norppa the Seal',
    nameFi: 'Saimaan Norppa',
    title: 'Lake Saimaa Wildlife Inspector',
    titleFi: 'Saimaan vesistö- ja kalatarkastaja',
    avatarEmoji: '🦭',
    tagline: 'Endangered Saimaa seal who rates human contraptions based on water cleanliness and fish.',
    taglineFi: 'Ihmettelee ihmisten vempaimia ja antaa pisteitä kalojen ja puhtaan Saimaan mukaan.',
    defaultVoiceId: 'IKne3meq5aSn9XLyUdCD',
    defaultPitch: 1.2,
    defaultRate: 1.0,
    colorTheme: {
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      border: 'border-emerald-500/40',
      glow: 'shadow-emerald-950/40',
      accent: 'text-emerald-400'
    }
  },
  {
    id: 'roast_bot',
    name: 'RoastBot 9000',
    nameFi: 'RoastBot 9000',
    title: 'Sarcastic AI Workshop Critic',
    titleFi: 'Sarkastinen Hackathon-kriitikko',
    avatarEmoji: '🔥',
    tagline: 'Unfiltered comedy roast of your messy desk, cable nests, and optimistic solder bridges.',
    taglineFi: 'Armotonta huumorikuittailua johtohässäköistä, tinasilloista ja 3D-tulosteen laadusta.',
    defaultVoiceId: 'pNInz6obpgDQGcFmaJgB',
    defaultPitch: 0.95,
    defaultRate: 1.1,
    colorTheme: {
      badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      border: 'border-rose-500/40',
      glow: 'shadow-rose-950/40',
      accent: 'text-rose-400'
    }
  }
];

const SAMPLE_PRESETS = [
  {
    id: 'spaghetti',
    name: '3D Print Spaghetti Failure',
    nameFi: '3D-tulosteen spagettikatastrofi',
    category: '3D Printing',
    description: 'Catastrophic detached first-layer nest of PLA filament on a heated build plate.',
    imageUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%231e293b"/><rect x="80" y="240" width="440" height="24" rx="4" fill="%23334155"/><rect x="100" y="220" width="400" height="20" rx="2" fill="%2364748b"/><path d="M140,220 Q200,80 260,210 Q320,60 380,220 Q440,90 480,210" fill="none" stroke="%23f97316" stroke-width="14" stroke-linecap="round"/><path d="M180,210 Q240,110 300,190 Q360,70 420,200" fill="none" stroke="%23fb923c" stroke-width="10"/><path d="M220,180 Q290,120 340,200 Q400,130 450,190" fill="none" stroke="%23fdba74" stroke-width="8"/><circle cx="280" cy="110" r="15" fill="%23ef4444"/><text x="305" y="115" fill="%23ffffff" font-family="monospace" font-size="14">Detached Extrusion</text><text x="300" y="320" text-anchor="middle" fill="%2394a3b8" font-family="sans-serif" font-size="16">PRUSA MK4 BED #2 • FAILED PRINT</text></svg>'
  },
  {
    id: 'breadboard',
    name: 'Messy Arduino Breadboard',
    nameFi: 'Sotkuinen koekytkentälevy',
    category: 'Electronics',
    description: 'Tangled jumper wires, NE555 timer chip, LEDs and a suspicious 9V battery clip.',
    imageUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%230f172a"/><rect x="120" y="80" width="360" height="240" rx="8" fill="%23f8fafc"/><rect x="250" y="150" width="100" height="40" rx="4" fill="%231e293b"/><text x="300" y="175" text-anchor="middle" fill="%23ffffff" font-family="monospace" font-size="12">NE555P</text><path d="M150,100 C150,220 220,160 250,160" fill="none" stroke="%23ef4444" stroke-width="6"/><path d="M200,280 C280,220 300,280 340,170" fill="none" stroke="%233b82f6" stroke-width="6"/><path d="M350,160 C420,130 400,260 450,260" fill="none" stroke="%2310b981" stroke-width="6"/><circle cx="430" cy="120" r="8" fill="%23eab308"/><text x="300" y="360" text-anchor="middle" fill="%23cbd5e1" font-family="sans-serif" font-size="16">HACKLAB BENCH #1 • PROTOTYPE RIG</text></svg>'
  },
  {
    id: 'pulla',
    name: 'Finnish Kahvi & Korvapuusti',
    nameFi: 'Musta Juhla Mokka & Korvapuusti',
    category: 'Workshop Fuel',
    description: 'Essential Hacklab fuel: A steaming mug of black filter coffee and cinnamon bun.',
    imageUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%2318181b"/><circle cx="220" cy="200" r="80" fill="%23f4f4f5"/><circle cx="220" cy="200" r="65" fill="%233f200c"/><path d="M285,180 C315,180 315,220 285,220" fill="none" stroke="%23f4f4f5" stroke-width="12" stroke-linecap="round"/><ellipse cx="380" cy="210" rx="75" ry="60" fill="%23b45309"/><path d="M330,200 Q380,170 430,200 Q380,240 330,220" fill="none" stroke="%2378350f" stroke-width="8"/><circle cx="360" cy="190" r="3" fill="%23ffffff"/><circle cx="390" cy="220" r="3" fill="%23ffffff"/><circle cx="410" cy="195" r="3" fill="%23ffffff"/><text x="300" y="340" text-anchor="middle" fill="%23e4e4e7" font-family="sans-serif" font-size="16">HACKLAB BREAK AREA • MIKKELI KAHVI</text></svg>'
  },
  {
    id: 'saimaa_seal',
    name: 'Lake Saimaa Ringed Seal',
    nameFi: 'Saimaan Norppa rantakalliolla',
    category: 'Nature',
    description: 'A cute Saimaa ringed seal sunbathing on a smooth granite rock near Mikkeli.',
    imageUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%230c4a6e"/><path d="M0,260 Q150,230 300,260 T600,250 L600,400 L0,400 Z" fill="%230369a1"/><ellipse cx="320" cy="260" rx="180" ry="70" fill="%23334155"/><ellipse cx="320" cy="245" rx="120" ry="50" fill="%23475569"/><circle cx="410" cy="225" r="35" fill="%23334155"/><circle cx="425" cy="220" r="5" fill="%23000000"/><circle cx="435" cy="228" r="3" fill="%23000000"/><ellipse cx="250" cy="245" rx="10" ry="6" fill="%231e293b"/><ellipse cx="300" cy="255" rx="8" ry="5" fill="%231e293b"/><ellipse cx="350" cy="240" rx="9" ry="6" fill="%231e293b"/><text x="300" y="370" text-anchor="middle" fill="%23bae6fd" font-family="sans-serif" font-size="16">LAKE SAIMAA • SAIMAANNORPPA HABITAT</text></svg>'
  }
];

export default function App() {
  const [language, setLanguage] = useState<'fi' | 'en'>('fi');
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(CHARACTERS[0]);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>(CHARACTERS[0].defaultVoiceId);
  const [currentImage, setCurrentImage] = useState<string>(SAMPLE_PRESETS[0].imageUrl);
  const [currentImageName, setCurrentImageName] = useState<string>(SAMPLE_PRESETS[0].nameFi);

  // Vision Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [spokenText, setSpokenText] = useState<string>(
    "No niin! Katotaas mitä täältä löytyy. Tuo ensimmäinen kerros on irronnut pediltä kuin liisteri paperista. Hae pöydältä kaksi purkki isopropanolia ja pyyhitään tuo PEI-alusta ennen seuraavaa yritystä."
  );
  const [detectedTags, setDetectedTags] = useState<Array<{ label: string; description: string }>>([
    { label: 'Irronnut pursotus', description: 'Muovi irronnut tulostusalustalta' },
    { label: 'Spagettilangat', description: 'Sotkeutunutta PLA-filamenttia' },
    { label: 'Z-korkeuden virhe', description: 'Suutin liian korkealla alustasta' }
  ]);
  const [verdict, setVerdict] = useState<string>('Pietarinkadun työpajatarkastus: Tarvitsee lisää tinaa ja kahvia.');
  const [emotion, setEmotion] = useState<string>('skeptical');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [lastModelSource, setLastModelSource] = useState<string>('Gemma Vision (gemini-3.5-flash)');

  // ElevenLabs Voice State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState(() => {
    return localStorage.getItem('elevenlabs_api_key') || '';
  });
  const [voiceSource, setVoiceSource] = useState<'elevenlabs' | 'browser'>('browser');
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [voiceStability, setVoiceStability] = useState(0.5);
  const [voiceClarity, setVoiceClarity] = useState(0.8);
  const [testVoiceStatus, setTestVoiceStatus] = useState<string | null>(null);

  // Webcam State
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Persist ElevenLabs API Key
  const handleSaveApiKey = (key: string) => {
    setElevenLabsApiKey(key);
    localStorage.setItem('elevenlabs_api_key', key);
  };

  // Convert any image or SVG to clean JPEG base64 data
  const getJpegBase64 = (imageSrc: string): Promise<string> => {
    return new Promise((resolve) => {
      if (imageSrc.startsWith('data:image/jpeg;base64,') || imageSrc.startsWith('data:image/png;base64,')) {
        resolve(imageSrc);
        return;
      }
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 600;
        canvas.height = img.naturalHeight || 400;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
          return;
        }
        resolve(imageSrc);
      };
      img.onerror = () => resolve(imageSrc);
      img.src = imageSrc;
    });
  };

  // Trigger speech playback (ElevenLabs Multilingual v2 or Browser Speech)
  const speakDialogue = async (text: string, overrideVoiceId?: string) => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }

    setIsSpeaking(true);
    const targetVoiceId = overrideVoiceId || selectedVoiceId || selectedCharacter.defaultVoiceId;

    // Check if ElevenLabs key is available
    if (elevenLabsApiKey.trim()) {
      try {
        const res = await fetch('/api/elevenlabs/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            voiceId: targetVoiceId,
            customApiKey: elevenLabsApiKey.trim(),
            language,
            stability: voiceStability,
            similarity_boost: voiceClarity
          })
        });

        if (res.ok) {
          const blob = await res.blob();
          const audioUrl = URL.createObjectURL(blob);
          const audio = new Audio(audioUrl);
          audioRef.current = audio;

          audio.onended = () => {
            setIsSpeaking(false);
          };
          audio.onerror = () => {
            fallbackBrowserSpeech(text);
          };

          setVoiceSource('elevenlabs');
          await audio.play();
          return;
        }
      } catch (err) {
        console.warn('ElevenLabs API request failed, falling back to browser speech:', err);
      }
    }

    // Fallback: Browser Native Web Speech API
    fallbackBrowserSpeech(text);
  };

  const fallbackBrowserSpeech = (text: string) => {
    if (!('speechSynthesis' in window)) {
      setIsSpeaking(false);
      return;
    }

    setVoiceSource('browser');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = selectedCharacter.defaultPitch;
    utterance.rate = selectedCharacter.defaultRate;
    utterance.lang = language === 'fi' ? 'fi-FI' : 'en-US';

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice =
      voices.find((v) => (language === 'fi' ? v.lang.startsWith('fi') : v.lang.startsWith('en'))) ||
      voices[0];
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      setIsSpeaking(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsSpeaking(false);
  };

  // Test an ElevenLabs voice directly
  const handleTestVoice = async (voiceId: string) => {
    setTestVoiceStatus(`Puhutaan äänellä ${voiceId.slice(0, 6)}...`);
    const sampleText =
      language === 'fi'
        ? 'Terve Hacklab Mikkeli! Tämä ääni toimii sujuvasti ElevenLabs-moottorilla.'
        : 'Hello from Hacklab Mikkeli! This voice is working smoothly on ElevenLabs.';
    await speakDialogue(sampleText, voiceId);
    setTimeout(() => setTestVoiceStatus(null), 3000);
  };

  // Run Multimodal Vision Analysis on Current Image
  const analyzeCurrentImage = async (focusItem?: string) => {
    setIsAnalyzing(true);
    stopSpeaking();

    const targetFocus = focusItem || customPrompt.trim();

    try {
      const validJpegBase64 = await getJpegBase64(currentImage);

      const res = await fetch('/api/vision/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: validJpegBase64,
          character: selectedCharacter.id,
          focusArea: targetFocus,
          language,
          mimeType: 'image/jpeg'
        })
      });

      const data = await res.json();
      if (data.speechText) {
        setSpokenText(data.speechText);
        setEmotion(data.emotion || 'amused');
        if (data.tags && data.tags.length > 0) setDetectedTags(data.tags);
        if (data.hacklabVerdict) setVerdict(data.hacklabVerdict);
        if (data.modelUsed) setLastModelSource(`Live: ${data.modelUsed} (${data.durationMs}ms)`);

        // Speak aloud immediately!
        speakDialogue(data.speechText);
      }
    } catch (err) {
      console.error('Vision analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Image Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCurrentImageName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setCurrentImage(base64);
      setTimeout(() => {
        analyzeCurrentImage();
      }, 100);
    };
    reader.readAsDataURL(file);
  };

  // Webcam Controls
  const startWebcam = async () => {
    setIsWebcamOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Webcam access error:', err);
      setIsWebcamOpen(false);
      alert('Could not access camera. Please allow camera permissions or upload an image.');
    }
  };

  const captureWebcamSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0, 640, 480);
    const base64 = canvas.toDataURL('image/jpeg');
    setCurrentImage(base64);
    setCurrentImageName(language === 'fi' ? 'Webkamera-kuva' : 'Webcam Snapshot');

    const stream = videoRef.current.srcObject as MediaStream;
    stream?.getTracks().forEach((track) => track.stop());
    setIsWebcamOpen(false);

    setTimeout(() => {
      analyzeCurrentImage();
    }, 150);
  };

  const handleCopyPitchDeck = () => {
    const text = `# Pikseli: Multimodal Vision × ElevenLabs Voice Companion
## Hacktoberfest Hack Day Mikkeli × Hacklab Mikkeli ry

### Dual MLH Track Qualification:
1. Best Use of Gemma (Google Multimodal Vision):
   - Real-time inspection of 3D prints, circuits, and workbench tools.
   - Detects Z-offset errors, cold solder joints, resistor color bands, and lake turbidity.
2. Best Use of ElevenLabs (Multilingual Neural Voice AI):
   - Bilingual Suomi / English voice synthesis with eleven_multilingual_v2.
   - Character personas (Matti the Maker, Dr. Gemma, Norppa, RoastBot).

### 3-Minute Hackathon Presentation:
- Slide 1: Makers can't look at screens with a soldering iron in hand.
- Slide 2: Gemma inspects the image live.
- Slide 3: ElevenLabs speaks in fluent Finnish or English, guiding the repair.
- Slide 4: Open source on GitHub under MIT license!`;

    navigator.clipboard.writeText(text);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Hacktoberfest Header Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-amber-700 text-white text-xs py-1.5 px-4 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2 font-medium">
            <span className="bg-slate-950 text-amber-300 font-bold px-2 py-0.5 rounded text-[10px] tracking-wide">
              MLH HACK DAY
            </span>
            <span>Hacktoberfest Hack Day Mikkeli × Hacklab Mikkeli ry</span>
            <span className="hidden sm:inline-block bg-orange-950/60 px-2 py-0.5 rounded text-[10px] text-amber-200 border border-orange-400/30">
              Gemma + ElevenLabs
            </span>
          </div>

          <div className="flex items-center space-x-3 text-amber-100 text-[11px]">
            {/* Suomi / English Toggle */}
            <div className="flex items-center space-x-1 bg-slate-950/60 rounded-lg p-0.5 border border-amber-300/30">
              <button
                onClick={() => {
                  setLanguage('fi');
                  setTimeout(() => analyzeCurrentImage(), 50);
                }}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition flex items-center space-x-1 ${
                  language === 'fi' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>🇫🇮</span>
                <span>Suomi</span>
              </button>
              <button
                onClick={() => {
                  setLanguage('en');
                  setTimeout(() => analyzeCurrentImage(), 50);
                }}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition flex items-center space-x-1 ${
                  language === 'en' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>🇬🇧</span>
                <span>English</span>
              </button>
            </div>

            <span className="hidden md:inline">Pietarinkatu 23</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-extrabold shadow-lg shadow-orange-950">
              <Bot className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base tracking-tight text-white">Pikseli Voiced Vision</span>
                <span className={`text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full border ${
                  elevenLabsApiKey ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                }`}>
                  {elevenLabsApiKey ? 'ElevenLabs Active' : 'Browser Audio'}
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                {language === 'fi' ? 'Osoita esinettä tai lataa kuva — hahmo kertoo ääneen mitä näkee!' : 'Hold up an object or upload a photo — your AI companion speaks what it sees!'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Voice & ElevenLabs Settings Button */}
            <button
              onClick={() => setShowVoiceModal(true)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-white transition text-xs flex items-center space-x-1.5"
            >
              <Mic className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'fi' ? 'Ääni & Key' : 'Voice & Key'}</span>
            </button>

            <button
              onClick={handleCopyPitchDeck}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition text-xs flex items-center space-x-1"
              title="Copy Pitch Deck Outline"
            >
              {copiedPitch ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileText className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">Pitch Script</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 flex flex-col space-y-6">
        {/* Character Persona Selector Cards */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <span>{language === 'fi' ? 'Valitse puhuva työpajahahmo' : 'Choose Your Voiced Character Persona'}</span>
            </h3>
            <span className="text-[10px] text-slate-500">
              {language === 'fi' ? 'Kieli: Suomi (ElevenLabs Multilingual v2)' : 'Language: English'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {CHARACTERS.map((char) => {
              const isSelected = selectedCharacter.id === char.id;
              return (
                <button
                  key={char.id}
                  onClick={() => {
                    setSelectedCharacter(char);
                    setSelectedVoiceId(char.defaultVoiceId);
                    setTimeout(() => analyzeCurrentImage(), 50);
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between relative group ${
                    isSelected
                      ? `bg-slate-900 ${char.colorTheme.border} ring-1 ring-amber-500/40 shadow-lg ${char.colorTheme.glow}`
                      : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/80 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{char.avatarEmoji}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${char.colorTheme.badge}`}>
                        {char.id === 'matti' ? 'Mikkeli' : char.id === 'dr_gemma' ? 'Cyberpunk' : char.id === 'norppa' ? 'Saimaa' : 'Comedy'}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-white">
                        {language === 'fi' ? char.nameFi : char.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {language === 'fi' ? char.titleFi : char.title}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {language === 'fi' ? char.taglineFi : char.tagline}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Core Stage: Image Feed + Voiced Speech HUD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Image Feed / Camera (6 cols) */}
          <div className="lg:col-span-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-5 flex flex-col justify-between shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                  {language === 'fi' ? 'Kuvalähde & Webkamera' : 'Visual Input Feed'}
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400 truncate max-w-[200px]">{currentImageName}</span>
            </div>

            {/* Image Canvas / Viewport */}
            <div className="h-64 sm:h-72 rounded-2xl bg-slate-950 border border-slate-800 relative overflow-hidden flex items-center justify-center p-2 shadow-inner">
              {isWebcamOpen ? (
                <div className="relative w-full h-full flex flex-col items-center justify-center">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover rounded-xl" />
                  <button
                    onClick={captureWebcamSnapshot}
                    className="absolute bottom-3 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg"
                  >
                    <Camera className="w-4 h-4" />
                    <span>{language === 'fi' ? 'Ota valokuva' : 'Capture Snapshot'}</span>
                  </button>
                </div>
              ) : (
                <img
                  src={currentImage}
                  alt="Inspection target"
                  className="max-h-full max-w-full object-contain rounded-xl select-none"
                />
              )}

              {/* Scanning Overlay Animation when Analyzing */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex flex-col items-center justify-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40 animate-pulse">
                    <Sparkles className="w-6 h-6 animate-spin" />
                  </div>
                  <p className="text-xs font-mono text-amber-300 tracking-wider uppercase">
                    {language === 'fi' ? 'Gemma Vision tutkii kuvan pikseleitä...' : 'Gemma Vision Scanning Image Pixels...'}
                  </p>
                </div>
              )}
            </div>

            {/* Input Action Controls */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {/* File upload */}
              <label className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition cursor-pointer text-xs flex items-center justify-center space-x-2">
                <Upload className="w-4 h-4 text-amber-400" />
                <span>{language === 'fi' ? 'Lataa kuva' : 'Upload Photo'}</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>

              {/* Webcam Snapshot */}
              <button
                onClick={startWebcam}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition text-xs flex items-center justify-center space-x-2"
              >
                <Camera className="w-4 h-4 text-cyan-400" />
                <span>{isWebcamOpen ? 'Kamera auki' : language === 'fi' ? 'Live Webkamera' : 'Live Webcam'}</span>
              </button>

              {/* Re-Analyze Button */}
              <button
                onClick={() => analyzeCurrentImage()}
                disabled={isAnalyzing}
                className="col-span-2 sm:col-span-1 p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-amber-950/40"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>{isAnalyzing ? (language === 'fi' ? 'Tutkitaan...' : 'Inspecting...') : language === 'fi' ? 'Tarkasta kuva' : 'Inspect Now'}</span>
              </button>
            </div>

            {/* Custom Question / Focus Input */}
            <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 focus-within:border-amber-500/60 transition">
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') analyzeCurrentImage();
                }}
                placeholder={
                  language === 'fi'
                    ? `Kysy Matilta jotain tästä kuvasta (esim. 'Mikä tuo vika on?')...`
                    : `Ask ${selectedCharacter.name} specifically (e.g. 'What is that flaw?')...`
                }
                className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 px-2 py-1 focus:outline-none"
              />
              <button
                onClick={() => analyzeCurrentImage()}
                disabled={isAnalyzing}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs shrink-0 transition"
              >
                {language === 'fi' ? 'Kysy' : 'Ask'}
              </button>
            </div>

            {/* Preset Samples */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] text-slate-400 font-medium">
                {language === 'fi' ? 'Tai testaa valmiilla Hacklab-kuvilla:' : 'Or test with Hacklab test photos:'}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SAMPLE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setCurrentImage(preset.imageUrl);
                      setCurrentImageName(language === 'fi' ? preset.nameFi : preset.name);
                      setIsWebcamOpen(false);
                      setTimeout(() => analyzeCurrentImage(), 50);
                    }}
                    className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 text-left transition text-[11px] text-slate-300 hover:text-white truncate"
                  >
                    {language === 'fi' ? preset.nameFi : preset.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Voiced Character Stage & Speech HUD (6 cols) */}
          <div className="lg:col-span-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-5 flex flex-col justify-between shadow-2xl space-y-4">
            {/* Character Status Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{selectedCharacter.avatarEmoji}</span>
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center space-x-1.5">
                    <span>{language === 'fi' ? selectedCharacter.nameFi : selectedCharacter.name}</span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {emotion}
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-400 flex items-center space-x-1.5">
                    <span className={elevenLabsApiKey ? 'text-emerald-400 font-semibold' : 'text-slate-400'}>
                      {elevenLabsApiKey ? '🎙️ ElevenLabs Multilingual' : '🔊 Browser Speech'}
                    </span>
                    <span>•</span>
                    <span className="text-emerald-400 font-mono text-[10px]">{lastModelSource}</span>
                  </p>
                </div>
              </div>

              {/* Speech Toggle Button */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    if (isSpeaking) {
                      stopSpeaking();
                    } else {
                      speakDialogue(spokenText);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition flex items-center space-x-1.5 ${
                    isSpeaking
                      ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse shadow-md shadow-amber-950/50'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isSpeaking ? (language === 'fi' ? 'Pysäytä ääni' : 'Stop Voice') : language === 'fi' ? 'Puhu ääneen' : 'Speak Out Loud'}</span>
                </button>
              </div>
            </div>

            {/* Speaking Mouth / Waveform Visualizer */}
            <div className="h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center space-x-1 px-4 overflow-hidden">
              {[25, 45, 80, 50, 95, 65, 30, 85, 40, 75, 90, 35, 60, 80, 45, 70, 95, 40, 65, 30, 50].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 rounded-full bg-gradient-to-t from-amber-500 to-orange-400 transition-all duration-150"
                  style={{
                    height: isSpeaking ? `${Math.max(15, h * (i % 2 === 0 ? 1 : 0.75))}%` : '15%',
                    opacity: isSpeaking ? 0.95 : 0.2
                  }}
                />
              ))}
            </div>

            {/* Spoken Dialogue Box */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-3 relative">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                {language === 'fi' ? 'Puhuttu kommentti (ElevenLabs / Gemma):' : 'Spoken Commentary:'}
              </span>
              <p className="text-slate-100 text-sm leading-relaxed font-sans select-all">
                "{spokenText}"
              </p>

              <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400">
                <span className="italic text-amber-300/80">"{verdict}"</span>
                <button
                  onClick={() => speakDialogue(spokenText)}
                  className="text-amber-400 hover:underline flex items-center space-x-1"
                >
                  <Play className="w-3 h-3" />
                  <span>{language === 'fi' ? 'Toista uudelleen' : 'Replay Voice'}</span>
                </button>
              </div>
            </div>

            {/* Interactive Detected Items / Bounding Tags */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Tag className="w-3.5 h-3.5 text-cyan-400" />
                <span>
                  {language === 'fi'
                    ? 'Havaitut kohteet kuvasta (Klikkaa kysyäksesi):'
                    : 'Detected Visual Elements (Click to Ask Character):'}
                </span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {detectedTags.map((tag, idx) => (
                  <button
                    key={idx}
                    onClick={() => analyzeCurrentImage(tag.label)}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-left transition group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-200 group-hover:text-amber-300">
                        {tag.label}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {language === 'fi' ? 'Kysy →' : 'Ask →'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{tag.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dual Hackathon Track Highlights */}
        <div className="p-5 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Track 1: Best Use of Gemma (Google Multimodal Vision)</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'fi'
                ? 'Gemma Vision tarkastaa todellisen kamerakuvan tai valokuvan pikselit. Se tunnistaa elektroniikan, juotosvirheet, 3D-tulosteen kerrosongelmat ja työpajan esineet aidoista kuvista.'
                : 'Processes the raw pixels of your camera feed or uploaded photo. Unlike standard text bots, it segments physical electronics, identifies 3D print failures, counts resistor bands, and spots environmental lake conditions.'}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-sm text-white flex items-center space-x-2">
              <Radio className="w-4 h-4 text-cyan-400" />
              <span>Track 2: Best Use of ElevenLabs (Multilingual v2 Voice AI)</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'fi'
                ? 'ElevenLabs multilingual v2 tuo Matin ja muut hahmot eloon aidolla suomen kielellä. Nikkari voi kuunnella neuvoja työpöydän äärellä kädet vapaina kolvia ja työkaluja varten!'
                : 'Brings the analysis alive with personality-driven character voices in both Finnish and English. Makers in physical workshops can listen to Matti or Dr. Gemma guide them through repairs hands-free!'}
            </p>
          </div>
        </div>
      </main>

      {/* Voice Selection & Settings Modal */}
      {showVoiceModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">
                    {language === 'fi' ? 'ElevenLabs Ääniasetukset & Äänikirjasto' : 'ElevenLabs Voice Library & Settings'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {language === 'fi' ? 'Valitse ääni tai syötä oma Voice ID ja API Key' : 'Pick a voice or provide custom Voice ID'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowVoiceModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2.5 py-1 rounded-lg bg-slate-800"
              >
                {language === 'fi' ? 'Sulje' : 'Close'}
              </button>
            </div>

            {/* API Key Input */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <label className="text-xs font-semibold text-slate-200 block flex items-center space-x-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'fi' ? 'ElevenLabs API-avain (xi-api-key)' : 'ElevenLabs API Key'}</span>
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="password"
                  value={elevenLabsApiKey}
                  onChange={(e) => handleSaveApiKey(e.target.value)}
                  placeholder="Paste ElevenLabs key here (e.g. sk_... or hex key)"
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono focus:border-amber-500 focus:outline-none"
                />
                {elevenLabsApiKey && (
                  <span className="text-emerald-400 text-xs font-bold px-2 py-1 rounded bg-emerald-950/40 border border-emerald-900/40 shrink-0">
                    ✓ Tallennettu
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                {language === 'fi'
                  ? 'Avain tallentuu selaimesi muistiin (localStorage). Tyhjänä sovellus käyttää selaimen perusääntä.'
                  : 'Saved locally in your browser. Leave blank to use browser speech synthesis.'}
              </p>
            </div>

            {/* Voice Options Grid */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-200 block">
                {language === 'fi' ? 'Valitse ElevenLabs-ääni hahmolle:' : 'Select ElevenLabs Voice:'}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto p-1">
                {VOICE_OPTIONS.map((v) => {
                  const isSelected = selectedVoiceId === v.id;
                  return (
                    <div
                      key={v.id}
                      className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500/50'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{v.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono capitalize">{v.gender}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{v.tone}</p>
                        <p className="text-[10px] text-amber-400/90 mt-1 font-mono">{v.recommendedFor}</p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-900 flex items-center justify-between">
                        <button
                          onClick={() => setSelectedVoiceId(v.id)}
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition ${
                            isSelected
                              ? 'bg-amber-500 text-slate-950 font-bold'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {isSelected ? '✓ Valittu' : 'Valitse'}
                        </button>

                        <button
                          onClick={() => handleTestVoice(v.id)}
                          className="text-[11px] text-slate-400 hover:text-white flex items-center space-x-1"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Testaa</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom Voice ID Input */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-xs">
              <label className="text-slate-300 font-semibold block">
                {language === 'fi' ? 'Tai käytä omaa Voice ID:tä ElevenLabs VoiceLabista:' : 'Or use custom ElevenLabs Voice ID:'}
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={selectedVoiceId}
                  onChange={(e) => setSelectedVoiceId(e.target.value.trim())}
                  placeholder="Paste any custom Voice ID (e.g. 21m00Tcm4TlvDq8ikWAM)..."
                  className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono"
                />
                <button
                  onClick={() => handleTestVoice(selectedVoiceId)}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs shrink-0"
                >
                  Testaa
                </button>
              </div>
            </div>

            {/* Voice Tuning Sliders */}
            <div className="grid grid-cols-2 gap-4 pt-1 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Stability ({voiceStability})</span>
                  <span className="text-[10px]">{voiceStability < 0.5 ? 'Ilmeikäs' : 'Tasainen'}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={voiceStability}
                  onChange={(e) => setVoiceStability(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Similarity / Clarity ({voiceClarity})</span>
                  <span className="text-[10px]">Tarkkuus</span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="1.0"
                  step="0.05"
                  value={voiceClarity}
                  onChange={(e) => setVoiceClarity(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {testVoiceStatus && (
              <p className="text-xs text-cyan-400 font-mono animate-pulse text-center">{testVoiceStatus}</p>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowVoiceModal(false)}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-950/40"
              >
                {language === 'fi' ? 'Valmis & Tallenna' : 'Done & Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>Pikseli Voiced Vision • Hacktoberfest Hack Day Mikkeli × Hacklab Mikkeli ry</p>
          <p className="text-slate-600">Built with Gemma Multimodal Vision & ElevenLabs Multilingual Voice AI</p>
        </div>
      </footer>
    </div>
  );
}
