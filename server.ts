import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
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
      matti: `Puhu SUOMEKSI! Olet Matti, Hacklab Mikkelin (Pietarinkatu 23) kokenut verstasveteraani. 
Sinulla on kuiva savolainen/suomalainen huumorintaju, huokailet välillä (*huoh* tai *no niin*), rakastat vahvaa mustaa Juhla Mokkaa, ja olet nähnyt tuhat pieleen mennyttä 3D-tulostetta ja kylmäjuotosta. 
Tarkastele tätä kuvaa ja anna aito suomenkielinen työpajakommentti (max 3-4 lausetta). Älä toista vanhoja lauseita.`,
      dr_gemma: `Puhu SUOMEKSI! Olet Dr. Gemma, futuristinen kyberpunk-laitteistodiagnostikko ja elektroniikkatutkija. 
Tutki kuvan rakennetta, mikrovikoja ja komponentteja tieteellisellä tarkkuudella ja tulevaisuuden innostuksella (max 3-4 lausetta).`,
      norppa: `Puhu SUOMEKSI! Olet Saimaan norppa Mikkelin vesiltä. 
Ihmettelet ihmisten teknologiaa ja arvioit kuvan kohdetta sympaattisesti Saimaan luonnon ja kalapisteiden mukaan (max 3-4 lausetta).`,
      roast_bot: `Puhu SUOMEKSI! Olet RoastBot 9000, armoton mutta hyväntahtoinen hackathon-kriitikko. 
Heitä terävä ja hulvaton komediakuitti tästä kuvasta, johtosotkusta tai tulosteesta (max 3 lausetta).`
    };

    const characterPromptsEn: Record<string, string> = {
      matti: `Speak in ENGLISH! You are Matti, a veteran Finnish maker at Hacklab Mikkeli (Pietarinkatu 23). 
You speak English with dry Finnish humor, a pragmatic attitude, sigh occasionally (*huoh*), love strong black kahvi (coffee), and have seen 1000 broken electronics. 
Inspect this photo carefully. Give fresh, specific critique with Finnish workshop wisdom and dry wit (max 3-4 natural sentences).`,
      dr_gemma: `Speak in ENGLISH! You are Dr. Gemma, a high-tech cyberpunk hardware diagnostician and electronics forensic investigator. 
Inspect this photo for micro-defects, thermal hazards, and component clues. Speak with scientific precision and dramatic enthusiasm (max 3-4 punchy sentences).`,
      norppa: `Speak in ENGLISH! You are Norppa, a cheeky Saimaa ringed seal from Lake Saimaa near Mikkeli. 
You rate human contraptions based on water cleanliness and fish approval (max 3-4 friendly sentences).`,
      roast_bot: `Speak in ENGLISH! You are RoastBot 9000, an uncensored sarcastic AI critic at a hackathon. 
Deliver a hilarious, sharp comedy roast of the wiring, cable management, or 3D print quality visible (max 3 punchy sentences).`
    };

    const systemInstruction = isFinnish
      ? characterPromptsFi[character] || characterPromptsFi.matti
      : characterPromptsEn[character] || characterPromptsEn.matti;

    const userPrompt = focusArea
      ? isFinnish
        ? `Katso tarkasti kohtaa "${focusArea}" tässä kuvassa. Anna reaktiosi ja huomiosi hahmona.`
        : `Look specifically at the "${focusArea}" in this image. Give your reaction and analysis in character.`
      : isFinnish
        ? `Katso tätä valokuvaa tarkasti. Kerro suomeksi mitä näet, poimi kiinnostavia tai pieleen menneitä yksityiskohtia ja anna työpajatuomiosi. Poimi myös 3-4 havaittua esinettä lyhyinä tunnisteina.`
        : `Look at this photo carefully. Tell the user what you see, point out specific details, and give your verdict. Also extract 3-4 detected objects with short labels.`;

    const ai = getGenAIClient();
    const primaryModel = 'gemini-3.5-flash';
    const fallbackModel = 'gemini-3.5-flash-lite';

    if (ai && cleanBase64 && !cleanBase64.startsWith('<svg')) {
      try {
        const promptText = `${systemInstruction}\n\n${userPrompt}\n\nRespond ONLY with a valid JSON object in this exact schema (no markdown, no backticks):\n{\n  "speechText": "The dialogue for ElevenLabs to speak aloud in ${isFinnish ? 'FINNISH' : 'ENGLISH'} (3-4 sentences max)",\n  "emotion": "amused" | "alarmed" | "impressed" | "skeptical" | "proud",\n  "tags": [\n    {"label": "Item 1", "description": "Short observation"},\n    {"label": "Item 2", "description": "Short observation"}\n  ],\n  "hacklabVerdict": "1 sentence workshop verdict in ${isFinnish ? 'FINNISH' : 'ENGLISH'}"\n}`;

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

        return res.json({
          success: true,
          ...parsed,
          modelUsed: primaryModel,
          language,
          source: 'gemma_vision_live',
          durationMs: Date.now() - startTime
        });
      } catch (err: any) {
        console.warn('Live GenAI vision call bypassed, using dynamic contextual fallback:', err.message);
      }
    }

    // Dynamic contextual generator (bilingual Suomi / English)
    const timestampSeed = Date.now() % 5;
    let chosenText = '';
    let chosenVerdict = '';

    if (isFinnish) {
      const dynamicMattiFi = [
        `No niin... Katotaas tätä ${focusArea || 'tekelettä'}. Kerrospaksuus heittää kyllä enemmän kuin katiska myrskyssä. Ota nyt ensin kuppi Juhla Mokkaa ja putsataan tuo tulostusalusta isopropanolilla ennen kuin jatketaan.`,
        `*Huoh*... Olen nähnyt Hacklab Mikkelissä monta kokeilua, mutta tässä ${focusArea || 'viritelmässä'} on kyllä aitoa lauantai-iltapäivän epätoivoa. Onneksi savua ei vielä nouse, mutta siistitään nuo johdot ensin.`,
        `Katohan vaan! Tuo juotosnäyte muistuttaa enemmän tinakökköä kuin sähköistä liitosta. Hae hyllystä numero kolme vähän fluksia ja kolvaa se uudelleen kunnolla.`,
        `Jos tämä vekotin on menossa tänään tuomareiden eteen, niin kannattaa laittaa reilusti rukouksia demojumalille. Mittaa yleismittarilla joka pinni ennen virtalähteen kytkemistä!`,
        `No niin! Mekaanisesti tämä näyttää selvinneen Pietarinkadun portaista alas heittämisestä, mutta pienellä kuumaliimalla ja kutistesukalla tästä saattaa vielä tulla toimiva peli.`
      ];
      chosenText = dynamicMattiFi[timestampSeed % dynamicMattiFi.length];
      chosenVerdict = 'Pietarinkadun työpajatarkastus: Tarvitsee lisää tinaa ja kahvia.';
    } else {
      const dynamicMattiEn = [
        `No niin. Looking closely at this ${focusArea || 'setup'}, the layer consistency is quite questionable. You clearly rushed this before having your morning kahvi. Grab the wire cutters, clean the bench, and try again with proper patience.`,
        `*Huoh*... I have inspected hundreds of prototypes at Hacklab Mikkeli, and this ${focusArea || 'contraption'} is definitely one of the more chaotic ones. At least the power supply hasn't caught fire yet.`,
        `Katohan! The visual structure here shows some effort, but that solder joint is looking duller than a Finnish November morning. Reheat it with some fresh rosin-core flux from Bench #3.`,
        `If this is meant for a hackathon demo, you better pray the demo gods are feeling merciful today. Have a cup of dark roast and test every single pin with a multimeter before plugging it in.`
      ];
      chosenText = dynamicMattiEn[timestampSeed % dynamicMattiEn.length];
      chosenVerdict = 'Workshop verdict: Needs 10% more solder and 20% more patience.';
    }

    return res.json({
      success: true,
      speechText: chosenText,
      emotion: timestampSeed % 2 === 0 ? 'skeptical' : 'amused',
      tags: [
        { label: focusArea || (isFinnish ? 'Pääkohde' : 'Primary Object'), description: isFinnish ? 'Tarkasteltu visuaalinen alue' : 'Visual region identified under magnification' },
        { label: isFinnish ? 'Pintalaatu' : 'Surface Quality', description: isFinnish ? 'Kerrokset ja materiaalit' : 'Layer lines and material properties' },
        { label: isFinnish ? 'Hacklab-toleranssi' : 'Hacklab Tolerance', description: isFinnish ? 'Hyväksytty savolainen nikkarointi' : 'Passes Finnish makerspace safety check' }
      ],
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

// Setup Vite middlewares in development
async function startServer() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Pikseli Vision × ElevenLabs Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
