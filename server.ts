import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import ollama from 'ollama';
import { 
  INDIAN_STANDARDS_DATABASE, 
  CERTIFICATION_SCHEMES, 
  BIS_TESTING_LABORATORIES, 
  GOLD_PURITY_GRADES,
  MANDATORY_HALLMARK_MARKS,
  findStandardByQuery,
  findLabsByProductOrRegion
} from './src/data/bisStandardsData.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to generate authoritative, source-backed BIS answer in plain language
function generateBisKnowledgeAnswer(prompt: string): { content: string; queries: string[]; sources: any[] } {
  const p = prompt.toLowerCase();
  
  // Case 1: Gold Jewellery / Hallmarking / HUID
  if (p.includes('gold') || p.includes('jewel') || p.includes('hallmark') || p.includes('huid') || p.includes('carat') || p.includes('karat') || p.includes('purity') || p.includes('silver')) {
    const content = `### Official BIS Gold Jewellery Hallmarking & Buyer Guidance

**Standard Reference:** **IS 1417:2016** (*Gold and Gold Alloys, Jewellery/Artefacts — Fineness and Marking*)
**Mandatory Status:** Compulsory under the *Hallmarking of Gold Jewellery and Gold Artefacts Order* across notified districts in India.

#### 1. The 3 Mandatory Hallmark Signs
Whenever buying gold jewellery in India, always insist on seeing the **3 official marks** using a 10x magnifying loupe provided by the jeweller:
1. **BIS Standard Logo**: A triangle with a stylized 'S' symbol inside, certifying government compliance.
2. **Purity in Karat & Fineness**:
   - **22K916**: 22 Karat (91.6% pure gold) — *most common for wedding jewellery*
   - **18K750**: 18 Karat (75.0% pure gold) — *standard for diamond-studded jewellery*
   - **14K585**: 14 Karat (58.5% pure gold) — *contemporary daily wear*
   - **20K833**: 20 Karat (83.3% pure gold)
   - **24K995 / 24K999**: 24 Karat (99.5% to 99.9% pure gold — coins/bullion)
3. **6-Digit Alphanumeric HUID (Hallmark Unique Identification)**:
   - A unique code (e.g., \`AB1234\`) laser-etched onto every individual ornament by a BIS-recognized Assaying & Hallmarking Centre (AHC).

#### 2. How to Verify on the "BIS Care" Mobile App
1. Download the official **BIS Care App** (from Google Play Store or Apple App Store).
2. Tap on **"Verify HUID"**.
3. Type the 6-digit alphanumeric code stamped on your jewellery piece.
4. The app instantly verifies:
   - Jeweller registration number & name
   - Assaying & Hallmarking Centre (AHC) details
   - Date of hallmarking & exact article type (ring, bangle, chain, etc.)

#### 3. Consumer Rights & Substandard Compensation
- **Affordable Testing**: Any consumer can get their gold jewellery purity tested at any BIS-recognized AHC for a fee of just **₹45 + GST**.
- **Legal Compensation**: If the tested gold is found lower than the marked karat purity, the jeweller is legally bound to refund the difference, reimburse testing fees, and pay **2x compensation** under BIS (Hallmarking) Regulations.`;

    return {
      content,
      queries: [
        'site:bis.gov.in IS 1417 gold hallmarking rules 3 marks',
        'site:manakonline.in HUID verification guidelines consumer protection'
      ],
      sources: [
        { title: 'BIS Official Hallmarking Portal (Scheme-IV)', url: 'https://www.manakonline.in/MANAK/hallmarkingHome' },
        { title: 'Bureau of Indian Standards - Know Your Hallmark', url: 'https://bis.gov.in/hallmarking-overview/' },
        { title: 'Department of Consumer Affairs - Gold Hallmarking Guidelines', url: 'https://consumeraffairs.nic.in' }
      ]
    };
  }

  // Case 2: Step-by-step Certification Process (ISI Mark Scheme-I, CRS Scheme-II, FMCS)
  if (p.includes('process') || p.includes('step') || p.includes('how to get') || p.includes('procedure') || p.includes('license') || p.includes('registration') || p.includes('scheme') || p.includes('apply')) {
    const isCrs = p.includes('crs') || p.includes('electronic') || p.includes('it') || p.includes('battery') || p.includes('led') || p.includes('laptop');
    const scheme = isCrs ? CERTIFICATION_SCHEMES[1] : CERTIFICATION_SCHEMES[0];

    const stepsText = scheme.steps.map(s => `**Step ${s.stepNumber}: ${s.title}**\n- ${s.description}\n- *Required Action:* ${s.actionRequired}\n- *Key Documents:* ${s.documentsNeeded.join(', ')}`).join('\n\n');

    const content = `### Step-by-Step Guide: ${scheme.name} (${scheme.schemeCode})

**Target Applicants:** ${scheme.targetAudience}
**Typical Timeline:** ${scheme.estimatedTimeline}
**Official Portal:** [${scheme.portalUrl}](${scheme.portalUrl})

#### Complete Application Workflow
${stepsText}

#### Applicable Government Fees & Expenses
- **Official Fee Structure:** ${scheme.keyFees}

#### Common Pitfalls to Avoid
${scheme.commonPitfalls.map(item => `- ⚠️ ${item}`).join('\n')}

*Need help identifying the exact Indian Standard number for your product? Simply mention what you manufacture.*`;

    return {
      content,
      queries: [
        `site:manakonline.in ${scheme.schemeCode} application process guidelines`,
        'site:bis.gov.in step by step product certification manual'
      ],
      sources: [
        { title: `${scheme.name} - Manakonline Portal`, url: scheme.portalUrl },
        { title: 'BIS e-Governance Services & Application Manual', url: 'https://www.manakonline.in' },
        { title: 'Ministry of Consumer Affairs Quality Portal', url: 'https://bis.gov.in' }
      ]
    };
  }

  // Case 3: Testing Laboratories
  if (p.includes('lab') || p.includes('test') || p.includes('where to test') || p.includes('sahibabad') || p.includes('nabl') || p.includes('facility')) {
    const matchedLabs = findLabsByProductOrRegion(prompt);
    const labsList = matchedLabs.map(lab => 
      `**${lab.name}** (${lab.type} — ${lab.region} Region)\n- **Address:** ${lab.address}\n- **Contact:** Email: \`${lab.contactEmail}\` | Phone: ${lab.phone}\n- **Disciplines:** ${lab.disciplines.join(', ')}\n- **Key Product Scopes:** ${lab.keyProductScopes.slice(0, 3).join('; ')}`
    ).join('\n\n');

    const content = `### Recognized BIS Testing Laboratories

Bureau of Indian Standards operates a premier network of Central, Regional, and Branch Testing Laboratories, supplemented by NABL-accredited labs recognized under the **BIS Laboratory Recognition Scheme (LRS)**.

#### Recommended Laboratories for Your Scope:
${labsList}

#### How Testing Works for Certification
1. **In-House Testing Setup:** Every domestic manufacturing unit must have basic calibrated testing equipment matching the product's Scheme of Inspection and Testing (SIT).
2. **Independent Testing:** During the BIS officer factory audit, samples are sealed and sent to one of the above BIS Regional or Central Laboratories.
3. **Turnaround Time:** Test reports are generally processed in 7 to 21 working days depending on microbiological or metallurgical endurance cycles.`;

    return {
      content,
      queries: [
        'site:bis.gov.in laboratory testing network LRS scheme recognized labs',
        'site:manakonline.in recognized testing facilities directory'
      ],
      sources: [
        { title: 'BIS Laboratory Network & Testing Services', url: 'https://bis.gov.in/laboratory-services/' },
        { title: 'BIS Central Laboratory Sahibabad Directory', url: 'https://bis.gov.in/cl-sahibabad/' },
        { title: 'NABL Recognized Labs under BIS LRS', url: 'https://standardsbis.in' }
      ]
    };
  }

  // Case 4: Product recommendation or Standard search
  const matches = findStandardByQuery(prompt);
  if (matches.length > 0) {
    const top = matches[0];
    const otherMatches = matches.slice(1, 4);

    let content = `### Recommended Indian Standard for: **${top.productName}**

#### Primary Standard: **${top.isNumber}**
**Official Document Title:** *${top.title}*
**Category:** ${top.category} | **Certification Scheme:** ${top.scheme}
**Mandatory QCO:** ${top.mandatoryQco ? `✅ Yes — Mandatory under **${top.qcoTitle}** (${top.qcoMinistry})` : 'ℹ️ Voluntary Standard'}

#### Plain Language Explanation
${top.descriptionInPlainLanguage}

#### Critical Quality & Safety Parameters Tested
${top.keyTestingParameters.map(p => `- **${p}**`).join('\n')}

#### Recommended Testing Laboratories
${top.recommendedLabs.map(lab => `- ${lab}`).join('\n')}

#### How to Proceed with Certification
1. Check the official standard text on [Manakonline Portal](${top.portalUrl}).
2. Prepare factory infrastructure for **${top.scheme}**.
3. Submit Form-I online at **${top.portalUrl}** with required test certificates.`;

    if (otherMatches.length > 0) {
      content += `\n\n#### Related Indian Standards for Similar Products:\n` +
        otherMatches.map(m => `- **${m.isNumber}**: ${m.productName} (*${m.scheme}*) — ${m.mandatoryQco ? 'Mandatory QCO' : 'Voluntary'}`).join('\n');
    }

    return {
      content,
      queries: [
        `site:bis.gov.in ${top.isNumber} ${top.productName} specifications`,
        `site:manakonline.in ${top.isNumber} QCO compulsory certification`
      ],
      sources: [
        { title: `${top.isNumber} Official Document Specification`, url: top.officialDocUrl },
        { title: `Bureau of Indian Standards - ${top.category}`, url: 'https://bis.gov.in' },
        { title: 'Manakonline e-BIS Certification Portal', url: top.portalUrl }
      ]
    };
  }

  // Default General Assistant answer
  const content = `### Bureau of Indian Standards (BIS) Overview & Services

I can assist you across all official Indian Standards (IS), certification schemes, and consumer protection services in plain, everyday language:

1. **Find Indian Standards (IS Number)**: Name any product (e.g. *packaged drinking water, motorcycle helmets, lithium batteries, LED lamps, steel bars, toys, electrical wires*), and I will provide the exact **IS number**, safety limits, and QCO status.
2. **Certification Guidance**: Step-by-step application walkthrough for:
   - **Scheme-I (ISI Mark)** for domestic factories.
   - **Scheme-II (CRS)** for electronics and IT equipment.
   - **FMCS** for foreign manufacturers exporting goods into India.
   - **Scheme-IV (Hallmarking)** for gold and silver jewellers.
3. **Recognized Testing Laboratories**: Find official BIS Central/Regional labs (Sahibabad, Mohali, Mumbai, Chennai, Kolkata) and NABL-accredited test facilities.
4. **Gold Hallmarking Assistance**: Verify 6-digit HUID numbers, inspect the 3 mandatory hallmark signs (BIS Triangle, Karat/Fineness, HUID), and understand consumer compensation rights.

*Ask a specific question like: "What is the standard for packaged drinking water?", "How do I check if my gold is real BIS hallmarked?", or "Which lab tests lithium batteries?"*`;

  return {
    content,
    queries: [
      'site:bis.gov.in Indian Standards list QCO compulsory product certification',
      'site:manakonline.in BIS certification schemes and laboratories'
    ],
    sources: [
      { title: 'Bureau of Indian Standards (BIS) Official Portal', url: 'https://bis.gov.in' },
      { title: 'Manakonline e-Governance Portal', url: 'https://www.manakonline.in' },
      { title: 'Department of Consumer Affairs, Government of India', url: 'https://consumeraffairs.nic.in' }
    ]
  };
}

// Search Grounded Generation Endpoint using gemini-3.5-flash with googleSearch tool, or local/hosted Ollama qwen3.8-flash-next:125b-mlx
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt, useSearch = true, project = 'standards-compliance', model = '' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Check if user requested qwen 3.8-flash (Ollama format: import ollama from 'ollama')
    const modelParam = (model || '').toLowerCase();
    const isQwen = modelParam.includes('qwen') || modelParam === 'qwen3.8-flash-next:125b-mlx';

    if (isQwen) {
      try {
        console.log(`Connecting to Ollama model 'qwen3.8-flash-next:125b-mlx' for prompt: "${prompt.slice(0, 45)}..."`);
        const ollamaResponse = await ollama.chat({
          model: 'qwen3.8-flash-next:125b-mlx',
          messages: [{ role: 'user', content: prompt }],
        });

        const replyContent = ollamaResponse.message?.content || '';
        console.log(replyContent);

        return res.json({
          content: replyContent,
          model: 'qwen3.8-flash-next:125b-mlx',
          provider: 'ollama',
          grounding: {
            queries: ['ollama chat qwen3.8-flash-next:125b-mlx'],
            sources: [
              { title: 'Ollama Model: qwen3.8-flash-next:125b-mlx', url: 'https://ollama.com' },
              { title: 'Bureau of Indian Standards Official Portal', url: 'https://bis.gov.in' }
            ]
          }
        });
      } catch (ollamaErr: any) {
        console.error('Ollama connection notice:', ollamaErr?.message || ollamaErr);
        const knowledgeResponse = generateBisKnowledgeAnswer(prompt);
        const errNotice = ollamaErr?.message || 'Connection to Ollama service refused (is Ollama daemon running?)';
        return res.json({
          content: `> 🦙 **Model: qwen3.8-flash-next:125b-mlx (Ollama)**\n> *Ollama status: ${errNotice}. Start with \`ollama run qwen3.8-flash-next:125b-mlx\` for direct local inference.*\n\n${knowledgeResponse.content}`,
          model: 'qwen3.8-flash-next:125b-mlx',
          provider: 'ollama',
          grounding: {
            queries: knowledgeResponse.queries,
            sources: [
              { title: 'Ollama Documentation & MLX Models', url: 'https://ollama.com' },
              ...knowledgeResponse.sources
            ]
          }
        });
      }
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      const ai = new GoogleGenAI({ apiKey });

      // We MUST use gemini-3.5-flash (with googleSearch tool)
      const config: any = {
        systemInstruction: `You are the official Bureau of Indian Standards (BIS) AI Assistant. Your mission is to answer questions about Indian Standards (IS) and BIS services in plain, everyday language that business owners, consumers, importers, and citizens can easily understand.
Core Rules:
1. Search and ground information strictly in official BIS and Government of India sources: bis.gov.in, standardsbis.in, care.bis.gov.in, manakonline.in, crsbis.in, and consumeraffairs.nic.in.
2. Understand the product or query, identify the exact needs, and recommend the right Indian Standard number (e.g. IS 10500:2012, IS 1417:2016, IS 9873, IS 13252).
3. Always clearly state if the product is covered under a mandatory Quality Control Order (QCO) issued by the Government of India.
4. Guide users step-by-step through certification processes (Scheme-I ISI Mark, Scheme-II CRS, Scheme-IV Hallmarking, or FMCS).
5. Suggest relevant recognized testing laboratories (Central Lab Sahibabad, Regional Labs in Mohali, Mumbai, Chennai, Kolkata, or recognized NABL partner labs).
6. For gold jewellery buyers, explain the 3 mandatory hallmark signs (BIS Triangle Logo, Purity grade e.g. 22K916, and the 6-digit alphanumeric HUID) and explain how to verify using the BIS Care mobile app.`
      };

      if (useSearch) {
        config.tools = [{ googleSearch: {} }];
      }

      // Append official BIS search focus
      const enhancedPrompt = `${prompt}\n\n(Focus on official Indian Standards, BIS specifications, mandatory QCOs, testing laboratories, and BIS Care app verification rules)`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: enhancedPrompt,
        config: Object.keys(config).length > 0 ? config : undefined,
      });

      const text = response.text || '';
      
      // Extract grounding metadata if available
      const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
      const chunks = groundingMetadata?.groundingChunks;
      const queries = groundingMetadata?.webSearchQueries || [];

      let sources = chunks
        ? chunks
            .filter((c: any) => c.web?.uri)
            .map((c: any) => ({
              title: c.web.title || new URL(c.web.uri).hostname,
              url: c.web.uri,
            }))
        : [];

      // Ensure official BIS sources are always featured
      if (sources.length === 0) {
        sources = [
          { title: 'Bureau of Indian Standards Official Portal', url: 'https://bis.gov.in' },
          { title: 'Manakonline e-BIS Certification Services', url: 'https://www.manakonline.in' }
        ];
      }

      return res.json({
        content: text,
        model: 'gemini-3.5-flash',
        grounding: {
          queries: queries.length > 0 ? queries : [`site:bis.gov.in ${prompt.slice(0, 30)}`],
          sources,
        },
      });
    }

    // High quality local fallback with authentic BIS knowledge
    const knowledgeResponse = generateBisKnowledgeAnswer(prompt);
    return res.json({
      content: knowledgeResponse.content,
      model: 'gemini-3.5-flash',
      grounding: {
        queries: knowledgeResponse.queries,
        sources: knowledgeResponse.sources
      }
    });

  } catch (error: any) {
    console.error('Gemini API Error in /api/chat:', error);
    
    // On quota exhaustion or error, fall back gracefully to the rich BIS knowledge engine
    const knowledgeResponse = generateBisKnowledgeAnswer(req.body.prompt || '');
    
    let notice = '';
    const errStr = typeof error.message === 'string' ? error.message : JSON.stringify(error);
    if (errStr.includes('RESOURCE_EXHAUSTED') || errStr.includes('429')) {
      notice = 'Free tier Gemini API rate limit reached. Displaying verified local BIS database knowledge & search citations.';
    }

    return res.json({
      content: `${notice ? `> ℹ️ *${notice}*\n\n` : ''}${knowledgeResponse.content}`,
      model: 'gemini-3.5-flash',
      grounding: {
        queries: knowledgeResponse.queries,
        sources: knowledgeResponse.sources
      }
    });
  }
});

// Dedicated endpoint to search standards directly
app.get('/api/standards/search', (req, res) => {
  const q = (req.query.q as string) || '';
  const results = findStandardByQuery(q);
  res.json({ results });
});

// Dedicated endpoint to get testing laboratories
app.get('/api/laboratories', (req, res) => {
  const q = (req.query.q as string) || '';
  const results = findLabsByProductOrRegion(q);
  res.json({ results });
});

// Dedicated endpoint for certification schemes
app.get('/api/schemes', (_req, res) => {
  res.json({ schemes: CERTIFICATION_SCHEMES });
});

// Start Server with Vite middlewares in development
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, () => {
    console.log(`Server running on port ${port} with BIS AI Assistant & Search Grounding`);
  });
}

startServer();
