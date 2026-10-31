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
  FileText
} from 'lucide-react';

interface Character {
  id: string;
  name: string;
  title: string;
  avatarEmoji: string;
  tagline: string;
  voiceId: string;
  defaultPitch: number;
  defaultRate: number;
  colorTheme: {
    badge: string;
    border: string;
    glow: string;
    accent: string;
  };
}

const CHARACTERS: Character[] = [
  {
    id: 'matti',
    name: 'Matti the Maker',
    title: 'Veteran Finnish Hacklab Craftsman',
    avatarEmoji: '🧔‍♂️',
    tagline: 'Dry Finnish humor, sighs (*huoh*), loves black kahvi, and knows every soldering flaw.',
    voiceId: 'VR6AewLTigWG4xSOukaG', // Arnold / Grumpy
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
    title: 'Cyberpunk Hardware Diagnostician',
    avatarEmoji: '🔬',
    tagline: 'High-tech forensic analysis, micro-defect scanning, and enthusiastic futuristic engineering.',
    voiceId: '21m00Tcm4TlvDq8ikWAM', // Rachel
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
    title: 'Lake Saimaa Wildlife Inspector',
    avatarEmoji: '🦭',
    tagline: 'Endangered Saimaa seal who rates human contraptions based on water cleanliness and fish.',
    voiceId: 'AZnzlk1XvdvUeBnXmlld', // Domi / friendly
    defaultPitch: 1.25,
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
    title: 'Sarcastic AI Workshop Critic',
    avatarEmoji: '🔥',
    tagline: 'Unfiltered comedy roast of your messy desk, cable nests, and optimistic solder bridges.',
    voiceId: 'pNInz6obpgDQGcFmaJgB', // Adam
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
    category: '3D Printing',
    description: 'Catastrophic detached first-layer nest of PLA filament on a heated build plate.',
    // Stylized SVG base64 representation
    imageUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%231e293b"/><rect x="80" y="240" width="440" height="24" rx="4" fill="%23334155"/><rect x="100" y="220" width="400" height="20" rx="2" fill="%2364748b"/><path d="M140,220 Q200,80 260,210 Q320,60 380,220 Q440,90 480,210" fill="none" stroke="%23f97316" stroke-width="14" stroke-linecap="round"/><path d="M180,210 Q240,110 300,190 Q360,70 420,200" fill="none" stroke="%23fb923c" stroke-width="10"/><path d="M220,180 Q290,120 340,200 Q400,130 450,190" fill="none" stroke="%23fdba74" stroke-width="8"/><circle cx="280" cy="110" r="15" fill="%23ef4444"/><text x="305" y="115" fill="%23ffffff" font-family="monospace" font-size="14">Detached Extrusion</text><text x="300" y="320" text-anchor="middle" fill="%2394a3b8" font-family="sans-serif" font-size="16">PRUSA MK4 BED #2 • FAILED PRINT</text></svg>'
  },
  {
    id: 'breadboard',
    name: 'Messy Arduino Breadboard',
    category: 'Electronics',
    description: 'Tangled jumper wires, NE555 timer chip, LEDs and a suspicious 9V battery clip.',
    imageUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%230f172a"/><rect x="120" y="80" width="360" height="240" rx="8" fill="%23f8fafc"/><rect x="250" y="150" width="100" height="40" rx="4" fill="%231e293b"/><text x="300" y="175" text-anchor="middle" fill="%23ffffff" font-family="monospace" font-size="12">NE555P</text><path d="M150,100 C150,220 220,160 250,160" fill="none" stroke="%23ef4444" stroke-width="6"/><path d="M200,280 C280,220 300,280 340,170" fill="none" stroke="%233b82f6" stroke-width="6"/><path d="M350,160 C420,130 400,260 450,260" fill="none" stroke="%2310b981" stroke-width="6"/><circle cx="430" cy="120" r="8" fill="%23eab308"/><text x="300" y="360" text-anchor="middle" fill="%23cbd5e1" font-family="sans-serif" font-size="16">HACKLAB BENCH #1 • PROTOTYPE RIG</text></svg>'
  },
  {
    id: 'pulla',
    name: 'Finnish Kahvi & Korvapuusti',
    category: 'Workshop Fuel',
    description: 'Essential Hacklab fuel: A steaming mug of black filter coffee and cinnamon bun.',
    imageUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%2318181b"/><circle cx="220" cy="200" r="80" fill="%23f4f4f5"/><circle cx="220" cy="200" r="65" fill="%233f200c"/><path d="M285,180 C315,180 315,220 285,220" fill="none" stroke="%23f4f4f5" stroke-width="12" stroke-linecap="round"/><ellipse cx="380" cy="210" rx="75" ry="60" fill="%23b45309"/><path d="M330,200 Q380,170 430,200 Q380,240 330,220" fill="none" stroke="%2378350f" stroke-width="8"/><circle cx="360" cy="190" r="3" fill="%23ffffff"/><circle cx="390" cy="220" r="3" fill="%23ffffff"/><circle cx="410" cy="195" r="3" fill="%23ffffff"/><text x="300" y="340" text-anchor="middle" fill="%23e4e4e7" font-family="sans-serif" font-size="16">HACKLAB BREAK AREA • MIKKELI KAHVI</text></svg>'
  },
  {
    id: 'saimaa_seal',
    name: 'Lake Saimaa Ringed Seal',
    category: 'Nature',
    description: 'A cute Saimaa ringed seal sunbathing on a smooth granite rock near Mikkeli.',
    imageUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%230c4a6e"/><path d="M0,260 Q150,230 300,260 T600,250 L600,400 L0,400 Z" fill="%230369a1"/><ellipse cx="320" cy="260" rx="180" ry="70" fill="%23334155"/><ellipse cx="320" cy="245" rx="120" ry="50" fill="%23475569"/><circle cx="410" cy="225" r="35" fill="%23334155"/><circle cx="425" cy="220" r="5" fill="%23000000"/><circle cx="435" cy="228" r="3" fill="%23000000"/><ellipse cx="250" cy="245" rx="10" ry="6" fill="%231e293b"/><ellipse cx="300" cy="255" rx="8" ry="5" fill="%231e293b"/><ellipse cx="350" cy="240" rx="9" ry="6" fill="%231e293b"/><text x="300" y="370" text-anchor="middle" fill="%23bae6fd" font-family="sans-serif" font-size="16">LAKE SAIMAA • SAIMAANNORPPA HABITAT</text></svg>'
  }
];

export default function App() {
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(CHARACTERS[0]);
  const [currentImage, setCurrentImage] = useState<string>(SAMPLE_PRESETS[0].imageUrl);
  const [currentImageName, setCurrentImageName] = useState<string>(SAMPLE_PRESETS[0].name);

  // Vision Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [spokenText, setSpokenText] = useState<string>(
    "No niin! Look at this catastrophe. That first layer peeled right off the heatbed like cheap birch bark. Grab the 99% isopropanol from Bench #2, scrub that PEI sheet, and drink some kahvi while the bed cools down."
  );
  const [detectedTags, setDetectedTags] = useState<Array<{ label: string; description: string }>>([
    { label: 'Detached Extrusion', description: 'Plastic pulled off build surface' },
    { label: 'Layer Spaghetti', description: 'Tangled PLA filament mess' },
    { label: 'Bed Leveling Error', description: 'Z-offset too high by approx 0.08mm' }
  ]);
  const [verdict, setVerdict] = useState<string>('Emergency stop required before nozzle clogs completely.');
  const [emotion, setEmotion] = useState<string>('skeptical');

  // ElevenLabs Voice State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState('');
  const [voiceSource, setVoiceSource] = useState<'elevenlabs' | 'browser'>('browser');
  const [showKeySettings, setShowKeySettings] = useState(false);
  const [copiedPitch, setCopiedPitch] = useState(false);

  // Webcam State
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Trigger speech playback
  const speakDialogue = async (text: string) => {
    // Stop any active speech
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }

    setIsSpeaking(true);

    // Try ElevenLabs proxy first if key is available
    if (elevenLabsApiKey.trim()) {
      try {
        const res = await fetch('/api/elevenlabs/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            voiceId: selectedCharacter.voiceId,
            customApiKey: elevenLabsApiKey.trim()
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

    // Pick English or Finnish voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice =
      voices.find((v) => v.name.includes('Male') || v.name.includes('David') || v.name.includes('Natural')) ||
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

  // Run Multimodal Vision Analysis on Current Image
  const analyzeCurrentImage = async (focusItem?: string) => {
    setIsAnalyzing(true);
    stopSpeaking();

    try {
      const res = await fetch('/api/vision/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: currentImage,
          character: selectedCharacter.id,
          focusArea: focusItem || ''
        })
      });

      const data = await res.json();
      if (data.speechText) {
        setSpokenText(data.speechText);
        setEmotion(data.emotion || 'amused');
        if (data.tags) setDetectedTags(data.tags);
        if (data.hacklabVerdict) setVerdict(data.hacklabVerdict);

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
    setCurrentImageName('Webcam Snapshot');

    // Stop camera stream
    const stream = videoRef.current.srcObject as MediaStream;
    stream?.getTracks().forEach((track) => track.stop());
    setIsWebcamOpen(false);

    setTimeout(() => {
      analyzeCurrentImage();
    }, 150);
  };

  const handleCopyPitchDeck = () => {
    const text = `# Pikseli: Multimodal Vision × ElevenLabs Voice Companion
## Built for Hacktoberfest Hack Day Mikkeli × Hacklab Mikkeli ry

### Dual MLH Track Qualification:
1. Best Use of Gemma (Google Multimodal Vision):
   - Inspects physical workbench artifacts, 3D print flaws, and circuits.
   - Detects component defects, calculates Z-offsets, and identifies hazard areas.
2. Best Use of ElevenLabs (Expressive Voice AI):
   - Speaks out loud with custom persona voices (Matti the Finnish Maker, Dr. Gemma, Norppa, RoastBot).
   - Generates responsive speech directly connected to vision tags.

### Live Demo Flow (3 Minutes):
- Slide 1 (Hook): Makers get their hands dirty with soldering irons and 3D printers; they can't stop to read text chats.
- Slide 2 (Vision): You hold up a broken board or failed print. Gemma inspects it instantly.
- Slide 3 (Voice): Matti or Dr. Gemma speaks out loud via ElevenLabs, guiding the maker verbally!
- Slide 4 (Open Source): Code is on GitHub under MIT License for Hacktoberfest.`;

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
              DUAL MLH TRACK
            </span>
            <span>Gemma Multimodal Vision × ElevenLabs Voice Companion</span>
          </div>
          <div className="flex items-center space-x-3 text-amber-100 text-[11px]">
            <span>Hacklab Mikkeli ry • Pietarinkatu 23</span>
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
                <span className="text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  Gemma + ElevenLabs
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Hold up an object or upload a photo — your AI companion speaks what it sees!
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowKeySettings(!showKeySettings)}
              className={`p-2 rounded-xl border text-xs font-medium transition flex items-center space-x-1.5 ${
                showKeySettings || elevenLabsApiKey
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title="ElevenLabs Voice Settings"
            >
              <Key className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ElevenLabs Key</span>
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

      {/* ElevenLabs API Key Drawer (Optional) */}
      {showKeySettings && (
        <div className="border-b border-slate-800 bg-slate-900/95 px-4 py-4 backdrop-blur">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
            <div className="space-y-1 max-w-xl">
              <span className="font-bold text-amber-400 flex items-center space-x-1.5">
                <Radio className="w-4 h-4" />
                <span>ElevenLabs API Integration (MLH Partner Track)</span>
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Enter your ElevenLabs API Key here to stream high-definition cloned voices. If left blank, the app uses free browser speech synthesis automatically!
              </p>
            </div>

            <div className="flex items-center space-x-2 w-full md:w-auto">
              <input
                type="password"
                value={elevenLabsApiKey}
                onChange={(e) => setElevenLabsApiKey(e.target.value)}
                placeholder="Paste ElevenLabs xi-api-key here..."
                className="p-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono focus:border-amber-500 focus:outline-none w-full md:w-72"
              />
              <button
                onClick={() => setShowKeySettings(false)}
                className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Studio Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 flex flex-col space-y-6">
        {/* Character Persona Selector Cards */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <span>Choose Your Voiced Character Persona</span>
            </h3>
            <span className="text-[10px] text-slate-500">Each character speaks with distinct voice & humor</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {CHARACTERS.map((char) => {
              const isSelected = selectedCharacter.id === char.id;
              return (
                <button
                  key={char.id}
                  onClick={() => {
                    setSelectedCharacter(char);
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
                        {char.id === 'matti' ? 'Finnish' : char.id === 'dr_gemma' ? 'Cyberpunk' : char.id === 'norppa' ? 'Saimaa' : 'Comedy'}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-white">{char.name}</h4>
                      <p className="text-[11px] text-slate-400 font-medium">{char.title}</p>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{char.tagline}</p>
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
                  Visual Input Feed
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
                    <span>Capture Snapshot</span>
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
                    Gemma Vision Scanning Image Pixels...
                  </p>
                </div>
              )}
            </div>

            {/* Input Action Controls */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {/* File upload */}
              <label className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition cursor-pointer text-xs flex items-center justify-center space-x-2">
                <Upload className="w-4 h-4 text-amber-400" />
                <span>Upload Photo</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>

              {/* Webcam Snapshot */}
              <button
                onClick={startWebcam}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition text-xs flex items-center justify-center space-x-2"
              >
                <Camera className="w-4 h-4 text-cyan-400" />
                <span>{isWebcamOpen ? 'Webcam Active' : 'Live Webcam'}</span>
              </button>

              {/* Re-Analyze Button */}
              <button
                onClick={() => analyzeCurrentImage()}
                disabled={isAnalyzing}
                className="col-span-2 sm:col-span-1 p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-amber-950/40"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Inspect Now</span>
              </button>
            </div>

            {/* Preset Samples */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] text-slate-400 font-medium">Or test with Hacklab test photos:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SAMPLE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setCurrentImage(preset.imageUrl);
                      setCurrentImageName(preset.name);
                      setIsWebcamOpen(false);
                      setTimeout(() => analyzeCurrentImage(), 50);
                    }}
                    className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 text-left transition text-[11px] text-slate-300 hover:text-white truncate"
                  >
                    {preset.name}
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
                    <span>{selectedCharacter.name}</span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      Mood: {emotion}
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Voice: {voiceSource === 'elevenlabs' ? 'ElevenLabs Audio Stream' : 'Browser Web Speech'}
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
                      ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isSpeaking ? 'Stop Voice' : 'Speak Out Loud'}</span>
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
                    opacity: isSpeaking ? 0.9 : 0.25
                  }}
                />
              ))}
            </div>

            {/* Spoken Dialogue Box */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-3 relative">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Spoken Commentary:
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
                  <span>Replay Voice</span>
                </button>
              </div>
            </div>

            {/* Interactive Detected Items / Bounding Tags */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Tag className="w-3.5 h-3.5 text-cyan-400" />
                <span>Detected Visual Elements (Click to Ask Character):</span>
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
                      <span className="text-[10px] text-slate-500 font-mono">Ask →</span>
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
              Processes the raw pixels of your camera feed or uploaded photo. Unlike standard text bots, it segments physical electronics, identifies 3D print failures, counts resistor bands, and spots environmental lake conditions.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-sm text-white flex items-center space-x-2">
              <Radio className="w-4 h-4 text-cyan-400" />
              <span>Track 2: Best Use of ElevenLabs (Expressive Voice AI)</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Brings the analysis alive with personality-driven character voices. Makers in physical workshops can’t stop to read screens — they listen to Matti or Dr. Gemma guide them through repairs hands-free!
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>Pikseli Voiced Vision • Hacktoberfest Hack Day Mikkeli × Hacklab Mikkeli ry</p>
          <p className="text-slate-600">Built with Gemma Multimodal Vision & ElevenLabs Voice AI</p>
        </div>
      </footer>
    </div>
  );
}
