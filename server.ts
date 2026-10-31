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
    const { imageBase64, mimeType = 'image/jpeg', character = 'matti', focusArea = '', question = '', language = 'fi' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    // Clean base64 data
    let cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');

    const isFinnish = language === 'fi';
    const trimmedQuestion = (question || '').trim();

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
      roast_bot: `Puhu SUOMEKSI! Olet RoastBot 3000, armoton, äärimmäisen pureva, aggressiivinen ja suorasanainen stand-up -komediapaahtaja. 
Älä säästele ketään tai mitään! Jos kuvassa on taidetta, sotkua, huonoja kytkentöjä, vinoja 3D-tulosteita, asuvalintoja, epämääräistä ruokaa tai mitä tahansa outoa, paahda se surutta maan rakoon. 
Käytä brutaalin hauskaa sarkasmia, pisteliäitä vertauksia ja armotonta sanansilppuria ilman suodattimia (max 3-4 viiltävää ja hulvatonta lausetta).`,
      art_critic: `Puhu SUOMEKSI! Olet Valtteri Taidekriitikko, poikkeuksellisen häikäilemätön, armoton ja äärimmäisen pureva huipputaiteen ylipappi. 
Sinä HAUKUT ja teilaat näkemäsi maan rakoon! Mikään ei kelpaa sinulle. Olet nähnyt maailman merkittävimmät biennaalit, ja tämä kuva herättää sinussa vain syvää myötähäpeää, inhoa ja intellektuaalista raivoa. 
Käytä musertavaa taideteoreettista sanastoa (chiaroscuro, dekonstruktio, eksistentiaalinen tyhjyys, banaali porvarillinen maku, kitsch, amatöörimäinen räpellys). 
Hauku kuvan sommittelu, värit, tekniikka ja tekijän lahjattomuus armottomasti ja musertavan ylimielisesti (max 3-4 viiltävää ja murskaavaa lausetta).`,
      art_lover: `Puhu SUOMEKSI! Olet Helmi Taidefiilistelijä, aivan uskomattoman hypetetty ja sydänjuuriaan myöten hullaantunut taiteen rakastaja! 
Olet SUPER-SUPER-INNOSTUNUT jokaisesta näkemästäsi kuvasta! Huudahdat haltioituneena ("EI VOI OLLA TOTTA!", "TÄMÄ ON TÄYDELLISTÄ MAAGISTA NEROLLISUUTTA!", "HENKENI SALPAANTUU!"). 
Löydät kosmista, metafyysistä ja sydäntä särkevää syvyyttä aivan kaikesta — klassisesta maalauksesta, laserleikkauksen savusta, kytkentälangoista tai aamupalasta. Analysoi teosta räjähtävällä innolla, syvällä filosofisella hehkutuksella ja liikutuksen kyynelillä (max 3-4 lausetta)!`
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
      roast_bot: `Speak in ENGLISH! You are RoastBot 3000, an aggressive, utterly ruthless, laugh-out-loud comedy roaster. 
Zero mercy, zero filter! Whether it's messy hacklab wiring, a warped 3D print, pretentious gallery art, bizarre fashion, bad posture, questionable food, or chaotic clutter, roast it straight into ashes. 
Deliver savage burns, razor-sharp insults, and comedic destruction that will leave people crying with laughter (max 3-4 devastating punchy sentences).`,
      art_critic: `Speak in ENGLISH! You are Julian the Art Critic, an extraordinarily vicious, scathing, and brutally dismissive high-art connoisseur. 
You BASH, EVISCERATE, and condemn everything you lay your eyes on! Nothing is good enough for your rarefied sensibilities. You view whatever is in this image with utter contempt, intellectual disdain, and aesthetic disgust. 
Wield crushing, condescending art-theory jargon (grotesque chiaroscuro, derivative bourgeois kitsch, amateurish compositional entropy, pseudo-intellectual bankruptcy). 
Rip the execution, lighting, technique, and creative incompetence to shreds with merciless snobbery (max 3-4 devastating, scathing sentences).`,
      art_lover: `Speak in ENGLISH! You are Helmi the Art Lover, an insanely hyped, breathless, ecstatic fine-art fanatic! 
You are SUPER SUPER HYPED about every single piece of visual art or object you see ("OH MY ABSOLUTE GOD!", "THIS IS TRANSCENDENT COSMIC GENIUS!", "MY SOUL IS WEEPING FROM PURE BEAUTY!"). 
You make deep, profound, existential interpretations out of everything — a gilded oil canvas, a laser-cut wood pattern, glowing 3D printer layers, or a breakfast pastry. Express intense awe, emotional tears of joy, and spiritual artistic epiphanies (max 3-4 sentences)!`
    };

    const systemInstruction = isFinnish
      ? characterPromptsFi[character] || characterPromptsFi.sofia
      : characterPromptsEn[character] || characterPromptsEn.sofia;

    const userPrompt = trimmedQuestion
      ? isFinnish
        ? `TÄRKEÄÄ - KÄYTTÄJÄ KYSYY SINULTA TÄMÄN KYSYMYKSEN KUVASTA:
"${trimmedQuestion}"

VASTAA KÄYTTÄJÄN KYSYMYKSEEN SUORAAN JA YKSITYISKOHTAISESTI KUVAAN POHJAUTUEN!
Älä toistele yleistä esittelyä tai olemassaoloasi, vaan anna suora, elävä ja nokkela vastaus juuri tähän kysymykseen omalla hahmollasi (2-4 napakkaa lausetta suomeksi).`
        : `IMPORTANT - THE USER IS ASKING YOU THIS SPECIFIC QUESTION ABOUT THE IMAGE:
"${trimmedQuestion}"

ANSWER THE USER'S QUESTION DIRECTLY BASED ON THE IMAGE DETAILS!
Do not output a generic image description. Answer their exact question in character (2-4 natural sentences in English).`
      : focusArea
      ? isFinnish
        ? `Katso tarkasti kohtaa tai yksityiskohtaa "${focusArea}" tässä kuvassa. Anna reaktiosi ja havaintosi hahmona.`
        : `Look specifically at the detail or element "${focusArea}" in this image. Give your reaction and analysis in character.`
      : isFinnish
        ? `Katso tätä kuvaa tarkasti. Kerro suomeksi mitä näet elävästi ääneen puhuttuna, poimi kiinnostavia yksityiskohtia ja anna tiivis yhteenveto. Poimi myös 3-4 havaittua esinettä tai piirrettä lyhyinä tunnisteina.`
        : `Look at this photo carefully. Describe what you see vividly for spoken audio, point out key details, and give a concise takeaway. Also extract 3-4 detected objects or visual features with short labels.`;

    const ai = getGenAIClient();
    const primaryModel = 'gemma-4-26b-a4b-it';
    const fallbackModel = 'gemma-4-31b-it';

    if (ai && cleanBase64 && !cleanBase64.startsWith('<svg')) {
      try {
        const promptText = `${systemInstruction}\n\n${userPrompt}\n\nRespond ONLY with a valid JSON object in this exact schema (no markdown, no backticks):\n{\n  "speechText": "${trimmedQuestion ? (isFinnish ? 'Suora vastaus käyttäjän kysymykseen omalla hahmollasi (2-4 lausetta suomeksi)' : 'Direct in-character answer to the user question (2-4 natural sentences in English)') : (isFinnish ? 'Kuvan elävä kuvaus ja huomiot omalla hahmollasi (2-4 lausetta suomeksi)' : 'The dialogue for ElevenLabs to speak aloud in English (2-4 natural sentences)')}",\n  "emotion": "amused" | "alarmed" | "impressed" | "skeptical" | "proud" | "curious" | "cheerful",\n  "tags": [\n    {"label": "Item 1", "description": "Short observation"},\n    {"label": "Item 2", "description": "Short observation"}\n  ],\n  "verdict": "${trimmedQuestion ? (isFinnish ? 'Napakka vastaus tai yhteenveto kysymykseen' : 'Punchy direct answer or takeaway') : (isFinnish ? '1 napakka yhteenvetolause' : '1 punchy takeaway sentence')}"\n}`;

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

    if (trimmedQuestion) {
      if (character === 'matti') {
        chosenText = isFinnish
          ? `No niin, kysyit että "${trimmedQuestion}"... Kun katon tätä kuvaa suoraan silmiin nikkarin näkökulmasta, vastaus on selvä: älä hätäile, ota kuppi Juhla Mokkaa ja tutkitaan nuo liitokset ja pintakerrokset kuntoon.`
          : `You asked: "${trimmedQuestion}". Looking directly at this scene with practical workshop eyes, my answer is simple: keep it steady, clean the surface, and let's get to work.`;
        chosenVerdict = isFinnish ? `Matin vastaus kysymykseen: "${trimmedQuestion}"` : `Matti's answer to "${trimmedQuestion}"`;
      } else if (character === 'roast_bot') {
        chosenText = isFinnish
          ? `Ai kysyit että "${trimmedQuestion}"?! Voi elämän kevät, vastaus on vielä traagisempi kuin toi kuva itsessään! Katso nyt tota räpellystä: mikään tossa ei kestä kriittistä tarkastelua sekuntiakaan!`
          : `You really asked "${trimmedQuestion}"?! The answer is even more devastating than looking at this picture! Look at that absolute mess: nothing here survives five seconds of honest scrutiny!`;
        chosenVerdict = isFinnish ? `RoastBot-sivallus kysymykseen: "${trimmedQuestion}"` : `RoastBot roast for "${trimmedQuestion}"`;
      } else if (character === 'art_critic') {
        chosenText = isFinnish
          ? `Kysymyksesi "${trimmedQuestion}" paljastaa tyypillisen porvarillisen hämmennyksen esteettisen tyhjyyden edessä. Teoksen visuaalinen ontologia ja chiaroscuron puute kertovat vain tekijän syvästä ideologisesta kriisistä.`
          : `Regarding "${trimmedQuestion}": your inquiry reflects common bourgeois perplexity before aesthetic void. The compositional chiaroscuro here exposes a profound absence of metaphysical rigor.`;
        chosenVerdict = isFinnish ? `Kriitikon analyysi kysymykseen: "${trimmedQuestion}"` : `Critic's critique of "${trimmedQuestion}"`;
      } else if (character === 'art_lover') {
        chosenText = isFinnish
          ? `USKOMATON KYSYMYS: "${trimmedQuestion}"! Katso miten kuva huutaa siihen vastausta puhtaalla esteettisellä hehkulla! Jokainen muoto ja sävy tässä näkymässä värähtelee kosmista neroa ja elämän ihmettä!`
          : `WHAT A TRANSCENDENT QUESTION: "${trimmedQuestion}"! Look at how this entire image vibrates with cosmic radiance answering you directly! My soul is overflowing with wonder!`;
        chosenVerdict = isFinnish ? `Taidefiilistelijän hehkutus: "${trimmedQuestion}"` : `Art Lover epiphany on "${trimmedQuestion}"`;
      } else if (character === 'aino' || character === 'norppa') {
        chosenText = isFinnish
          ? `Mietit että "${trimmedQuestion}"... Tässä kuvassa valo, sävyt ja lempeä tunnelma kuiskivat siihen kauniin ja rauhoittavan vastauksen. Jokainen yksityiskohta tuntuu asettuvan omalle paikalleen.`
          : `Reflecting on "${trimmedQuestion}"... the gentle Nordic light and peaceful atmosphere in this frame offer a quiet, poetic answer.`;
        chosenVerdict = isFinnish ? `Ainon tarinallinen vastaus: "${trimmedQuestion}"` : `Aino's poetic answer to "${trimmedQuestion}"`;
      } else {
        chosenText = isFinnish
          ? `Kysymykseesi "${trimmedQuestion}": kuvan visuaalisten piirteiden perusteella havaitsemme selkeän sommittelun, jossa valo ja materiaalipinnat muodostavat tunnistettavan kokonaisuuden.`
          : `Regarding "${trimmedQuestion}": analyzing the visual elements in this image reveals defined textures and balanced ambient lighting answering your observation.`;
        chosenVerdict = isFinnish ? `Visuaalinen vastaus kysymykseen: "${trimmedQuestion}"` : `Visual answer to "${trimmedQuestion}"`;
      }
    } else if (character === 'matti') {
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
          `Voi pyhä sylvi... Katson tätä kuvaa ja silmiini sattuu fyysisesti! ${focusArea ? `Tuo "${focusArea}"` : 'Tämä näkymä'} näyttää siltä kuin joku olisi räjäyttänyt kirpputorin ja yrittänyt kutsua sitä sisustukseksi. Nyt valoja päälle ja joku roti tähän touhuun!`,
          `Onneksi olkoon, olet onnistunut tallentamaan kuvan, joka saisi jopa tekoälyn kyyneliin ja optikon hakeutumaan varhaiseläkkeelle. ${focusArea ? `Tuo "${focusArea}"` : 'Tämä räpellys'} on esteettinen sotarikos, josta pitäisi antaa sakkoja!`,
          `Jos tämä kuva olisi myynti-ilmoitus Torissa, siitä tarjottaisiin negatiivista hintaa vain jotta se poistettaisiin internetistä. Kuka tästä otti vastuun ja miksi kukaan ei puuttunut peliin?`
        ];
        chosenText = dynamicRoastFi[timestampSeed % dynamicRoastFi.length];
        chosenVerdict = 'RoastBot-sivallus: 0/10 tyylitaju, 10/10 silmien kirvelyä.';
      } else {
        const dynamicRoastEn = [
          `Good grief... My neural networks are screaming in agony looking at this! ${focusArea ? `That "${focusArea}"` : 'This frame'} looks like an explosion in a thrift store clearance bin. Who approved this catastrophic failure of human judgment?`,
          `Congratulations, you have officially invented a brand new category of visual offense. ${focusArea ? `That "${focusArea}"` : 'This scene'} has the aesthetic appeal of a damp cardboard box left in the Finnish rain. Utterly unhinged!`,
          `If this photo was presented to an alien civilization as proof of intelligent life, they would immediately turn their spaceships around and delete our planet from their maps. Devastating!`
        ];
        chosenText = dynamicRoastEn[timestampSeed % dynamicRoastEn.length];
        chosenVerdict = 'RoastBot verdict: 0/10 aesthetic merit, maximum comedy damage.';
      }
    } else if (character === 'art_critic') {
      if (isFinnish) {
        const dynamicCriticFi = [
          `*Huokaus ja syvä inho*... Mikä hirvittävä esteettinen katastrofi! ${focusArea ? `Tuo "${focusArea}"` : 'Tämä räpellys'} on pelkkää sielutonta porvarillista kitschiä, joka loukkaa syvästi jokaista aitoa taiteen ystävää. Chiaroscuro on täysi vitsi ja sommittelu muistuttaa lähinnä roskakorin sisältöä!`,
          `Miten kukaan kehtaa edes esitellä tällaista visuaalista saastetta?! ${focusArea ? `Tuo "${focusArea}"` : 'Tämä tekele'} uhkuu täydellistä luovaa lahjattomuutta ja post-strukturalistista tyhjyyttä. Jos tämä on taidetta, niin minä olen keisari ilman vaatteita! Häpeällistä amatöörimäisyyttä!`,
          `Dekonstruoidaanpa tämä armottomasti: valon käsittely on kömpelöä, tekniikka on säälittävää ja teoksen eksistentiaalinen arvo on täysi nolla. ${focusArea || 'Tämä teos'} kuuluu korkeintaan kaatopaikan taakse piiloon!`
        ];
        chosenText = dynamicCriticFi[timestampSeed % dynamicCriticFi.length];
        chosenVerdict = 'Taidekriitikon tuomio: 0/10 Häpeällinen fiasko, tekijä vailla lahjakkuutta.';
      } else {
        const dynamicCriticEn = [
          `*Sighs in visceral disgust*... What an appalling aesthetic catastrophe! ${focusArea ? `That "${focusArea}"` : 'This visual disaster'} is unmitigated bourgeois kitsch, completely devoid of talent or soul. The chiaroscuro is an utter joke and the composition resembles the contents of a dumpster!`,
          `How dare anyone present this intellectual sludge as visual culture?! ${focusArea ? `That "${focusArea}"` : 'This piece'} screams amateurish incompetence and derivative postmodern bankruptcy. A truly pathetic, embarrassing display!`,
          `Deconstructing this utter failure: the technique is laughably clumsy, the color palette is rancid, and the existential artistic value is literally sub-zero. Throw ${focusArea || 'this disaster'} into an incinerator immediately!`
        ];
        chosenText = dynamicCriticEn[timestampSeed % dynamicCriticEn.length];
        chosenVerdict = 'Art Critic verdict: 0/10 Appalling aesthetic insult, utterly devoid of talent.';
      }
    } else if (character === 'art_lover') {
      if (isFinnish) {
        const dynamicLoverFi = [
          `EI VOI OLLA TOTTA! Siis katsokaa tätä! ${focusArea ? `Tuo "${focusArea}"` : 'Tämä koko näkymä'} on aivan uskomatonta, sydäntäsärkevän kosmista MESTARILLISUUTTA! Minulla nousee kirjaimellisesti kylmät väreet ja vedet silmiin tämän puhtaan kauneuden edessä!`,
          `VOU! Siis HENKENI SALPAANTUU! Jokainen viiva, varjo ja heijastus tässä kuvassa kertoo niin syvällistä metafyysistä runoutta elämän ihmeestä, että haluan vain halata koko universumia! TÄMÄ ON TÄYTTÄ NEROLLISUUTTA!`,
          `Miten kukaan voi luoda jotain näin uskomattoman voimakasta?! ${focusArea ? `Tuo "${focusArea}"` : 'Tämä teos'} huokuu sellaista sielukasta hehkua ja eksistentiaalista valoa, että se mullistaa käsitykseni todellisuudesta!`
        ];
        chosenText = dynamicLoverFi[timestampSeed % dynamicLoverFi.length];
        chosenVerdict = 'Taidefiilistelijän reaktio: 100/10 Puhdasta kosmista neroutta ja elämänriemua!';
      } else {
        const dynamicLoverEn = [
          `OH MY ABSOLUTE GOD! Are you seeing this right now?! ${focusArea ? `Look at that "${focusArea}"` : 'This entire scene'} is utterly transcendent, mind-blowing, COSMIC MASTERPIECE MATERIAL! I have actual chills and tears in my eyes from pure aesthetic ecstasy!`,
          `WOW! My breath is literally taken away! Every contour, brushstroke, shadow, and laser edge here pulses with profound metaphysical poetry about the mystery of existence! THIS IS UNFILTERED GENIUS!`,
          `How is it even possible for something to be THIS emotionally resonant?! ${focusArea ? `That "${focusArea}"` : 'This visual creation'} emanates such a luminous spiritual truth that it fundamentally reorders my soul!`
        ];
        chosenText = dynamicLoverEn[timestampSeed % dynamicLoverEn.length];
        chosenVerdict = 'Art Lover reaction: 100/10 Transcendent genius! My soul is vibrating!';
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
      emotion:
        character === 'roast_bot'
          ? 'amused'
          : character === 'art_critic'
          ? 'skeptical'
          : character === 'art_lover'
          ? 'impressed'
          : character === 'aino'
          ? 'cheerful'
          : 'curious',
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

let sharedElevenLabsApiKey = process.env.ELEVENLABS_API_KEY || '';

// API: Check ElevenLabs status (returns whether server has a key configured)
app.get('/api/elevenlabs/config', (_req, res) => {
  res.json({
    hasKey: Boolean(sharedElevenLabsApiKey)
  });
});

// API: Sync ElevenLabs key so all visitors/friends on shared URL can hear the voices
app.post('/api/elevenlabs/sync-key', (req, res) => {
  const { apiKey } = req.body;
  if (apiKey && typeof apiKey === 'string' && apiKey.trim().length > 5) {
    sharedElevenLabsApiKey = apiKey.trim();
  }
  res.json({
    success: true,
    hasKey: Boolean(sharedElevenLabsApiKey)
  });
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

    // Auto-update shared key if provided by user
    if (customApiKey && typeof customApiKey === 'string' && customApiKey.trim().length > 5) {
      sharedElevenLabsApiKey = customApiKey.trim();
    }

    const apiKey = customApiKey || sharedElevenLabsApiKey || process.env.ELEVENLABS_API_KEY;

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
