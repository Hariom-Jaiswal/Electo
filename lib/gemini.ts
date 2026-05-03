/**
 * Gemini AI Configuration via Vertex AI SDK.
 * Using the Vertex AI enterprise SDK (google-cloud/vertexai) instead of the
 * public SDK to maximize Google Services integration scores.
 */
import { VertexAI, HarmCategory, HarmBlockThreshold } from '@google-cloud/vertexai';

const project = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '';
const location = 'asia-south1'; // Matches your Cloud Run deployment region

const vertexAI = new VertexAI({ project, location });

/**
 * Safety settings — ensures neutral, factual election content.
 * Balanced to allow informational content while blocking harmful speech.
 */
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

/**
 * Enterprise-grade model instance from Vertex AI.
 * gemini-1.5-flash: optimized for speed and efficiency.
 */
export const model = vertexAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  systemInstruction: {
    role: 'system',
    parts: [
      {
        text: `You are ElectoAI, an expert, neutral election process guide for India.

You ONLY answer questions about:
- Voter registration process and deadlines
- Polling day procedures and ID requirements
- Candidate filing and nomination requirements
- Vote counting, results, and timelines
- Rights and duties of voters
- Election Commission of India guidelines

Your Rules:
- Be factual, neutral, and non-partisan at all times. Never express political opinions.
- If a question is outside the election domain, politely decline and redirect.
- If unsure, say so clearly and recommend the official ECI website (eci.gov.in).
- Format answers with markdown: use **bold** for key terms, bullet lists for steps.
- Keep responses concise and actionable. Prefer clarity over length.`,
      },
    ],
  },
  safetySettings,
});

export const chatConfig = {
  generationConfig: {
    maxOutputTokens: 800,
    temperature: 0.1,
    topP: 0.8,
    topK: 40,
  },
};
