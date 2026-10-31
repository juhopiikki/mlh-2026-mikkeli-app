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
  RefreshCw,
  Maximize,
  Minimize
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
  { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George (Raspy / Craftsman)', gender: 'male', tone: 'Raspy, authentic maker', recommendedFor: 'Matti Nikkari' },
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel (Clear Tech / Sofia)', gender: 'female', tone: 'Analytical, calm, articulate', recommendedFor: 'Sofia the Guide' },
  { id: 'XB0fDUnXU5powFXDhCwa', name: 'Charlotte (Nordic Expressive / Aino)', gender: 'female', tone: 'Soft Scandinavian warmth', recommendedFor: 'Aino the Storyteller' },
  { id: 'jsCqWAovK2LkecY7zXl4', name: 'Freya (Energetic / Helmi)', gender: 'female', tone: 'Expressive, super hyped and breathless', recommendedFor: 'Helmi the Art Lover' },
  { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel (Deep Pompous / Julian)', gender: 'male', tone: 'Authoritative, haughty resonance', recommendedFor: 'Julian the Art Critic' },
  { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam (Sarcastic Narrator / RoastBot)', gender: 'male', tone: 'Crisp, dramatic comedic delivery', recommendedFor: 'RoastBot 3000' },
  { id: 'IKne3meq5aSn9XLyUdCD', name: 'Charlie (Natural Friendly)', gender: 'male', tone: 'Casual, friendly, youthful', recommendedFor: 'Friendly Companion' },
  { id: 'D38z5RcWu1voky8WS1ja', name: 'Fin (Punchy Android)', gender: 'male', tone: 'Upbeat and sharp', recommendedFor: 'Cyberpunk Drone' }
];

const CHARACTERS: Character[] = [
  {
    id: 'sofia',
    name: 'Sofia the Vision Guide',
    nameFi: 'Sofia Analyytikko',
    title: 'Observant Vision Guide & Explainer',
    titleFi: 'Tarkkanäköinen Kuva-avustaja & Opas',
    avatarEmoji: '👁️',
    tagline: 'Clear, articulate visual guide: describes objects, art, documents, people, and daily surroundings.',
    taglineFi: 'Selkeä ja rauhallinen opas: kuvailee esineet, taiteen, asiakirjat, ihmiset ja arjen ympäristön elävästi.',
    defaultVoiceId: '21m00Tcm4TlvDq8ikWAM',
    defaultPitch: 1.0,
    defaultRate: 1.0,
    colorTheme: {
      badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      border: 'border-blue-500/40',
      glow: 'shadow-blue-950/40',
      accent: 'text-blue-400'
    }
  },
  {
    id: 'matti',
    name: 'Matti the Maker',
    nameFi: 'Matti Nikkari',
    title: 'Veteran Finnish Hacklab Craftsman',
    titleFi: 'Hacklab Mikkelin verstasveteraani',
    avatarEmoji: '🧔‍♂️',
    tagline: 'Dry Finnish humor, sighs (*huoh*), loves black kahvi, and knows every soldering & 3D print flaw.',
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
    id: 'aino',
    name: 'Aino the Storyteller',
    nameFi: 'Aino Tarinankertoja',
    title: 'Poetic Scenery & Life Observer',
    titleFi: 'Runollinen Elämän & Luonnon Tarkkailija',
    avatarEmoji: '🌿',
    tagline: 'Warm Nordic observer: brings nature, pets, scenery, food, and quiet moments alive with storytelling.',
    taglineFi: 'Lämminhenkinen havaitsija: herättää kuvat, maisemat, lemmikit, ihmiset ja arjen kauneuden eloon tarinana.',
    defaultVoiceId: 'XB0fDUnXU5powFXDhCwa',
    defaultPitch: 1.05,
    defaultRate: 0.98,
    colorTheme: {
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      border: 'border-emerald-500/40',
      glow: 'shadow-emerald-950/40',
      accent: 'text-emerald-400'
    }
  },
  {
    id: 'roast_bot',
    name: 'RoastBot 3000',
    nameFi: 'RoastBot 3000',
    title: 'Savage Comedy Roaster',
    titleFi: 'Armoton Komediapaahtaja',
    avatarEmoji: '🔥',
    tagline: 'Aggressive, brutal roasts with zero mercy: incinerates awful aesthetics, bad wiring, messy rooms, and tragic life choices.',
    taglineFi: 'Häikäilemätön, brutaali ja armoton paahde: grillaa tyylirikokset, verstassotkut, pieleen menneet printit ja elämänvalinnat maan rakoon.',
    defaultVoiceId: 'pNInz6obpgDQGcFmaJgB',
    defaultPitch: 0.95,
    defaultRate: 1.12,
    colorTheme: {
      badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      border: 'border-rose-500/40',
      glow: 'shadow-rose-950/40',
      accent: 'text-rose-400'
    }
  },
  {
    id: 'art_critic',
    name: 'Julian the Art Critic',
    nameFi: 'Valtteri Taidekriitikko',
    title: 'Merciless & Savage Art Critic',
    titleFi: 'Armoton & Murskaava Taidekriitikko',
    avatarEmoji: '🧐',
    tagline: 'Bashes and eviscerates everything he sees! Condemns amateurism, lighting, and composition with ruthless intellectual cruelty.',
    taglineFi: 'Haukkuu ja teilaa kaiken näkemänsä maan rakoon! Eviskeroi teokset, tekniikan ja porvarillisen kitschin musertavalla ylimielisyydellä.',
    defaultVoiceId: 'onwK4e9ZLuTAKqWW03F9',
    defaultPitch: 0.92,
    defaultRate: 0.95,
    colorTheme: {
      badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      border: 'border-purple-500/40',
      glow: 'shadow-purple-950/40',
      accent: 'text-purple-400'
    }
  },
  {
    id: 'art_lover',
    name: 'Helmi the Art Lover',
    nameFi: 'Helmi Taidefiilistelijä',
    title: 'Hyper-Enthusiastic Fine Art Fanatic',
    titleFi: 'Ekstaattinen Taiteen & Kauneuden Hehkuttaja',
    avatarEmoji: '✨',
    tagline: 'SUPER HYPED about all art! Finds transcendent cosmic genius and spiritual tears in every stroke and laser cut.',
    taglineFi: 'AIVAN LIEKEISSÄ KAIKESTA TAITEESTA! Kokee kosmista henkistä liikutusta ja neroutta jokaisessa maalauksessa ja laserleikkauksessa.',
    defaultVoiceId: 'jsCqWAovK2LkecY7zXl4',
    defaultPitch: 1.15,
    defaultRate: 1.05,
    colorTheme: {
      badge: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20',
      border: 'border-fuchsia-500/40',
      glow: 'shadow-fuchsia-950/40',
      accent: 'text-fuchsia-400'
    }
  }
];

const SAMPLE_PRESETS = [
  {
    id: 'coffee',
    name: 'Morning Coffee & Cinnamon Bun',
    nameFi: 'Aamukahvi & Korvapuusti',
    category: 'Food & Life',
    description: 'Fresh steaming mug of dark roast filter coffee and warm cinnamon pastry.',
    imageUrl: '/presets/coffee.jpg'
  },
  {
    id: 'dog',
    name: 'Golden Retriever in Garden',
    nameFi: 'Kultainennoutaja puutarhassa',
    category: 'Pets & Animals',
    description: 'Happy puppy sitting on a sunny lawn with blooming garden flowers.',
    imageUrl: '/presets/dog.jpg'
  },
  {
    id: 'saimaa',
    name: 'Nordic Lake Sunset & Wooden Pier',
    nameFi: 'Laituri & Syysjärvi',
    category: 'Nature & Scenery',
    description: 'Tranquil wooden pier extending into calm lake water under a colorful Nordic sky.',
    imageUrl: '/presets/saimaa.jpg'
  },
  {
    id: 'room',
    name: 'Modern Nordic Living Space',
    nameFi: 'Skandinaavinen olohuone',
    category: 'Design & Living',
    description: 'Minimalist living room with green armchair, monstera plant, and ambient lamp.',
    imageUrl: '/presets/room.jpg'
  },
  {
    id: 'breadboard',
    name: 'Hacklab Electronics Bench (Matti)',
    nameFi: 'Hacklab-prototyyppi & kolvi',
    category: 'Workshop & Maker',
    description: 'Tangled jumper wires, NE555 timer chip, LEDs and prototype electronics.',
    imageUrl: '/presets/breadboard.jpg'
  },
  {
    id: 'fashion',
    name: 'Autumn Coat & Urban Style',
    nameFi: 'Syystakki & Katutyyli',
    category: 'Fashion & People',
    description: 'Warm mustard wool coat, red knitted scarf, and takeaway coffee on a city walk.',
    imageUrl: '/presets/fashion.jpg'
  },
  {
    id: 'gallery_oil',
    name: 'Gilded Gallery Oil Painting',
    nameFi: 'Öljyvärimaalaus kultakehyksissä',
    category: 'Fine Art & Gallery',
    description: 'Masterwork oil painting in ornate gilded gold frame exhibited on museum wall.',
    imageUrl: '/presets/gallery_oil.jpg'
  },
  {
    id: 'abstract_modern',
    name: 'Modern Abstract Gallery Canvas',
    nameFi: 'Moderni abstrakti taidegalleria',
    category: 'Fine Art & Gallery',
    description: 'Vibrant expressive abstract canvas with rich textures hung in a white gallery.',
    imageUrl: '/presets/abstract_modern.jpg'
  },
  {
    id: 'sculpture_marble',
    name: 'Classical Museum Marble Sculpture',
    nameFi: 'Klassinen marmoriveistos',
    category: 'Fine Art & Gallery',
    description: 'Detailed classical marble statue under dramatic gallery exhibition spotlighting.',
    imageUrl: '/presets/sculpture_marble.jpg'
  },
  {
    id: 'print_3d',
    name: '3D Printer Hotend & Layering',
    nameFi: '3D-tulostin & suuttimen kerrostus',
    category: 'Workshop & Maker',
    description: 'Hotend extruding molten filament layer by layer on heated bed in makerspace.',
    imageUrl: '/presets/print_3d.jpg'
  },
  {
    id: 'laser_cutter',
    name: 'FabLab Laser Cutter Engraving',
    nameFi: 'Laserleikkuri työn touhussa',
    category: 'Workshop & Maker',
    description: 'CO2 laser cutting and engraving precision vector lines into birch plywood.',
    imageUrl: '/presets/laser_cutter.jpg'
  },
  {
    id: 'cnc_electronics',
    name: 'SMD Soldering & Inspection Bench',
    nameFi: 'Pintaliitostyöpiste & mikroskooppi',
    category: 'Workshop & Maker',
    description: 'SMD soldering bench with stereo microscope, precision tweezers, and flux.',
    imageUrl: '/presets/cnc_electronics.jpg'
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
    "Tervehdys! Olen Sofia, visuaalinen kuvaoppaasi. Tässä kuvassa näemme lämpimän aamiaiskattauksen: höyryävän kupin tummapaahtoista suodatinkahvia ja vastapaistetun korvapuustin. Pehmeä valo luo tilaan rauhallisen ja kotoisan tunnelman."
  );
  const [detectedTags, setDetectedTags] = useState<Array<{ label: string; description: string }>>([
    { label: 'Höyryävä aamukahvi', description: 'Tuore tummapaahtoinen suodatinkahvi keramiikkamukissa' },
    { label: 'Korvapuusti', description: 'Perinteinen kardemummalla ja raesokerilla maustettu leivonnainen' },
    { label: 'Aamiaispöytä', description: 'Luonnonvalo lämpimällä puupinnalla' }
  ]);
  const [verdict, setVerdict] = useState<string>('Visuaalinen havainto: Tasapainoinen sommittelu ja houkutteleva arkinen aamuhetki.');
  const [emotion, setEmotion] = useState<string>('cheerful');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [lastModelSource, setLastModelSource] = useState<string>('Gemma Vision (gemma-4-26b-a4b-it)');
  const [activeFocusTag, setActiveFocusTag] = useState<string | null>(null);
  const [presetFilter, setPresetFilter] = useState<'all' | 'art' | 'hacklab' | 'general'>('all');

  // References for cancellation and audio synchronization
  const abortControllerRef = useRef<AbortController | null>(null);
  const ttsAbortControllerRef = useRef<AbortController | null>(null);
  const currentSpeechIdRef = useRef<number>(0);

  // Synchronization refs to prevent React state closure staleness
  const languageRef = useRef<'fi' | 'en'>('fi');
  const selectedCharacterRef = useRef<Character>(CHARACTERS[0]);
  const selectedVoiceIdRef = useRef<string>(CHARACTERS[0].defaultVoiceId);
  const currentImageRef = useRef<string>(SAMPLE_PRESETS[0].imageUrl);

  // ElevenLabs Voice State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState(() => {
    return localStorage.getItem('elevenlabs_api_key') || '';
  });
  const [serverHasKey, setServerHasKey] = useState(false);
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);
  const audioUnlockedRef = useRef(false);

  const [voiceSource, setVoiceSource] = useState<'elevenlabs' | 'browser'>('browser');
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [voiceStability, setVoiceStability] = useState(0.5);
  const [voiceClarity, setVoiceClarity] = useState(0.8);
  const [testVoiceStatus, setTestVoiceStatus] = useState<string | null>(null);

  const spokenTextRef = useRef(spokenText);
  spokenTextRef.current = spokenText;
  const hasInitialSpokenRef = useRef(false);

  // Persistent references to prevent Garbage Collection issues
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speechKeepAliveRef = useRef<any>(null);

  // Global audio unlock on user gesture
  const unlockAudioOnce = () => {
    setIsAudioUnlocked(true);
    audioUnlockedRef.current = true;
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.resume();
      } catch {}
    }
  };

  const unlockAudioContext = unlockAudioOnce;

  useEffect(() => {
    const handleFirstGesture = (e: Event) => {
      unlockAudioOnce();

      // Check if user clicked an interactive control (button, input, preset card)
      const target = e.target as HTMLElement | null;
      const isInteractive = target?.closest('button, input, textarea, select, [role="button"]');

      if (!hasInitialSpokenRef.current && !isInteractive) {
        hasInitialSpokenRef.current = true;
        speakDialogue(spokenTextRef.current);
      }
    };

    window.addEventListener('touchstart', handleFirstGesture, { capture: true, passive: true });
    window.addEventListener('click', handleFirstGesture, { capture: true, passive: true });
    return () => {
      window.removeEventListener('touchstart', handleFirstGesture, { capture: true });
      window.removeEventListener('click', handleFirstGesture, { capture: true });
    };
  }, []);

  // Sync ElevenLabs key with server on mount so friends on shared link also hear audio
  useEffect(() => {
    const localKey = localStorage.getItem('elevenlabs_api_key') || '';
    if (localKey.trim()) {
      fetch('/api/elevenlabs/sync-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: localKey.trim() })
      })
        .then((res) => res.json())
        .then((d) => {
          if (d.hasKey) setServerHasKey(true);
        })
        .catch(() => {});
    } else {
      fetch('/api/elevenlabs/config')
        .then((res) => res.json())
        .then((d) => {
          if (d.hasKey) setServerHasKey(true);
        })
        .catch(() => {});
    }
  }, []);

  // Webcam State
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fullscreen State
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Guard against unhandled media/playback interruptions, canvas errors, and speech issues
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Prevent unhandled rejections from bubbling up to AI Studio mobile host frame
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();
    };

    const handleError = (event: Event) => {
      // Prevent media, canvas SecurityError, or speech events from bubbling to AI Studio
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection, true);
    window.addEventListener('error', handleError, true);
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection, true);
      window.removeEventListener('error', handleError, true);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Persist ElevenLabs API Key and sync to server for friends
  const handleSaveApiKey = (key: string) => {
    setElevenLabsApiKey(key);
    localStorage.setItem('elevenlabs_api_key', key);
    if (key.trim()) {
      fetch('/api/elevenlabs/sync-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: key.trim() })
      })
        .then((res) => res.json())
        .then((d) => {
          if (d.hasKey) setServerHasKey(true);
        })
        .catch(() => {});
    }
  };

  // Convert any image or SVG to clean JPEG base64 data (resizing if oversized, fully guarded)
  const getJpegBase64 = (imageSrc: string): Promise<string> => {
    return new Promise((resolve) => {
      try {
        // If already a compact base64 JPEG/PNG, use directly
        if (
          (imageSrc.startsWith('data:image/jpeg;base64,') || imageSrc.startsWith('data:image/png;base64,')) &&
          imageSrc.length < 500000
        ) {
          resolve(imageSrc);
          return;
        }

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          try {
            const maxDim = 1200;
            let w = img.naturalWidth || 600;
            let h = img.naturalHeight || 400;
            if (w > maxDim || h > maxDim) {
              if (w > h) {
                h = Math.round((h * maxDim) / w);
                w = maxDim;
              } else {
                w = Math.round((w * maxDim) / h);
                h = maxDim;
              }
            }
            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.fillStyle = '#0f172a';
              ctx.fillRect(0, 0, w, h);
              ctx.drawImage(img, 0, 0, w, h);
              const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
              resolve(dataUrl);
              return;
            }
          } catch (canvasErr) {
            console.warn('Canvas conversion guarded safely:', canvasErr);
          }
          resolve(imageSrc);
        };
        img.onerror = () => resolve(imageSrc);
        img.src = imageSrc;
      } catch (outerErr) {
        console.warn('getJpegBase64 guarded safely:', outerErr);
        resolve(imageSrc);
      }
    });
  };

  // Trigger speech playback (ElevenLabs Multilingual v2 or Browser Speech)
  const speakDialogue = async (text: string, overrideVoiceId?: string) => {
    // Increment speech sequence ID to invalidate any prior pending audio
    const thisSpeechId = ++currentSpeechIdRef.current;

    // Abort prior in-flight ElevenLabs network request
    if (ttsAbortControllerRef.current) {
      try {
        ttsAbortControllerRef.current.abort();
      } catch {}
    }
    const ttsController = new AbortController();
    ttsAbortControllerRef.current = ttsController;

    // Clear prior speech synthesis heartbeat and cancel
    if (speechKeepAliveRef.current) {
      clearInterval(speechKeepAliveRef.current);
      speechKeepAliveRef.current = null;
    }
    currentUtteranceRef.current = null;
    (window as any).__pikseliActiveUtterance = null;

    if (window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }

    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } catch {}
      audioRef.current = null;
    }

    unlockAudioOnce();

    setIsSpeaking(true);
    const activeChar = selectedCharacterRef.current || selectedCharacter;
    const targetVoiceId = overrideVoiceId || selectedVoiceIdRef.current || selectedVoiceId || activeChar.defaultVoiceId;
    const targetLanguage = languageRef.current || language;

    const canUseElevenLabs = Boolean(elevenLabsApiKey.trim() || serverHasKey);

    // Check if ElevenLabs key is available (either entered locally or shared by server)
    if (canUseElevenLabs) {
      try {
        const res = await fetch('/api/elevenlabs/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: ttsController.signal,
          body: JSON.stringify({
            text,
            voiceId: targetVoiceId,
            customApiKey: elevenLabsApiKey.trim(),
            language: targetLanguage,
            stability: voiceStability,
            similarity_boost: voiceClarity
          })
        });

        // Ensure no newer speech was triggered while waiting for network audio
        if (thisSpeechId !== currentSpeechIdRef.current) {
          return;
        }

        if (res.ok) {
          const blob = await res.blob();
          if (thisSpeechId !== currentSpeechIdRef.current) return;

          const audioUrl = URL.createObjectURL(blob);
          const audio = new Audio(audioUrl);
          audio.volume = 1.0;
          audioRef.current = audio;

          audio.onended = () => {
            URL.revokeObjectURL(audioUrl);
            if (thisSpeechId === currentSpeechIdRef.current) {
              setIsSpeaking(false);
            }
          };
          audio.onerror = (e: Event | string) => {
            if (e && typeof e !== 'string') {
              e.preventDefault();
              e.stopPropagation();
            }
            URL.revokeObjectURL(audioUrl);
            if (thisSpeechId === currentSpeechIdRef.current) {
              fallbackBrowserSpeech(text, thisSpeechId, targetVoiceId);
            }
          };

          setVoiceSource('elevenlabs');

          try {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
              playPromise
                .then(() => {
                  setIsAudioUnlocked(true);
                })
                .catch((playErr) => {
                  console.warn('ElevenLabs audio playback failed, falling back to browser speech:', playErr);
                  URL.revokeObjectURL(audioUrl);
                  if (thisSpeechId === currentSpeechIdRef.current) {
                    fallbackBrowserSpeech(text, thisSpeechId, targetVoiceId);
                  }
                });
            }
          } catch (playErr) {
            console.warn('ElevenLabs play error, falling back to browser speech:', playErr);
            URL.revokeObjectURL(audioUrl);
            if (thisSpeechId === currentSpeechIdRef.current) {
              fallbackBrowserSpeech(text, thisSpeechId, targetVoiceId);
            }
          }
          return;
        } else {
          console.warn('ElevenLabs API returned non-OK status, falling back to browser speech:', res.status);
          fallbackBrowserSpeech(text, thisSpeechId, targetVoiceId);
          return;
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.warn('ElevenLabs API request handled, falling back to browser speech:', err);
        fallbackBrowserSpeech(text, thisSpeechId, targetVoiceId);
        return;
      }
    }

    // Fallback: Browser Native Web Speech API whenever ElevenLabs is not configured
    if (thisSpeechId === currentSpeechIdRef.current) {
      fallbackBrowserSpeech(text, thisSpeechId, targetVoiceId);
    }
  };

  const fallbackBrowserSpeech = (text: string, speechId?: number, _voiceId?: string) => {
    try {
      if (!('speechSynthesis' in window)) {
        setIsSpeaking(false);
        return;
      }

      // Clear any prior keep-alive interval
      if (speechKeepAliveRef.current) {
        clearInterval(speechKeepAliveRef.current);
        speechKeepAliveRef.current = null;
      }

      setVoiceSource('browser');
      setIsSpeaking(true);

      try {
        window.speechSynthesis.cancel();
        window.speechSynthesis.resume();
      } catch {}

      const utterance = new SpeechSynthesisUtterance(text);
      // Retain strong reference so GC does not collect utterance mid-sentence
      currentUtteranceRef.current = utterance;
      (window as any).__pikseliActiveUtterance = utterance;

      const activeChar = selectedCharacterRef.current || selectedCharacter;
      const targetLang = languageRef.current || language;
      utterance.volume = 1.0;
      utterance.pitch = activeChar.defaultPitch || 1.0;
      utterance.rate = activeChar.defaultRate || 1.0;
      utterance.lang = targetLang === 'fi' ? 'fi-FI' : 'en-US';

      const voices = window.speechSynthesis.getVoices();
      const preferredVoice =
        voices.find((v) => (targetLang === 'fi' ? v.lang.startsWith('fi') : v.lang.startsWith('en'))) ||
        voices[0];
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      const cleanup = () => {
        if (speechKeepAliveRef.current) {
          clearInterval(speechKeepAliveRef.current);
          speechKeepAliveRef.current = null;
        }
        currentUtteranceRef.current = null;
        (window as any).__pikseliActiveUtterance = null;
        if (!speechId || speechId === currentSpeechIdRef.current) {
          setIsSpeaking(false);
        }
      };

      utterance.onend = cleanup;
      utterance.onerror = (e) => {
        console.debug('Browser speech synthesis error ignored:', e);
        cleanup();
      };

      window.speechSynthesis.speak(utterance);

      // Safe keep-alive: NEVER pause speech! Only call resume() if paused!
      speechKeepAliveRef.current = setInterval(() => {
        if (window.speechSynthesis.speaking) {
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }
        } else {
          cleanup();
        }
      }, 1000);

    } catch (synthErr) {
      console.debug('Browser speech synthesis error:', synthErr);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    // Invalidate any in-flight audio downloads
    currentSpeechIdRef.current++;
    if (ttsAbortControllerRef.current) {
      try {
        ttsAbortControllerRef.current.abort();
      } catch {}
    }
    if (speechKeepAliveRef.current) {
      clearInterval(speechKeepAliveRef.current);
      speechKeepAliveRef.current = null;
    }
    currentUtteranceRef.current = null;
    (window as any).__pikseliActiveUtterance = null;

    if (window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    if (audioRef.current) {
      try {
        audioRef.current.onended = null;
        audioRef.current.onerror = null;
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } catch {}
      audioRef.current = null;
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

  // Run Multimodal Vision Analysis on Current Image (With Abort & Instant Feedback & Direct Parameter Passing)
  const analyzeCurrentImage = async (
    focusItem?: string,
    overrideImage?: string,
    overrideCharacter?: Character,
    overrideVoiceId?: string,
    overrideLanguage?: 'fi' | 'en',
    overrideQuestion?: string
  ) => {
    // Cancel any previous in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Immediately stop previous speech and invalidate pending audio
    stopSpeaking();
    unlockAudioContext();

    const targetImage = overrideImage || currentImageRef.current || currentImage;
    const targetChar = overrideCharacter || selectedCharacterRef.current || selectedCharacter;
    const targetVoiceId =
      overrideVoiceId ||
      (overrideCharacter ? overrideCharacter.defaultVoiceId : selectedVoiceIdRef.current || targetChar.defaultVoiceId);
    const targetLang = overrideLanguage || languageRef.current || language;
    const targetQuestion = overrideQuestion !== undefined ? overrideQuestion.trim() : '';

    if (targetQuestion) {
      setActiveFocusTag(null);
      setSpokenText(
        targetLang === 'fi'
          ? `${targetChar.nameFi} miettii vastausta kysymykseesi: "${targetQuestion}"...`
          : `${targetChar.name} is answering your question: "${targetQuestion}"...`
      );
    } else if (focusItem) {
      setActiveFocusTag(focusItem);
      setSpokenText(
        targetLang === 'fi'
          ? `Tutkitaan kohdetta "${focusItem}"... Hetki pieni!`
          : `Examining "${focusItem}"... One moment!`
      );
    } else {
      setActiveFocusTag(null);
      setSpokenText(
        targetLang === 'fi'
          ? `${targetChar.nameFi} tutkii kuvaa ja valmistelee puhetta...`
          : `${targetChar.name} is inspecting the photo and preparing speech...`
      );
    }

    setIsAnalyzing(true);

    try {
      const validJpegBase64 = await getJpegBase64(targetImage);

      const res = await fetch('/api/vision/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          imageBase64: validJpegBase64,
          character: targetChar.id,
          question: targetQuestion,
          focusArea: focusItem || '',
          language: targetLang,
          mimeType: 'image/jpeg'
        })
      });

      const data = await res.json();
      if (data.speechText) {
        setSpokenText(data.speechText);
        setEmotion(data.emotion || 'amused');
        if (data.tags && data.tags.length > 0) setDetectedTags(data.tags);
        if (data.verdict || data.hacklabVerdict) setVerdict(data.verdict || data.hacklabVerdict);
        if (data.modelUsed) setLastModelSource(`Live: ${data.modelUsed} (${data.durationMs}ms)`);

        // Speak aloud the fresh response automatically by default!
        speakDialogue(data.speechText, targetVoiceId);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // Normal cancellation when user switched selection
        return;
      }
      console.warn('Vision analysis warning (handled gracefully):', err);
    } finally {
      setIsAnalyzing(false);
      setActiveFocusTag(null);
    }
  };

  // Dedicated handler for asking custom questions
  const handleAskQuestion = (questionOverride?: string) => {
    const q = (questionOverride !== undefined ? questionOverride : customPrompt).trim();
    if (!q || isAnalyzing) return;
    unlockAudioContext();
    if (questionOverride !== undefined) {
      setCustomPrompt(questionOverride);
    }
    analyzeCurrentImage(undefined, undefined, undefined, undefined, undefined, q);
  };

  // Character Selection handler with immediate sync
  const handleSelectCharacter = (char: Character) => {
    selectedCharacterRef.current = char;
    selectedVoiceIdRef.current = char.defaultVoiceId;
    setSelectedCharacter(char);
    setSelectedVoiceId(char.defaultVoiceId);
    stopSpeaking();
    const currentLang = languageRef.current;
    setSpokenText(
      currentLang === 'fi'
        ? `${char.nameFi} arvioi kuvaa omalla tyylillään...`
        : `${char.name} is evaluating the photo...`
    );
    analyzeCurrentImage(undefined, undefined, char, char.defaultVoiceId);
  };

  // Image Upload handler with immediate sync
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCurrentImageName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (!base64) return;
      currentImageRef.current = base64;
      setCurrentImage(base64);
      stopSpeaking();
      const currentLang = languageRef.current;
      setSpokenText(
        currentLang === 'fi'
          ? `Tutkitaan ladattua kuvaa "${file.name}"... Hetki pieni!`
          : `Analyzing uploaded image "${file.name}"... One moment!`
      );
      analyzeCurrentImage(undefined, base64);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Preset Selection handler with immediate sync
  const handleSelectPreset = (preset: (typeof SAMPLE_PRESETS)[0]) => {
    currentImageRef.current = preset.imageUrl;
    setCurrentImage(preset.imageUrl);
    setCurrentImageName(languageRef.current === 'fi' ? preset.nameFi : preset.name);
    setIsWebcamOpen(false);
    stopSpeaking();
    const currentLang = languageRef.current;
    setSpokenText(
      currentLang === 'fi'
        ? `Avataan "${preset.nameFi}"...`
        : `Opening "${preset.name}"...`
    );
    analyzeCurrentImage(undefined, preset.imageUrl);
  };

  // Language toggle handler with immediate sync
  const handleToggleLanguage = (newLang: 'fi' | 'en') => {
    languageRef.current = newLang;
    setLanguage(newLang);
    stopSpeaking();
    analyzeCurrentImage(undefined, undefined, undefined, undefined, newLang);
  };

  // Webcam Controls
  const startWebcam = async () => {
    setCameraError(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError(
        languageRef.current === 'fi'
          ? 'Selaimesi ei tue suoraa videovirtaa tässä näkymässä. Käytä "Ota kamerakuva" -painiketta!'
          : 'Browser camera stream not supported in this frame. Please use the "Take Camera Photo" button!'
      );
      return;
    }

    setIsWebcamOpen(true);
    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } }
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Webcam access error:', err);
      setIsWebcamOpen(false);
      setCameraError(
        languageRef.current === 'fi'
          ? 'Kameraan ei saatu suoraa videoyhteyttä tässä selaimessa. Ota kuva puhelimellasi painamalla "Ota kamerakuva"!'
          : 'Could not open live stream. Tap "Take Camera Photo" to snap directly with your phone!'
      );
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
    const base64 = canvas.toDataURL('image/jpeg', 0.85);
    currentImageRef.current = base64;
    setCurrentImage(base64);
    setCurrentImageName(languageRef.current === 'fi' ? 'Webkamera-kuva' : 'Webcam Snapshot');

    const stream = videoRef.current.srcObject as MediaStream;
    stream?.getTracks().forEach((track) => track.stop());
    setIsWebcamOpen(false);

    stopSpeaking();
    setSpokenText(
      languageRef.current === 'fi'
        ? 'Tutkitaan webkameran ottamaa valokuvaa...'
        : 'Inspecting webcam snapshot...'
    );
    analyzeCurrentImage(undefined, base64);
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
- Slide 4: Open source on GitHub under Apache-2.0 license!`;

    navigator.clipboard.writeText(text);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950 w-full max-w-[100vw] overflow-x-hidden">
      {/* Top Hacktoberfest Header Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-amber-700 text-white text-xs py-1 px-3 sm:px-4 shadow-inner w-full overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 min-w-0">
          <div className="flex items-center space-x-1.5 font-medium min-w-0 truncate">
            <span className="bg-slate-950 text-amber-300 font-bold px-1.5 py-0.5 rounded text-[10px] tracking-wide shrink-0">
              MLH HACK DAY
            </span>
            <span className="truncate text-[11px] sm:text-xs">Hacktoberfest Mikkeli × Hacklab ry</span>
          </div>

          <div className="flex items-center space-x-2 text-amber-100 text-[11px] shrink-0">
            {/* Suomi / English Toggle */}
            <div className="flex items-center space-x-0.5 bg-slate-950/60 rounded-lg p-0.5 border border-amber-300/30">
              <button
                type="button"
                onClick={() => handleToggleLanguage('fi')}
                className={`px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold transition flex items-center space-x-1 ${
                  language === 'fi' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>🇫🇮</span>
                <span>Suomi</span>
              </button>
              <button
                type="button"
                onClick={() => handleToggleLanguage('en')}
                className={`px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold transition flex items-center space-x-1 ${
                  language === 'en' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>🇬🇧</span>
                <span>EN</span>
              </button>
            </div>

            <span className="hidden md:inline">Pietarinkatu 23</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-40 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-extrabold shadow-lg shadow-orange-950 shrink-0">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white truncate">Pikseli</span>
                <span className={`text-[9px] sm:text-[10px] font-semibold tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full border shrink-0 ${
                  elevenLabsApiKey || serverHasKey ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                }`}>
                  {elevenLabsApiKey || serverHasKey ? 'ElevenLabs' : 'Audio'}
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block truncate">
                {language === 'fi' ? 'Osoita esinettä tai lataa kuva — hahmo kertoo ääneen mitä näkee!' : 'Hold up an object or upload a photo — your AI companion speaks what it sees!'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
            {/* Voice & ElevenLabs Settings Button */}
            <button
              type="button"
              onClick={() => setShowVoiceModal(true)}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-white transition text-xs flex items-center space-x-1"
              title={language === 'fi' ? 'Ääni & Key' : 'Voice & Key'}
            >
              <Mic className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="hidden sm:inline">{language === 'fi' ? 'Ääni' : 'Voice'}</span>
            </button>

            {/* Standalone clean view link (Hides AI Studio Chat bar entirely on mobile) */}
            <a
              href="https://ais-pre-edsgiijkdgu5c27t3pmpsh-631589137191.europe-west2.run.app"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 sm:p-2 rounded-xl bg-slate-900 border border-cyan-500/30 hover:border-cyan-500 text-cyan-300 hover:text-cyan-200 transition text-xs flex items-center space-x-1"
              title={language === 'fi' ? 'Avaa puhelimessa ilman chattiä (koko näyttö)' : 'Open clean app without chat bar (fullscreen)'}
            >
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="text-[10px] sm:text-[11px] font-bold text-cyan-400 whitespace-nowrap">
                {language === 'fi' ? 'Ei chattiä ↗' : 'Clean ↗'}
              </span>
            </a>

            {/* In-app Fullscreen Toggle */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-white transition text-xs flex items-center space-x-1"
              title={isFullscreen ? (language === 'fi' ? 'Poistu koko ruudusta (Esc)' : 'Exit Fullscreen (Esc)') : (language === 'fi' ? 'Koko ruutu' : 'Fullscreen')}
            >
              {isFullscreen ? <Minimize className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> : <Maximize className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
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
              <span>{language === 'fi' ? 'Valitse puhuva tekoälyhahmo' : 'Choose Your Voiced AI Persona'}</span>
            </h3>
            <span className="text-[10px] text-slate-500">
              {language === 'fi' ? 'Kieli: Suomi (ElevenLabs Multilingual v2)' : 'Language: English'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 w-full min-w-0">
            {CHARACTERS.map((char) => {
              const isSelected = selectedCharacter.id === char.id;
              const badgeLabel =
                char.id === 'matti'
                  ? (language === 'fi' ? 'Hacklab Nikkari' : 'Makerspace')
                  : char.id === 'sofia'
                  ? (language === 'fi' ? 'Kuvaopas' : 'Vision Guide')
                  : char.id === 'aino'
                  ? (language === 'fi' ? 'Tarinankertoja' : 'Storyteller')
                  : char.id === 'roast_bot'
                  ? (language === 'fi' ? 'Armoton Roasti' : 'Savage Roast')
                  : char.id === 'art_critic'
                  ? (language === 'fi' ? 'Taidekriitikko' : 'Art Critic')
                  : char.id === 'art_lover'
                  ? (language === 'fi' ? 'Taidefiilistelijä' : 'Art Lover')
                  : 'AI';

              return (
                <button
                  type="button"
                  key={char.id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSelectCharacter(char);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between relative group min-w-0 overflow-hidden active:scale-[0.98] select-none ${
                    isSelected
                      ? `bg-slate-900 ${char.colorTheme.border} ring-1 ring-amber-500/40 shadow-lg ${char.colorTheme.glow}`
                      : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/80 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{char.avatarEmoji}</span>
                      <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border truncate max-w-[95px] ${char.colorTheme.badge}`}>
                        {badgeLabel}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-bold text-xs sm:text-sm text-white truncate">
                        {language === 'fi' ? char.nameFi : char.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium truncate">
                        {language === 'fi' ? char.titleFi : char.title}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-tight">
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
                    type="button"
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
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] flex flex-col items-center justify-center space-y-3 z-20">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40 animate-pulse shadow-lg shadow-amber-950">
                    <Sparkles className="w-6 h-6 animate-spin" />
                  </div>
                  <p className="text-xs font-mono text-amber-300 tracking-wider uppercase text-center px-4 font-semibold">
                    {activeFocusTag
                      ? (language === 'fi'
                          ? `Gemma tutkii kohdetta: "${activeFocusTag}"...`
                          : `Gemma inspecting focus element: "${activeFocusTag}"...`)
                      : (language === 'fi'
                          ? 'Gemma Vision tutkii kuvan pikseleitä...'
                          : 'Gemma Vision Scanning Image Pixels...')}
                  </p>
                </div>
              )}
            </div>

            {/* Inline Camera Error Notice */}
            {cameraError && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start justify-between space-x-2">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{cameraError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setCameraError(null)}
                  className="text-amber-400 hover:text-white text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 border border-amber-800"
                >
                  OK
                </button>
              </div>
            )}

            {/* Input Action Controls */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full min-w-0">
              {/* Native Mobile Camera Snap (100% reliable on phones) */}
              <label className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-slate-200 hover:text-white transition cursor-pointer text-xs flex items-center justify-center space-x-1.5 group min-w-0 active:scale-95">
                <Camera className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition shrink-0" />
                <span className="truncate">{language === 'fi' ? 'Ota kamerakuva' : 'Snap Photo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* File upload from gallery/files */}
              <label className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-white transition cursor-pointer text-xs flex items-center justify-center space-x-1.5 group min-w-0 active:scale-95">
                <Upload className="w-4 h-4 text-amber-400 group-hover:scale-110 transition shrink-0" />
                <span className="truncate">{language === 'fi' ? 'Lataa tiedosto' : 'Choose File'}</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>

              {/* Webcam Live Stream (for desktop or when supported) */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (isWebcamOpen) {
                    const stream = videoRef.current?.srcObject as MediaStream;
                    stream?.getTracks().forEach((track) => track.stop());
                    setIsWebcamOpen(false);
                  } else {
                    startWebcam();
                  }
                }}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition text-xs flex items-center justify-center space-x-1.5 min-w-0 active:scale-95"
              >
                <Radio className={`w-4 h-4 shrink-0 ${isWebcamOpen ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`} />
                <span className="truncate">{isWebcamOpen ? (language === 'fi' ? 'Sulje kamera' : 'Close Video') : (language === 'fi' ? 'Live Webkamera' : 'Live Stream')}</span>
              </button>

              {/* Re-Analyze Button (Guarded to prevent iframe blur & event bubbling to parent) */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (isAnalyzing) return;
                  analyzeCurrentImage();
                }}
                className={`p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-amber-950/40 select-none min-w-0 ${
                  isAnalyzing ? 'opacity-70 cursor-wait' : 'cursor-pointer active:scale-95'
                }`}
              >
                <Sparkles className={`w-4 h-4 text-slate-950 shrink-0 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span className="truncate font-extrabold">{isAnalyzing ? (language === 'fi' ? 'Tutkitaan...' : 'Inspecting...') : (language === 'fi' ? 'Tarkasta kuva' : 'Inspect Now')}</span>
              </button>
            </div>

            {/* Custom Question / Focus Input */}
            <div className="space-y-1.5 w-full min-w-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAskQuestion();
                }}
                className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 focus-within:border-amber-500/60 transition w-full min-w-0"
              >
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder={
                    language === 'fi'
                      ? `Kysy ${selectedCharacter.nameFi}ltä mitä tahansa kuvasta...`
                      : `Ask ${selectedCharacter.name} anything about this image...`
                  }
                  className="w-full min-w-0 bg-transparent text-xs text-slate-200 placeholder-slate-500 px-2 py-1 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!customPrompt.trim() || isAnalyzing}
                  className={`px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 transition active:scale-95 shadow ${
                    isAnalyzing || !customPrompt.trim() ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  {isAnalyzing ? (language === 'fi' ? 'Vastataan...' : 'Thinking...') : (language === 'fi' ? 'Kysy 💬' : 'Ask 💬')}
                </button>
              </form>

              {/* Quick Inspiration Question Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="text-[10px] text-slate-500 font-mono">
                  {language === 'fi' ? 'Pikakysymys:' : 'Quick prompt:'}
                </span>
                {(language === 'fi'
                  ? selectedCharacter.id === 'art_critic'
                    ? ['Miksi tämä on niin huono?', 'Arvostele värit ja valo', 'Mitä mieltä olet tekijän taidoista?']
                    : selectedCharacter.id === 'art_lover'
                    ? ['Mikä tekee tästä niin maagista?', 'Miten tulkitset tämän sielun?', 'Kuvaile tätä kosmista neroutta!']
                    : selectedCharacter.id === 'roast_bot'
                    ? ['Paahda tämä kuva armottomasti', 'Mikä tässä on pahin moka?', 'Paljonko antaisit arvosanaksi?']
                    : selectedCharacter.id === 'matti'
                    ? ['Mitä korjaisit tässä ensin?', 'Onko tämä hyvä prototyyppi?', 'Kestääkö tämä käyttöä?']
                    : ['Mitä kuvassa tapahtuu?', 'Mitä yksityiskohtia huomaat?', 'Kerro kuvan tunnelmasta']
                  : selectedCharacter.id === 'art_critic'
                  ? ['Why is this so atrocious?', 'Critique the composition', 'Is this real art or trash?']
                  : selectedCharacter.id === 'art_lover'
                  ? ['Why is this pure genius?', 'What is the soul of this piece?', 'How does this move you?']
                  : selectedCharacter.id === 'roast_bot'
                  ? ['Roast this brutally', 'What is the biggest crime here?', 'Rate this out of 10']
                  : selectedCharacter.id === 'matti'
                  ? ['What should I fix first?', 'Is this solid work?', 'Any hacklab tips?']
                  : ['What is happening here?', 'What key details do you see?', 'Tell me the story']
                ).map((promptSuggestion, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => handleAskQuestion(promptSuggestion)}
                    className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-amber-300 transition text-left truncate max-w-[200px]"
                  >
                    "{promptSuggestion}"
                  </button>
                ))}
              </div>
            </div>

            {/* Preset Samples */}
            <div className="space-y-2 pt-1">
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <span className="text-[11px] text-slate-300 font-semibold">
                  {language === 'fi' ? 'Valitse esimerkkikuva (12 kpl):' : 'Select Sample Photo (12 photos):'}
                </span>
                {/* Category Filter Chips */}
                <div className="flex items-center space-x-1">
                  {[
                    { id: 'all', labelFi: 'Kaikki', labelEn: 'All' },
                    { id: 'art', labelFi: '🎨 Taide & Galleria', labelEn: '🎨 Art' },
                    { id: 'hacklab', labelFi: '🛠️ Hacklab & 3D', labelEn: '🛠️ Maker' },
                    { id: 'general', labelFi: '🌿 Arki & Luonto', labelEn: '🌿 Life' }
                  ].map((filterTab) => (
                    <button
                      type="button"
                      key={filterTab.id}
                      onClick={() => setPresetFilter(filterTab.id as any)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-mono transition ${
                        presetFilter === filterTab.id
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {language === 'fi' ? filterTab.labelFi : filterTab.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full min-w-0 max-h-[380px] overflow-y-auto pr-1">
                {SAMPLE_PRESETS.filter((preset) => {
                  if (presetFilter === 'art') return preset.category.includes('Art') || preset.category.includes('Gallery');
                  if (presetFilter === 'hacklab') return preset.category.includes('Workshop') || preset.category.includes('Maker');
                  if (presetFilter === 'general') return !preset.category.includes('Art') && !preset.category.includes('Workshop') && !preset.category.includes('Maker');
                  return true;
                }).map((preset) => (
                  <button
                    type="button"
                    key={preset.id}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSelectPreset(preset);
                    }}
                    className={`p-2 rounded-xl bg-slate-950/80 border transition text-left group flex flex-col justify-between min-w-0 overflow-hidden active:scale-95 select-none ${
                      currentImage === preset.imageUrl ? 'border-amber-500 ring-1 ring-amber-500/30 shadow-md shadow-amber-950/30' : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-full h-16 rounded-lg overflow-hidden mb-1.5 bg-slate-900 border border-slate-800/80 relative">
                      <img
                        src={preset.imageUrl}
                        alt={preset.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        loading="lazy"
                      />
                    </div>
                    <span className="font-medium text-slate-200 group-hover:text-amber-300 truncate w-full text-[11px]">
                      {language === 'fi' ? preset.nameFi : preset.name}
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono mt-0.5 truncate w-full">
                      {preset.category}
                    </span>
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
                  <p className="text-[11px] text-slate-400 flex items-center space-x-1.5 flex-wrap">
                    <span className={elevenLabsApiKey || serverHasKey ? 'text-emerald-400 font-semibold' : 'text-slate-400'}>
                      {elevenLabsApiKey || serverHasKey ? '🎙️ ElevenLabs Multilingual' : '🔊 Browser Speech'}
                    </span>
                    <span>•</span>
                    <span className="text-emerald-400 font-mono text-[10px] flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                      <span>{language === 'fi' ? 'Automaattipuhe oletuksena' : 'Auto-speech on'}</span>
                    </span>
                    <span>•</span>
                    <span className="text-slate-400 font-mono text-[10px]">{lastModelSource}</span>
                  </p>
                </div>
              </div>

              {/* Speech Toggle Button */}
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    unlockAudioContext();
                    setIsAudioUnlocked(true);
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
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
                  <span>{isSpeaking ? (language === 'fi' ? 'Pysäytä puhe' : 'Stop Voice') : language === 'fi' ? 'Toista uudelleen 🔊' : 'Replay Voice 🔊'}</span>
                </button>
              </div>
            </div>

            {/* Audio Unlock Banner for mobile if audio context is not yet unlocked */}
            {!isAudioUnlocked && (
              <button
                type="button"
                onClick={() => {
                  unlockAudioContext();
                  setIsAudioUnlocked(true);
                  speakDialogue(spokenText);
                }}
                className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs flex items-center justify-between w-full hover:bg-amber-500/25 transition active:scale-[0.99] shadow-md shadow-amber-950/30 group"
              >
                <div className="flex items-center space-x-2.5">
                  <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Volume2 className="w-4 h-4 text-amber-400 animate-bounce" />
                  </span>
                  <div className="text-left">
                    <p className="font-bold text-xs text-white">
                      {language === 'fi' ? 'Napauta tästä kytkeäksesi puhelinäänet päälle' : 'Tap here to enable phone speaker audio'}
                    </p>
                    <p className="text-[10px] text-amber-200/80">
                      {language === 'fi' ? 'Mobiiliselaimet vaativat yhden kosketuksen äänten avaamiseksi' : 'Mobile browsers require one touch to activate speaker playback'}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-extrabold text-[11px] shrink-0 shadow">
                  {language === 'fi' ? 'Avaa äänet 🔊' : 'Enable 🔊'}
                </span>
              </button>
            )}

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
                {language === 'fi' ? 'Puhuttu havainto (Gemma Vision × ElevenLabs):' : 'Spoken Observation (Gemma Vision × ElevenLabs):'}
              </span>
              <p className="text-slate-100 text-sm leading-relaxed font-sans select-all">
                "{spokenText}"
              </p>

              <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400">
                <span className="italic text-amber-300/90">
                  <span className="font-semibold text-slate-400 not-italic mr-1.5">
                    {language === 'fi' ? 'Yhteenveto:' : 'Takeaway:'}
                  </span>
                  "{verdict}"
                </span>
                <button
                  type="button"
                  onClick={() => speakDialogue(spokenText)}
                  className="text-amber-400 hover:underline flex items-center space-x-1 shrink-0 ml-3"
                >
                  <Play className="w-3 h-3" />
                  <span>{language === 'fi' ? 'Toista uudelleen' : 'Replay Voice'}</span>
                </button>
              </div>
            </div>

            {/* Interactive Detected Items / Bounding Tags */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Tag className="w-3.5 h-3.5 text-cyan-400" />
                  <span>
                    {language === 'fi'
                      ? 'Havaitut kohteet kuvasta (Klikkaa kysyäksesi):'
                      : 'Detected Visual Elements (Click to Ask Character):'}
                  </span>
                </span>
                {activeFocusTag && (
                  <span className="text-[10px] font-mono text-amber-400 flex items-center space-x-1 animate-pulse">
                    <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                    <span>{language === 'fi' ? 'Käsitellään valintaa...' : 'Processing element...'}</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full min-w-0">
                {detectedTags.map((tag, idx) => {
                  const isActive = activeFocusTag === tag.label;
                  return (
                    <button
                      type="button"
                      key={idx}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Prevent spamming clicks on the exact element that is already being analyzed
                        if (isActive && isAnalyzing) return;
                        analyzeCurrentImage(tag.label);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition relative overflow-hidden group min-w-0 active:scale-[0.98] select-none ${
                        isActive
                          ? 'bg-amber-950/50 border-amber-500 ring-2 ring-amber-500/50 shadow-lg shadow-amber-950/60'
                          : isAnalyzing
                          ? 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                          : 'bg-slate-950 border-slate-800 hover:border-amber-500/50 hover:bg-slate-900/60 text-slate-300 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-semibold flex items-center space-x-1.5 ${
                          isActive ? 'text-amber-300 font-bold' : 'text-slate-200 group-hover:text-amber-300'
                        }`}>
                          {isActive && <RefreshCw className="w-3 h-3 text-amber-400 animate-spin shrink-0" />}
                          <span>{tag.label}</span>
                        </span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded transition ${
                          isActive
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse font-semibold'
                            : 'text-slate-500 group-hover:text-amber-300'
                        }`}>
                          {isActive
                            ? (language === 'fi' ? 'Tutkitaan...' : 'Analyzing...')
                            : (language === 'fi' ? 'Kysy →' : 'Ask →')}
                        </span>
                      </div>
                      <p className={`text-[10px] line-clamp-1 mt-0.5 ${isActive ? 'text-amber-200/90 font-medium' : 'text-slate-400'}`}>
                        {tag.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
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
                type="button"
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
                          type="button"
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
                          type="button"
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
                  type="button"
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
                type="button"
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
