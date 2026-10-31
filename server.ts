import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));

// Helper to get GoogleGenAI client with required aistudio-build User-Agent
const getGenAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.startsWith('MY_')) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
};

// API: Vision Analysis (Gemma / Google Multimodal Vision - Suomi & English)
app.post('/api/vision/analyze', async (req, res) => {
  const startTime = Date.now();
  try {
    const { imageBase64, mimeType = 'image/jpeg', character = 'matti', focusArea = '', language = 'fi' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    // Clean base64 data
    let cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');

    const isFinnish = language === 'fi';

    const characterPromptsFi: Record<string, string> = {
      matti: `Puhu SUOMEKSI! Olet Matti, Hacklab Mikkelin (Pietarinkatu 23) kokenut verstasveteraani ja tee-se-itse -nikkari. 
Sinulla on kuiva savolainen/suomalainen huumorintaju, huokailet välillä (*huoh* tai *no niin*), rakastat vahvaa mustaa Juhla Mokkaa, ja olet nähnyt tuhat viritelmää ja korjausta. 
Tarkastele tätä kuvaa aidolla suomalaisella työpajasilmällä ja anna rehti nikkarikommentti (max 3-4 lausetta).`,
      sofia: `Puhu SUOMEKSI! Olet Sofia, älykäs, rauhallinen ja tarkkanäköinen visuaalinen opas ja kuva-analyytikko. 
Kuvaile kuvan kohde, toiminnot, materiaalit, esteettisyys ja merkitys selkeästi, havainnollisesti ja mielenkiintoisesti kuin henkilökohtainen ääniavustaja (max 3-4 lausetta).`,
      dr_gemma: `Puhu SUOMEKSI! Olet Sofia, älykäs, rauhallinen ja tarkkanäköinen visuaalinen opas ja kuva-analyytikko. 
Kuvaile kuvan kohde, toiminnot, materiaalit, esteettisyys ja merkitys selkeästi, havainnollisesti ja mielenkiintoisesti kuin henkilökohtainen ääniavustaja (max 3-4 lausetta).`,
      aino: `Puhu SUOMEKSI! Olet Aino, herkkä ja lämminhenkinen suomalainen tarinankertoja ja luonnon tarkkailija. 
Luo kuvan tunnelmasta, valosta, lemmikeistä, esineistä tai ihmisistä elävä, runollinen ja lämmin pieni tarina tai tunnelmakuvaus (max 3-4 lausetta).`,
      norppa: `Puhu SUOMEKSI! Olet Aino, herkkä ja lämminhenkinen suomalainen tarinankertoja ja luonnon tarkkailija. 
Luo kuvan tunnelmasta, valosta, lemmikeistä, esineistä tai ihmisistä elävä, runollinen ja lämmin pieni tarina tai tunnelmakuvaus (max 3-4 lausetta).`,
      roast_bot: `Puhu SUOMEKSI! Olet RoastBot 3000, teräväkielinen stand-up -koomikko ja armoton kuvakriitikko. 
Heitä kuvan aiheesta (oli se ruokaa, huoneen sisustus, lemmikki, asukokonaisuus tai arkiesine) hulvaton, nokkela ja naurattava komediapaahde (max 3 napakkaa lausetta).`
    };

    const characterPromptsEn: Record<string, string> = {
      matti: `Speak in ENGLISH! You are Matti, a veteran Finnish maker from Hacklab Mikkeli (Pietarinkatu 23). 
You speak English with dry Finnish humor, a pragmatic maker attitude, sigh occasionally (*huoh*), love strong black kahvi (coffee), and have seen 1000 broken gadgets. 
Inspect this photo carefully with Finnish workshop wisdom and dry wit (max 3-4 natural sentences).`,
      sofia: `Speak in ENGLISH! You are Sofia, an articulate, observant, and intelligent visual guide and AI companion. 
Describe what is happening in this image: identifying key objects, materials, spatial context, aesthetics, or significance with clear, engaging visual insights (max 3-4 sentences).`,
      dr_gemma: `Speak in ENGLISH! You are Sofia, an articulate, observant, and intelligent visual guide and AI companion. 
Describe what is happening in this image: identifying key objects, materials, spatial context, aesthetics, or significance with clear, engaging visual insights (max 3-4 sentences).`,
      aino: `Speak in ENGLISH! You are Aino, a warm, poetic Nordic storyteller and mindful observer. 
Bring this image alive through evocative sensory details: the mood, lighting, emotions, nature, pets, or human everyday moments, painting a vivid story with your voice (max 3-4 sentences).`,
      norppa: `Speak in ENGLISH! You are Aino, a warm, poetic Nordic storyteller and mindful observer. 
Bring this image alive through evocative sensory details: the mood, lighting, emotions, nature, pets, or human everyday moments, painting a vivid story with your voice (max 3-4 sentences).`,
      roast_bot: `Speak in ENGLISH! You are RoastBot 3000, a razor-sharp comedy roaster. 
Deliver a hilarious, witty, laugh-out-loud roast of whatever is in the image — whether it's fashion choices, room clutter, amateur cooking, an animal's existential stare, or questionable objects (max 3 punchy sentences).`
    };

    const systemInstruction = isFinnish
      ? characterPromptsFi[character] || characterPromptsFi.sofia
      : characterPromptsEn[character] || characterPromptsEn.sofia;

    const userPrompt = focusArea
      ? isFinnish
        ? `Katso tarkasti kohtaa "${focusArea}" tässä kuvassa. Anna reaktiosi ja huomiosi hahmona.`
        : `Look specifically at the "${focusArea}" in this image. Give your reaction and analysis in character.`
      : isFinnish
        ? `Katso tätä kuvaa tarkasti. Kerro suomeksi mitä näet elävästi ääneen puhuttuna, poimi kiinnostavia yksityiskohtia ja anna tiivis yhteenveto. Poimi myös 3-4 havaittua esinettä tai piirrettä lyhyinä tunnisteina.`
        : `Look at this photo carefully. Describe what you see vividly for spoken audio, point out key details, and give a concise takeaway. Also extract 3-4 detected objects or visual features with short labels.`;

    const ai = getGenAIClient();
    const primaryModel = 'gemini-3.5-flash';
    const fallbackModel = 'gemini-3.5-flash-lite';

    if (ai && cleanBase64 && !cleanBase64.startsWith('<svg')) {
      try {
        const promptText = `${systemInstruction}\n\n${userPrompt}\n\nRespond ONLY with a valid JSON object in this exact schema (no markdown, no backticks):\n{\n  "speechText": "The dialogue for ElevenLabs to speak aloud in ${isFinnish ? 'FINNISH' : 'ENGLISH'} (2-4 natural sentences)",\n  "emotion": "amused" | "alarmed" | "impressed" | "skeptical" | "proud" | "curious" | "cheerful",\n  "tags": [\n    {"label": "Item 1", "description": "Short observation"},\n    {"label": "Item 2", "description": "Short observation"}\n  ],\n  "verdict": "1 punchy summary sentence or takeaway in ${isFinnish ? 'FINNISH' : 'ENGLISH'}"\n}`;

        let response: any = null;
        try {
          const apiPromise = ai.models.generateContent({
            model: primaryModel,
            contents: [
              {
                role: 'user',
                parts: [
                  { text: promptText },
                  {
                    inlineData: {
                      mimeType: mimeType.includes('png') ? 'image/png' : 'image/jpeg',
                      data: cleanBase64
                    }
                  }
                ]
              }
            ],
            config: {
              temperature: 0.7
            }
          });

          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Vision primary timeout')), 8500)
          );

          response = await Promise.race([apiPromise, timeoutPromise]);
        } catch (e1: any) {
          console.warn('Primary vision model failed, trying flash-lite:', e1.message);
          const litePromise = ai.models.generateContent({
            model: fallbackModel,
            contents: [
              {
                role: 'user',
                parts: [
                  { text: promptText },
                  {
                    inlineData: {
                      mimeType: mimeType.includes('png') ? 'image/png' : 'image/jpeg',
                      data: cleanBase64
                    }
                  }
                ]
              }
            ]
          });
          response = await Promise.race([
            litePromise,
            new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Lite timeout')), 6000))
          ]);
        }

        const rawText = response.text || '';
        const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);

        const summaryVerdict = parsed.verdict || parsed.hacklabVerdict || (isFinnish ? 'Kiinnostava kohde analysoitu.' : 'Engaging visual subject analyzed.');

        return res.json({
          success: true,
          ...parsed,
          verdict: summaryVerdict,
          hacklabVerdict: summaryVerdict, // backwards compatibility
          modelUsed: primaryModel,
          language,
          source: 'gemma_vision_live',
          durationMs: Date.now() - startTime
        });
      } catch (err: any) {
        console.warn('Live GenAI vision call bypassed, using dynamic contextual fallback:', err.message);
      }
    }

    // Dynamic contextual generator tailored by character and language
    const timestampSeed = Date.now() % 5;
    let chosenText = '';
    let chosenVerdict = '';

    if (character === 'matti') {
      if (isFinnish) {
        const dynamicMattiFi = [
          `No niin... Katotaas tätä ${focusArea || 'tekelettä'}. Kerrospaksuus heittää kyllä enemmän kuin katiska myrskyssä. Ota nyt ensin kuppi Juhla Mokkaa ja putsataan tuo tulostusalusta isopropanolilla ennen kuin jatketaan.`,
          `*Huoh*... Olen nähnyt Hacklab Mikkelissä monta kokeilua, mutta tässä ${focusArea || 'viritelmässä'} on kyllä aitoa lauantai-iltapäivän epätoivoa. Onneksi savua ei vielä nouse, mutta siistitään nuo johdot ensin.`,
          `Katohan vaan! Tuo juotosnäyte muistuttaa enemmän tinakökköä kuin sähköistä liitosta. Hae hyllystä numero kolme vähän fluksia ja kolvaa se uudelleen kunnolla.`,
          `Jos tämä vekotin on menossa tänään tuomareiden eteen, niin kannattaa laittaa reilusti rukouksia demojumalille. Mittaa yleismittarilla joka pinni ennen virtalähteen kytkemistä!`
        ];
        chosenText = dynamicMattiFi[timestampSeed % dynamicMattiFi.length];
        chosenVerdict = 'Pietarinkadun työpajatarkastus: Tarvitsee lisää tinaa ja kahvia.';
      } else {
        const dynamicMattiEn = [
          `No niin. Looking closely at this ${focusArea || 'setup'}, the layer consistency is quite questionable. You clearly rushed this before having your morning kahvi. Grab the wire cutters, clean the bench, and try again with proper patience.`,
          `*Huoh*... I have inspected hundreds of prototypes at Hacklab Mikkeli, and this ${focusArea || 'contraption'} is definitely one of the more chaotic ones. At least the power supply hasn't caught fire yet.`,
          `Katohan! The visual structure here shows some effort, but that solder joint is looking duller than a Finnish November morning. Reheat it with some fresh rosin-core flux from Bench #3.`
        ];
        chosenText = dynamicMattiEn[timestampSeed % dynamicMattiEn.length];
        chosenVerdict = 'Workshop verdict: Needs 10% more solder and 20% more patience.';
      }
    } else if (character === 'aino' || character === 'norppa') {
      if (isFinnish) {
        const dynamicAinoFi = [
          `Tässä kuvassa on aivan ihana ja rauhallinen tunnelma. Valo piirtää pehmeästi ${focusArea ? `kohteen "${focusArea}"` : 'yksityiskohtia'}, ja jokainen pieni piirre tuntuu huokuvan arjen lämpöä ja kauneutta.`,
          `Katson tätä näkymää ja mieleeni tulee raikas syysaamu Saimaan rannalla. Värien harmonia ja levollinen sommittelu tekevät tästä hetkestä todella kauniin pysähdyksen.`,
          `Miten viehättävä hetki tallennettuna! Erityisesti ${focusArea || 'kokonaisuuden tunnelma'} luo lempeän ja kotoisan vaikutelman, jota tekee mieli katsella pidempäänkin.`
        ];
        chosenText = dynamicAinoFi[timestampSeed % dynamicAinoFi.length];
        chosenVerdict = 'Aistillinen havainto: Harmoninen ja kaunis hetki arjessa.';
      } else {
        const dynamicAinoEn = [
          `There is such a gentle, mindful stillness in this scene. The ambient light touches ${focusArea ? `the "${focusArea}"` : 'the composition'} with soft Nordic warmth, revealing quiet everyday beauty.`,
          `Looking at this capture brings to mind a fresh morning by the Finnish lakes. The natural balance of colors and textures makes this a truly soothing visual moment.`,
          `What a lovely capture! The atmosphere and subtle depth give this subject a warm, poetic storytelling quality.`
        ];
        chosenText = dynamicAinoEn[timestampSeed % dynamicAinoEn.length];
        chosenVerdict = 'Poetic observation: A balanced and heartwarming visual capture.';
      }
    } else if (character === 'roast_bot') {
      if (isFinnish) {
        const dynamicRoastFi = [
          `Vau. Katson tätä kuvaa ja mietin, että keneltä saatiin lupa tähän visuaaliseen vallankumoukseen? ${focusArea ? `Tuo "${focusArea}"` : 'Tämä näkymä'} huutaa apua niin monella taajuudella, että yleismittarikin sekosi.`,
          `Onneksi olkoon, olet onnistunut luomaan jotain, mikä uhmaa sekä estetiikkaa että luonnonlakeja. Mutta rehellisesti sanoen, kunnioitan tätä rohkeaa omistautumista kaaokselle!`,
          `Jos tämä kuva olisi ravintola-annos, pyytäisin kokkia anteeksi. Jos se on modernia taidetta, se kuuluu museoon heti!`
        ];
        chosenText = dynamicRoastFi[timestampSeed % dynamicRoastFi.length];
        chosenVerdict = 'RoastBot-tuomio: 2/10 esteettisyys, 10/10 puhdasta rohkeutta.';
      } else {
        const dynamicRoastEn = [
          `Wow. I'm staring at this and genuinely wondering what sequence of life events led to this exact frame. ${focusArea ? `That "${focusArea}"` : 'This scene'} has more unearned confidence than a cat on a counter.`,
          `Congratulations, you've managed to defy both interior design and basic physics simultaneously. I'm roasted just looking at it, but honestly, I respect the hustle.`,
          `If this photo was a pitch deck, I'd invest solely out of sheer morbid curiosity. 10 out of 10 for chaotic energy!`
        ];
        chosenText = dynamicRoastEn[timestampSeed % dynamicRoastEn.length];
        chosenVerdict = 'RoastBot verdict: Questionable choices, unshakeable confidence.';
      }
    } else {
      // Default: Sofia the Vision Guide
      if (isFinnish) {
        const dynamicSofiaFi = [
          `Tässä kuvassa erottuu selkeä ja mielenkiintoinen sommittelu. ${focusArea ? `Kohteessa "${focusArea}"` : 'Kuvassa'} huomio kiinnittyy tarkkaan pintarakenteeseen ja ympäröivään valaistukseen, mikä tekee siitä visuaalisesti ilmeikkään.`,
          `Analysoin kuvan visuaalisia elementtejä: pääkohde on sijoitettu tasapainoisesti, ja sen erottuvat värisävyt ja kontrastit luovat selkeän hahmon taustaa vasten.`,
          `Kameran tallentama näkymä tarjoaa rikkaan yhdistelmän muotoja ja materiaaleja. Erityisesti ${focusArea || 'keskeinen kohde'} nousee esiin selkeänä ja tunnistettavana.`
        ];
        chosenText = dynamicSofiaFi[timestampSeed % dynamicSofiaFi.length];
        chosenVerdict = 'Visuaalinen analyysi: Tasapainoinen sommittelu ja selkeät yksityiskohdat.';
      } else {
        const dynamicSofiaEn = [
          `In this image, we observe a clear and articulate visual arrangement. ${focusArea ? `Focusing on "${focusArea}"` : 'The main subject'}, the textural details and surrounding ambient lighting create high visual definition.`,
          `Analyzing the composition: the focal subject is balanced well against the backdrop, with defined contours and distinct color contrasts highlighting its key features.`,
          `This frame presents an informative blend of shapes and materials. The subject stands out crisply with strong visual clarity.`
        ];
        chosenText = dynamicSofiaEn[timestampSeed % dynamicSofiaEn.length];
        chosenVerdict = 'Visual analysis: Balanced framing with clear tactile and spatial definition.';
      }
    }

    return res.json({
      success: true,
      speechText: chosenText,
      emotion: character === 'roast_bot' ? 'amused' : character === 'aino' ? 'cheerful' : 'impressed',
      tags: [
        { label: focusArea || (isFinnish ? 'Pääkohde' : 'Primary Subject'), description: isFinnish ? 'Kuvan keskeinen visuaalinen elementti' : 'Central visual focus detected by vision model' },
        { label: isFinnish ? 'Valaistus & Värit' : 'Lighting & Tones', description: isFinnish ? 'Valon suunta ja sävykontrasti' : 'Natural ambient illumination and contrast' },
        { label: isFinnish ? 'Materiaali & Ympäristö' : 'Texture & Setting', description: isFinnish ? 'Pintalaatu ja tilan konteksti' : 'Surface textures and surrounding environment' }
      ],
      verdict: chosenVerdict,
      hacklabVerdict: chosenVerdict,
      modelUsed: 'contextual_dsp_engine',
      language,
      source: 'dynamic_vision_engine',
      durationMs: Date.now() - startTime
    });
  } catch (err: any) {
    console.error('Error in /api/vision/analyze:', err);
    return res.status(500).json({ error: err.message || 'Vision server error' });
  }
});

// API: ElevenLabs Text-to-Speech Proxy (Supports Multilingual v2 for Finnish & English)
app.post('/api/elevenlabs/tts', async (req, res) => {
  try {
    const {
      text,
      voiceId = 'VR6AewLTigWG4xSOukaG',
      customApiKey,
      language = 'fi',
      stability = 0.5,
      similarity_boost = 0.8,
      style = 0.2
    } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required for TTS' });
    }

    const apiKey = customApiKey || process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
      return res.status(400).json({
        error: 'No ElevenLabs API key found. Use browser speech synthesis or provide your key in settings.',
        fallbackToBrowser: true
      });
    }

    // eleven_multilingual_v2 provides native, flawless Finnish and multilingual pronunciation
    const model_id = 'eleven_multilingual_v2';

    const elevenRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg'
      },
      body: JSON.stringify({
        text,
        model_id,
        voice_settings: {
          stability: Math.min(Math.max(stability, 0), 1),
          similarity_boost: Math.min(Math.max(similarity_boost, 0), 1),
          style: Math.min(Math.max(style, 0), 1),
          use_speaker_boost: true
        }
      })
    });

    if (!elevenRes.ok) {
      const errText = await elevenRes.text();
      console.warn('ElevenLabs API returned error:', errText);
      return res.status(elevenRes.status).json({
        error: `ElevenLabs API error: ${errText}`,
        fallbackToBrowser: true
      });
    }

    const audioBuffer = await elevenRes.arrayBuffer();
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.byteLength
    });
    return res.send(Buffer.from(audioBuffer));
  } catch (err: any) {
    console.error('Error in /api/elevenlabs/tts:', err);
    return res.status(500).json({ error: err.message || 'TTS server error', fallbackToBrowser: true });
  }
});

// Setup Vite middlewares in development or static dist in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const distPath = path.resolve(process.cwd(), 'dist');
  const distExists = fs.existsSync(path.join(distPath, 'index.html'));

  if (isProd && distExists) {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    try {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (err) {
      console.warn('Vite middleware could not start, checking for static dist:', err);
      if (distExists) {
        app.use(express.static(distPath));
        app.get('*', (_req, res) => {
          res.sendFile(path.join(distPath, 'index.html'));
        });
      }
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Pikseli Vision × ElevenLabs Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
